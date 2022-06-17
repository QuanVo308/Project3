def validate_ip_octet(octet):
    if type(octet) == int:
        if octet <= 255 and octet >=0:
            return True
    return False