from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Appointment

@shared_task
def send_appointment_confirmation(appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        
        subject = f'Appointment Confirmation - Token #{appointment.token_code}'
        message = f"""
        Dear {appointment.citizen.get_full_name()},
        
        Your appointment has been successfully booked!
        
        Details:
        - Token Number: #{appointment.token_code}
        - Service: {appointment.service.name}
        - Department: {appointment.service.department}
        - Scheduled Time: {appointment.appointment_datetime.strftime('%Y-%m-%d %I:%M %p')}
        - Priority: {appointment.get_priority_display()}
        - Estimated Wait Time: {appointment.predicted_wait_minutes} minutes
        - Expected Completion: {appointment.estimated_completion_time.strftime('%Y-%m-%d %I:%M %p')}
        
        Please arrive at least 15 minutes before your scheduled time.
        
        Thank you!
        Smart Queue Management System
        """
        
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [appointment.citizen.email],
            fail_silently=False,
        )
        
        return f"Confirmation email sent for appointment {appointment.token_code}"
        
    except Appointment.DoesNotExist:
        return f"Appointment with id {appointment_id} not found"
    except Exception as e:
        return f"Error sending email: {str(e)}"