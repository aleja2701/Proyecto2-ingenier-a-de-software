from django.db import models

class LabSpecialist(models.Model):
    TITLE_CHOICES = [
        ('BACT', 'Bacteriólogo/a'),
        ('MICR', 'Microbiólogo/a'),
        ('BIOL', 'Biólogo/a'),
    ]
    
    internal_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=4, choices=TITLE_CHOICES)
    phone = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.name} ({self.internal_code})"
