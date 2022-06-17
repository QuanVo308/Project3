from .models import *
from django.core.validators import validate_ipv4_address
import ipaddress

def validate_ip_octet(octet):
    if type(octet) == int:
        if octet <= 255 and octet >=0:
            return True
    return False


def validate_popplus_name(popplus):
    # print("branchID: ", popplus.branchID.id)
    branch = popplus.branch
    province = branch.province
    character = ['P', 'M']
    if province.acronym != popplus.name[0:3]:
        print("acronym wrong", province.acronym, popplus.name[0:3])
        return False
    if popplus.name[3] not in character:
        print("letter wrong", popplus.name[3])
        return False
    if len(popplus.name[4:]) != 3: 
        print("last number wrong", popplus.name[4:])
        return False
    if int(popplus.name[4:]) < 0 or int(popplus.name[4:]) > 999:
        print("last number wrong", popplus.name[4:])
        return False
    
    return True

def validate_popplus_vlan(popplus):
    if type(popplus.vlan_PPPoE) == int:
        if popplus.vlan_PPPoE <= 39 and popplus.vlan_PPPoE >= 30:
            return True
    
    print("popplus pppoe wrong")
    return False

def validate_popplus_area(popplus):
    if type(popplus.area_OSPF) == int:
        if popplus.area_OSPF <= 9 and popplus.area_OSPF >= 1:
            return True
    
    print("popplus area ospf wrong")
    return False

def validate_popplus(popplus):
    # print(popplus.id)
    # popplus.name = 'HNIL331'
    # popplus.area_OSPF = 9
    if (validate_popplus_name(popplus) 
    and validate_popplus_vlan(popplus)
    and validate_ip_octet(popplus.octet2_ip_OSPF_MGMT)
    and validate_ip_octet(popplus.octet2_ip_MGMT)
    and validate_ip_octet(popplus.octet3_ip_MGMT)
    and validate_popplus_area(popplus)):
        return True
    return False

def validate_pop_name(pop):
    # print("branchID: ", pop.branchID.id)
    popplus = pop.popPlus
    province = pop.province
    character = ['P', 'M', 'K', 'V', 'B']
    if province.acronym != pop.name[0:3]:
        print("acronym wrong", province.acronym, pop.name[0:3])
        return False
    if pop.name[3] not in character:
        print("letter wrong", pop.name[3])
        return False
    if len(pop.name[4:]) != 3: 
        print("last number wrong", pop.name[4:])
        return False
    if int(pop.name[4:]) < 0 or int(pop.name[4:]) > 999:
        print("last number wrong", pop.name[4:])
        return False
    
    return True

def validate_metro(metro):
    if metro[0:2] != 'MP':
        return False
    if len(metro[2:]) != 2:
        return False
    if int(metro[2:]) < 1 or int(metro[2:]) > 13:
        return False
    return True

def validate_pop_ring(pop):
    if pop.ring[0:3] != pop.province.acronym:
        print("wrong province", pop.ring[0:3], pop.province.acronym )
        return False
    if not validate_metro(pop.metro):
        return False
    if pop.ring[3:7] != pop.metro:
        print('metro')
        return False
    # print(pop.ring[7:11], pop.popPlus.name[3:] )
    if pop.ring[7:11] != pop.popPlus.name[3:]:
        print('popplus')
        return False
    if pop.ring[11] != 'R':
        print('R')
        return False
    if len(pop.ring[12:]) != 2:
        print('sequence')
        return False
    if int(pop.ring[12:]) < 0 or int(pop.ring[12:]) > 63:
        print("sequence")
        return False
    return True

def validate_pop_rangeIP(pop):
    # if not validate_ipv4_address(pop.range_ip):
    #     return False

    # if ipaddress.ip_address(pop.range_ip):
    #     return False

    try:
        ipaddress.ip_address(pop.range_ip)
    except:
        print('wrong ip address')
        return False

    # dot = pop.range_ip.find('.')
    # if dot == -1:
    #     return False
    
    # octet = pop.range_ip[:dot]
    # print(octet)

    # dot = pop.range_ip.find('.', dot + 1)
    # if dot == -1:
    #     return False

    # dot = pop.range_ip.find('.', dot + 1)
    # if dot == -1:
    #     return False
    return True 

def get_pop_rangeIP(pop):
    ip = '10.'
    # print(pop.popPlus.octet2_ip_MGMT)
    ip += str(pop.popPlus.octet2_ip_MGMT) + '.'
    # print(pop.popPlus.octet3_ip_MGMT + 17*64//255)
    ip += str(pop.popPlus.octet3_ip_MGMT + pop.sequence_ring*64//255) + '.'
    # print(17*64%255)
    ip += str(17*64%255)
    return ip

def validate_pop(pop):
    # print(type(pop.range_ip))
    pop.range_ip = '10.113.36.64'

    # t = Pop()
    # t.popPlus = PopPlus.objects.filter()[0]
    print(get_pop_rangeIP(pop))

    if(validate_pop_name(pop)
    and validate_pop_ring(pop)
    and validate_pop_rangeIP(pop)):
        return True
    return False

