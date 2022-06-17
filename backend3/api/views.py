from django.http import HttpResponse
from .ultility import *
from .models import *


def index(request):
    return HttpResponse("Hello, world!!!!")

def test(request):
    popplus = PopPlus.objects.filter()[0]
    
    print(validate_popplus(popplus))
    return HttpResponse("Test")