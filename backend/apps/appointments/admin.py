from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('token_code', 'citizen', 'service', 'appointment_datetime', 'priority', 'status', 'created_at')
    list_filter = ('status', 'priority', 'service__department', 'appointment_datetime', 'created_at')
    search_fields = ('token_code', 'citizen__first_name', 'citizen__last_name', 'citizen__email')
    list_editable = ('status',)
    readonly_fields = ('id', 'token_code', 'predicted_wait_minutes', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Appointment Info', {
            'fields': ('id', 'token_code', 'citizen', 'service', 'appointment_datetime')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority')
        }),
        ('Wait Times', {
            'fields': ('predicted_wait_minutes', 'actual_wait_minutes')
        }),
        ('Additional Info', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )