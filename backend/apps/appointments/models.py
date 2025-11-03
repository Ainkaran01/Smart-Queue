# apps/appointments/models.py
import uuid
from django.db import models
from django.contrib.auth import get_user_model
from apps.services.models import Service

User = get_user_model()

class ServiceSlot(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='slots')
    datetime = models.DateTimeField()
    is_available = models.BooleanField(default=True)
    max_capacity = models.IntegerField(default=1)
    current_bookings = models.IntegerField(default=0)

    class Meta:
        unique_together = ['service', 'datetime']
        ordering = ['datetime']

    def __str__(self):
        return f"{self.service.name} - {self.datetime.strftime('%Y-%m-%d %H:%M')}"

    def is_full(self):
        return self.current_bookings >= self.max_capacity


class Appointment(models.Model):
    class Priority(models.TextChoices):
        NORMAL = 'NORMAL', 'Normal'
        ELDERLY = 'ELDERLY', 'Elderly'
        DISABLED = 'DISABLED', 'Disabled'
        EMERGENCY = 'EMERGENCY', 'Emergency'

    class Status(models.TextChoices):
        SCHEDULED = 'SCHEDULED', 'Scheduled'
        WAITING = 'WAITING', 'Waiting'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        NO_SHOW = 'NO_SHOW', 'No Show'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    token_code = models.CharField(max_length=10, unique=True, blank=True)
    appointment_datetime = models.DateTimeField()
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.NORMAL)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.SCHEDULED)
    predicted_wait_minutes = models.IntegerField(default=0)
    actual_wait_minutes = models.IntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slot = models.ForeignKey(ServiceSlot, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    qr_code = models.ImageField(upload_to="qrcodes/", null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"#{self.token_code} - {self.citizen.get_full_name()} ({self.service.name})"

    def save(self, *args, **kwargs):
    # Generate token if not already set
     if not self.token_code:
        self.token_code = self.generate_token_code()

    # Link appointment time to slot if available
     if self.slot:
        self.appointment_datetime = self.slot.datetime

        # Prevent overbooking
        if self.slot.is_full() and not self.pk:  # Only check when creating, not updating
            raise ValueError("This slot is already full.")

        # Update slot bookings
        if not self.pk:  # New appointment
            self.slot.current_bookings += 1
            if self.slot.current_bookings >= self.slot.max_capacity:
                self.slot.is_available = False
            self.slot.save()

        super().save(*args, **kwargs)


    def generate_token_code(self):
        import random, string
        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            if not Appointment.objects.filter(token_code=code).exists():
                return code

    @property
    def estimated_completion_time(self):
        from django.utils import timezone
        return self.appointment_datetime + timezone.timedelta(minutes=self.predicted_wait_minutes)