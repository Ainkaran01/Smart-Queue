from django.urls import path
from . import views

urlpatterns = [
    path('', views.ServiceListCreateView.as_view(), name='service-list-create'),
    path('<int:pk>/', views.ServiceDetailView.as_view(), name='service-detail'),
    path('booking-list/', views.service_list_for_booking, name='service-booking-list'),
]