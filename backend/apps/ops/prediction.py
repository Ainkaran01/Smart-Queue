import os
import joblib
import pandas as pd
from django.conf import settings
from datetime import datetime, timedelta
from apps.appointments.models import Appointment
from django.db.models import Avg



# Path to the trained model
MODEL_PATH = os.path.join(settings.BASE_DIR, 'ml', 'wait_predictor.joblib')

def load_model():
    """Load the trained ML model"""
    try:
        if os.path.exists(MODEL_PATH):
            return joblib.load(MODEL_PATH)
        else:
            print(f"Model file not found at {MODEL_PATH}")
            return None
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def predict_wait_minutes(appointment):
    """Predict wait time for an appointment using ML model"""
    try:
        model = load_model()
        
        if model is None:
            # Fallback: simple estimation based on service time and queue
            return estimate_wait_time_fallback(appointment)
        
        # Prepare features
        appt_datetime = appointment.appointment_datetime
        hour = appt_datetime.hour
        weekday = appt_datetime.weekday()
        service_avg = appointment.service.avg_service_minutes
        
        # Count current queue length for the same service
        queue_length = Appointment.objects.filter(
            service=appointment.service,
            appointment_datetime__date=appt_datetime.date(),
            status__in=['SCHEDULED', 'WAITING']
        ).count()
        
        # Simulate active counters (could be made dynamic)
        counters_active = 3  # Default assumption
        
        # Priority mapping
        priority_map = {'NORMAL': 1, 'ELDERLY': 2, 'DISABLED': 3, 'EMERGENCY': 4}
        priority_level = priority_map.get(appointment.priority, 1)
        
        # Create feature array
        features = pd.DataFrame({
            'hour': [hour],
            'weekday': [weekday],
            'service_avg_minutes': [service_avg],
            'queue_length': [queue_length],
            'counters_active': [counters_active],
            'priority': [priority_level]
        })
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Ensure reasonable bounds
        min_wait = max(5, service_avg // 2)  # Minimum 5 minutes or half service time
        max_wait = service_avg * 10  # Maximum 10x service time
        
        predicted_wait = max(min_wait, min(max_wait, int(prediction)))
        
        return predicted_wait
        
    except Exception as e:
        print(f"Error in prediction: {e}")
        return estimate_wait_time_fallback(appointment)

def estimate_wait_time_fallback(appointment):
    """Fallback estimation when ML model is not available"""
    base_time = appointment.service.avg_service_minutes
    
    # Count appointments scheduled around the same time
    start_time = appointment.appointment_datetime - timedelta(hours=1)
    end_time = appointment.appointment_datetime + timedelta(hours=1)
    
    nearby_appointments = Appointment.objects.filter(
        service=appointment.service,
        appointment_datetime__range=(start_time, end_time),
        status__in=['SCHEDULED', 'WAITING']
    ).count()
    
    # Simple calculation: base time * queue factor
    queue_factor = max(1, nearby_appointments * 0.5)
    estimated_wait = int(base_time * queue_factor)
    
    # Priority adjustments
    if appointment.priority == 'EMERGENCY':
        estimated_wait = max(5, estimated_wait // 4)
    elif appointment.priority in ['ELDERLY', 'DISABLED']:
        estimated_wait = max(10, estimated_wait // 2)
    
    return min(estimated_wait, base_time * 8)  # Cap at 8x service time

def get_queue_analytics():
    """Get queue analytics data"""
    today = datetime.now().date()
    
    # Today's appointments by status
    today_appointments = Appointment.objects.filter(
        appointment_datetime__date=today
    )
    
    status_counts = {}
    for status_choice in Appointment.Status.choices:
        status_counts[status_choice[1]] = today_appointments.filter(
            status=status_choice[0]
        ).count()
    
    # Average wait times by priority
    priority_wait_times = {}
    for priority_choice in Appointment.Priority.choices:
        avg_wait = today_appointments.filter(
            priority=priority_choice[0]
        ).aggregate(
            avg_wait=Avg('predicted_wait_minutes')
        )['avg_wait'] or 0
        priority_wait_times[priority_choice[1]] = round(avg_wait, 1)
    
    return {
        'total_today': today_appointments.count(),
        'status_breakdown': status_counts,
        'avg_wait_by_priority': priority_wait_times,
        'current_queue_length': today_appointments.filter(
            status__in=['SCHEDULED', 'WAITING']
        ).count()
    }
