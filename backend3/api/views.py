from django.http import HttpResponse
from .ultility import *


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