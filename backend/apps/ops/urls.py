from django.urls import path
from . import views

urlpatterns = [
    path('analytics/', views.analytics_dashboard, name='analytics-dashboard'),
    path('service-performance/', views.service_performance, name='service-performance'),
]