# apps/appointments/serializers.py
from rest_framework import serializers
from django.utils import timezone
from .models import Appointment, ServiceSlot
from apps.services.serializers import ServiceListSerializer
from apps.accounts.serializers import UserSerializer

class AppointmentCreateSerializer(serializers.ModelSerializer):
    slot_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Appointment
        fields = ('service', 'appointment_datetime', 'priority', 'notes', 'slot_id')

    def validate(self, data):
        appointment_datetime = data.get('appointment_datetime')
        service = data.get('service')
        slot_id = data.get('slot_id', None)
        
        # Check if slot is provided and valid
        if slot_id:
            try:
                slot = ServiceSlot.objects.get(id=slot_id, service=service, datetime=appointment_datetime)
                if slot.is_full():
                    raise serializers.ValidationError("This time slot is already fully booked.")
            except ServiceSlot.DoesNotExist:
                raise serializers.ValidationError("Invalid time slot selected.")
        else:
            # Fallback: Check for any existing appointment at this time
            if Appointment.objects.filter(
                service=service, 
                appointment_datetime=appointment_datetime
            ).exists():
                raise serializers.ValidationError("This time slot is already booked.")
        
        return data


class AppointmentSerializer(serializers.ModelSerializer):
    service = ServiceListSerializer(read_only=True)
    citizen = UserSerializer(read_only=True)
    estimated_completion_time = serializers.ReadOnlyField()
    qr_code_url = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = '__all__'  # includes qr_code too

    def get_qr_code_url(self, obj):
        if obj.qr_code:
            return obj.qr_code.url
        return None


class AppointmentListSerializer(serializers.ModelSerializer):
    service = ServiceListSerializer(read_only=True)
    citizen = UserSerializer(read_only=True)
    qr_code_url = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = (
            'id', 'token_code', 'service', 'citizen', 'appointment_datetime',
            'priority', 'status', 'predicted_wait_minutes', 'created_at',
            'qr_code_url'
        )

    def get_qr_code_url(self, obj):
        if obj.qr_code:
            return obj.qr_code.url
        return None


class MyAppointmentSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    estimated_completion_time = serializers.ReadOnlyField()
    qr_code_url = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = (
            'id', 'token_code', 'service_name', 'appointment_datetime', 'priority',
            'status', 'predicted_wait_minutes', 'estimated_completion_time',
            'notes', 'created_at', 'qr_code_url'
        )

    def get_qr_code_url(self, obj):
        if obj.qr_code:
            return obj.qr_code.url
        return None
