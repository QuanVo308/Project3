from this import d
from .models import *
from django.core.validators import validate_ipv4_address
import ipaddress

def validate_ip_octet(octet):
    # if type(octet) == int:
    octet = int(octet)
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
    # if type(popplus.vlan_PPPoE) == int:
    popplus.vlan_PPPoE = int(popplus.vlan_PPPoE)
    if popplus.vlan_PPPoE <= 39 and popplus.vlan_PPPoE >= 30:
        return True
    
    print("popplus pppoe wrong")
    return False

def validate_popplus_area(popplus):
    # if type(popplus.area_OSPF) == int:
    popplus.area_OSPF = int(popplus.area_OSPF)
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
    try:
        print(pop.range_ip)
        ipaddress.ip_address(pop.range_ip)
    except:
        print('wrong ip address')
        return False

    return True 

def get_pop_rangeIP(pop):
    ip = '10.'
    ip += str(pop.popPlus.octet2_ip_MGMT) + '.'
    # print(int(pop.sequence_ring)*64//255)
    ip += str(int(pop.popPlus.octet3_ip_MGMT) + int(pop.sequence_ring)*64//255) + '.'
    print('check',int(pop.sequence_ring)*64%256)
    ip += str(int(pop.sequence_ring)*64%256)
    return ip

def validate_pop(pop):
    # print(type(pop.range_ip))

    # t = Pop()
    # t.popPlus = PopPlus.objects.filter()[0]
    # print(get_pop_rangeIP(pop))

    if(validate_pop_name(pop)
    and validate_pop_ring(pop)
    and validate_pop_rangeIP(pop)):
        return True
    return False

def popp_format(name):
    shortened = False

    for index, i in enumerate(name):
        # print(i, index)
        if i=='0' and not shortened:
           name = name[:index] + name[index+1:]
           shortened = True

    # print(name)

    return name


def get_device_sequence(dtype, pop):

    # dtype = name[2:]
    devices = Device.objects.filter(pop=pop, name__icontains=dtype)
    sequences=[]
    # print(dtype)
    
    for i in devices:
        # print(i.name[len(i.name)-7:len(i.name)-5])
        sequences.append(int(i.name[len(i.name)-2:]))
    sequences.sort()
    
    s = 0
    while(True):
        if s not in sequences:
            return f"{s:02}"
        s+=1

    return -1

def validate_device_name(device):
    # print(device.role)
    if device.role == 'AGG':

        type = ['DI','DA','CE']
        if not device.name[0:2] in type:
            print("AGG role begin")
            return False

        if device.pop.province.area.name != device.name[2]:
            print("AGG role area")
            return False

        if device.name[3:5] != device.pop.metro[2:]:
            print("AGG role metro")
            return False

        popp = device.pop.popPlus.name[3:]
        popp = popp_format(popp)
        next = len(popp)+5
        if(device.name[5:next] != popp):
            print("AGG role popplus")
            return False

        if(device.name[next:next+3] != device.pop.province.acronym):
            print("AGG role province")
            return False
        next+=3

        # print(device.name[next:next+4], device.pop.name[3:])
        if(device.name[next:next+4] != device.pop.name[3:]):
            print("AGG role pop")
            return False
        next+=4

        print(get_device_sequence(device.name[next+2:next+4], device.pop))

        return True
    else:
        return True

def validate_device(device):
    
    if( validate_device_name(device)):
        return True
    return False
