from .models import *

def validate_popplus_name(popplus):
    # print("branchID: ", popplus.branchID.id)
    branch = popplus.branchID
    province = branch.provinceID
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

def validate_popplus(popplus):
    # print(popplus.id)
    if (validate_popplus_name(popplus) 
    and validate_popplus_vlan(popplus)):
        return True
    return False

def validate_ip_octet(octet):
    if type(octet) == int:
        if octet <= 255 and octet >=0:
            return True
    return False
