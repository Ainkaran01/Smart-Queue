from django.db import models

class Service(models.Model):
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=50)
    description = models.TextField()
    avg_service_minutes = models.IntegerField(default=15)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['department', 'name']

    def __str__(self):
        return f"{self.name} ({self.department})"