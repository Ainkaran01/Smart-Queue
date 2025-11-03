# apps/appointments/views.py
import json
from django.conf import settings
from rest_framework import generics, status, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.mail import  EmailMultiAlternatives
from datetime import datetime
from io import BytesIO
import qrcode
from django.core.files.base import ContentFile
from django.utils import timezone

from apps.services.models import Service
from .models import Appointment, ServiceSlot
from .serializers import (
    AppointmentCreateSerializer,
    AppointmentSerializer,
    AppointmentListSerializer,
    MyAppointmentSerializer
)
from apps.ops.prediction import predict_wait_minutes

# --- QR generator helper ---
import json
from io import BytesIO
from django.core.files.base import ContentFile


def generate_qr(appointment):
    data = {
        "token": str(appointment.id),
        "name": f"{appointment.citizen.first_name} {appointment.citizen.last_name}",
        "service": appointment.service.name,
        "department": appointment.service.department,
        "datetime": appointment.appointment_datetime.strftime("%Y-%m-%d %H:%M"),
        "estimated_wait": appointment.predicted_wait_minutes
    }
    
    qr = qrcode.QRCode(box_size=8, border=2)
    qr.add_data(json.dumps(data))  # Encode as JSON
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return ContentFile(buffer.getvalue(), name=f"{appointment.id}.png")


# --- Available Slots ---
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def available_slots(request):
    date_str = request.query_params.get('date')
    service_id = request.query_params.get('service_id')
    
    if not date_str or not service_id:
        return Response({"error": "date and service_id query parameters are required"}, status=400)

    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        service = Service.objects.get(id=service_id)
    except (ValueError, Service.DoesNotExist):
        return Response({"error": "Invalid date or service_id"}, status=400)

    available_slots = ServiceSlot.objects.filter(
        service=service,
        datetime__date=date_obj,
        is_available=True
    )
    
    slots_data = [{
        "id": slot.id, 
        "datetime": slot.datetime,
        "current_bookings": slot.current_bookings,
        "max_capacity": slot.max_capacity
    } for slot in available_slots]
    
    return Response(slots_data)


# --- Create Appointment ---
class CreateAppointmentView(generics.CreateAPIView):
    serializer_class = AppointmentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        slot_id = self.request.data.get('slot_id')
        appointment_datetime = serializer.validated_data['appointment_datetime']
        service = serializer.validated_data['service']

        # --- Slot-based booking ---
        slot = None
        if slot_id:
            local_datetime = timezone.localtime(appointment_datetime)
            slot = get_object_or_404(ServiceSlot, id=slot_id, service=service, datetime=local_datetime)
            if slot.is_full():
                raise serializers.ValidationError("This time slot is already fully booked.")

            slot.current_bookings += 1
            if slot.current_bookings >= slot.max_capacity:
                slot.is_available = False
            slot.save()

        # --- Save appointment ---
        appointment = serializer.save(citizen=self.request.user, slot=slot)

        # --- Predict wait time ---
        predicted_wait = predict_wait_minutes(appointment)
        appointment.predicted_wait_minutes = predicted_wait

        # --- Generate QR code with full booking details ---
        qr_img = generate_qr(appointment)
        appointment.qr_code.save(f"appt_{appointment.id}.png", qr_img, save=True)
        appointment.save()

        # --- Send confirmation email ---
        local_time = timezone.localtime(appointment.appointment_datetime)
        subject = "Appointment Confirmation"
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [self.request.user.email]

        text_content = f"""
Hello {self.request.user.first_name} {self.request.user.last_name},

Your appointment is confirmed.

📅 Date & Time: {local_time.strftime("%Y-%m-%d %H:%M")}
📍 Service: {service.name} ({service.department})
⏳ Estimated Wait Time: {predicted_wait} minutes
🔑 Token: {appointment.id}

Please find your QR code attached for check-in.
"""

        html_content = f"""
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color:#2c3e50;">Appointment Confirmation</h2>
    <p>Dear {self.request.user.first_name},</p>
    <p>Your appointment has been successfully booked. Here are the details:</p>
    <table style="border-collapse: collapse; margin: 15px 0;">
      <tr><td><b>Date & Time:</b></td><td>{local_time.strftime("%Y-%m-%d %H:%M")}</td></tr>
      <tr><td><b>Service:</b></td><td>{service.name} ({service.department})</td></tr>
      <tr><td><b>Estimated Wait:</b></td><td>{predicted_wait} minutes</td></tr>
      <tr><td><b>Token:</b></td><td>{appointment.id}</td></tr>
    </table>
    <p>Please find your QR code attached for check-in at the counter.</p>
    <p style="color:gray; font-size: 12px;">This is an automated email. Please do not reply.</p>
  </body>
</html>
"""

        # Create email and attach QR
        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")

        if appointment.qr_code:
            qr_image = appointment.qr_code.read()
            msg.attach(f"appointment_{appointment.id}.png", qr_image, "image/png")

        msg.send()

        return appointment



# --- My Appointments ---
class MyAppointmentsView(generics.ListAPIView):
    serializer_class = MyAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(citizen=self.request.user)


# --- All Appointments (Admin/Staff) ---
class AllAppointmentsView(generics.ListAPIView):
    serializer_class = AppointmentListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin or user.is_staff_member:
            return Appointment.objects.all()
        return Appointment.objects.filter(citizen=user)


# --- Appointment Detail ---
class AppointmentDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin or user.is_staff_member:
            return Appointment.objects.all()
        return Appointment.objects.filter(citizen=user)


# --- Update Status ---
@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_appointment_status(request, pk):
    user = request.user
    if not (user.is_admin or user.is_staff_member):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    appointment = get_object_or_404(Appointment, pk=pk)
    new_status = request.data.get('status')
    if new_status not in [choice[0] for choice in Appointment.Status.choices]:
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    appointment.status = new_status
    appointment.save()
    return Response(AppointmentSerializer(appointment).data)


# --- Queue Status ---
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def queue_status(request):
    if not (request.user.is_admin or request.user.is_staff_member):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    waiting_appointments = Appointment.objects.filter(status='WAITING').order_by('appointment_datetime')
    in_progress_appointments = Appointment.objects.filter(status='IN_PROGRESS')

    return Response({
        'waiting_queue': AppointmentListSerializer(waiting_appointments, many=True).data,
        'in_progress': AppointmentListSerializer(in_progress_appointments, many=True).data,
        'total_waiting': waiting_appointments.count(),
        'total_in_progress': in_progress_appointments.count()
    })


