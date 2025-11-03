# apps/appointments/management/commands/generate_slots.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.services.models import Service
from apps.appointments.models import ServiceSlot
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Generate service slots for the next 30 days'

    def handle(self, *args, **options):
        start_date = timezone.now().date()
        end_date = start_date + timedelta(days=30)
        services = Service.objects.all()
        
        for service in services:
            current_date = start_date
            while current_date <= end_date:
                # Generate slots from 8 AM to 5 PM, every 30 minutes
                for hour in range(8, 17):
                    for minute in [0, 30]:
                        slot_time = timezone.make_aware(
                            datetime.combine(current_date, datetime.min.time())
                        ).replace(hour=hour, minute=minute)
                        
                        # Create slot if it doesn't exist
                        ServiceSlot.objects.get_or_create(
                            service=service,
                            datetime=slot_time,
                            defaults={
                                'is_available': True,
                                'max_capacity': 1  # Default capacity
                            }
                        )
                current_date += timedelta(days=1)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully generated slots for {services.count()} services')
        )