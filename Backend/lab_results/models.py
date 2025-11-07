from django.db import models
from patients.models import Patient
from lab_specialists.models import LabSpecialist

class LabResult(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='results')
    specialist = models.ForeignKey(LabSpecialist, on_delete=models.CASCADE, related_name='results')
    total_cholesterol = models.DecimalField(max_digits=10, decimal_places=2)
    hdl_cholesterol = models.DecimalField(max_digits=10, decimal_places=2)
    ldl_cholesterol = models.DecimalField(max_digits=10, decimal_places=2)
    triglycerides = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Results for {self.patient.admission_code} by {self.specialist.internal_code}"
