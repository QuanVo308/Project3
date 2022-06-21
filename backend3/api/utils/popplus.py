from .utils import *

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