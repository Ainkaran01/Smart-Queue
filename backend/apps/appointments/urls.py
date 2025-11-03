from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.CreateAppointmentView.as_view(), name='create-appointment'),
    path('mine/', views.MyAppointmentsView.as_view(), name='my-appointments'),
    path('all/', views.AllAppointmentsView.as_view(), name='all-appointments'),
    path('<uuid:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
    path('<uuid:pk>/status/', views.update_appointment_status, name='update-appointment-status'),
    path('queue/status/', views.queue_status, name='queue-status'),
    path('available-slots/', views.available_slots, name='available-slots'),
]