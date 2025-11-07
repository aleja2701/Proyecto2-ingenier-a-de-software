from rest_framework import serializers
from .models import LabSpecialist

class LabSpecialistSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabSpecialist
        fields = ['id', 'internal_code', 'name', 'title', 'phone']