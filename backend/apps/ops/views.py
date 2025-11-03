from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import models
from apps.appointments.models import Appointment
from .prediction import get_queue_analytics
from datetime import datetime
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_dashboard(request):
    """Get analytics data for dashboard"""
    user = request.user
    if not (user.is_admin or user.is_staff_member):
        return Response({'error': 'Permission denied'}, status=403)
    
    analytics = get_queue_analytics()
    today = datetime.now().date()
    
    # Additional stats
    total_appointments = Appointment.objects.count()
    completed_today = Appointment.objects.filter(
        appointment_datetime__date=today,
        status='COMPLETED'
    ).count()
    
    analytics.update({
        'total_appointments_all_time': total_appointments,
        'completed_today': completed_today,
    })
    
    return Response(analytics)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def service_performance(request):
    """Get service performance metrics"""
    user = request.user
    if not (user.is_admin or user.is_staff_member):
        return Response({'error': 'Permission denied'}, status=403)
    
    # Service-wise statistics
    from apps.services.models import Service
    
    services_data = []
    for service in Service.objects.filter(is_active=True):
        appointments = Appointment.objects.filter(service=service)
        
        service_stats = {
            'name': service.name,
            'department': service.department,
            'total_appointments': appointments.count(),
            'avg_wait_time': appointments.aggregate(
                avg=models.Avg('predicted_wait_minutes')
            )['avg'] or 0,
            'completion_rate': 0
        }
        
        total_completed_cancelled = appointments.filter(
            status__in=['COMPLETED', 'CANCELLED', 'NO_SHOW']
        ).count()
        
        if total_completed_cancelled > 0:
            completed = appointments.filter(status='COMPLETED').count()
            service_stats['completion_rate'] = (completed / total_completed_cancelled) * 100
        
        services_data.append(service_stats)
    
    return Response({'services': services_data})