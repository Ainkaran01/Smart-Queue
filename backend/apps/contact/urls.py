from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.contact_submission, name='contact_submission'),
    path('all/', views.list_contact_submissions, name='list_contact_submissions'), 
    path('toggle/<int:message_id>/', views.toggle_resolution, name='toggle_resolution'),
]