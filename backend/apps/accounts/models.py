from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class UserRole(models.TextChoices):
        CITIZEN = 'CITIZEN', 'Citizen'
        STAFF = 'STAFF', 'Staff'
        ADMIN = 'ADMIN', 'Admin'
    
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    role = models.CharField(
        max_length=10,
        choices=UserRole.choices,
        default=UserRole.CITIZEN
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

    @property
    def is_admin(self):
        return self.role == self.UserRole.ADMIN

    @property
    def is_staff_member(self):
        return self.role == self.UserRole.STAFF

    @property
    def is_citizen(self):
        return self.role == self.UserRole.CITIZEN