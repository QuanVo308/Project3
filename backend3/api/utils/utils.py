from re import I
from ..models import *
from django.core.validators import validate_ipv4_address
import ipaddress

def validate_ip_octet(octet): 
    # if type(octet) == int:

    octet = int(octet)
    if octet <= 255 and octet >=0:
        return True
    return False

def validate_ip_address(ip):
    try:
        # print(pop.range_ip)
        ipaddress.ip_address(ip)
    except:
        print('wrong ip address')
        return False

    return True

def popp_format(name):
    shortened = False

    for index, i in enumerate(name):
        # print(i, index)
        if i=='0' and not shortened:
           name = name[:index] + name[index+1:]
           shortened = True

    # print(name)

    return name