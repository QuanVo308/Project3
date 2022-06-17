from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework import Response
from .models import *
from .ultility import *
from .serializers import *
from .models import *


def index(request):
    return HttpResponse("Hello, world!!!!")

def test(request):
    octet = 45
    print(validate_ip_octet(octet))
    print(validate_ip_octet(456))
    print(validate_ip_octet(255))
    print(validate_ip_octet(0))
    print(validate_ip_octet('3'))
    print(validate_ip_octet(3.3))
    return HttpResponse("Test")


class PopPlusViewSet(viewsets.ModelViewSet):
    queryset = PopPlus.objects.all()
    serializer_class = PopPlusSerializer


class PopViewSet(viewsets.ModelViewSet):
    queryset = Pop.objects.all()
    serializer_class = PopSerializer


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    
