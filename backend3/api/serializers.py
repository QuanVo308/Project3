from rest_framework import serializers
from .models import *


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class PopPlusSerializer(serializers.ModelSerializer):
    branch_name = serializers.ReadOnlyField(source='branch.name')
    class Meta:
        model = PopPlus
        fields = '__all__'
        extra_fields = ['pname']
<<<<<<< HEAD
=======

>>>>>>> 35c1738d7ded657d583ebd353bb16848739195ee

class PopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pop
        fields = '__all__'
        


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'