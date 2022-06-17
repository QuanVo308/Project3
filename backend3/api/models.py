from django.db import models

# Create your models here.


from django.db import models

# Create your models here.
class Area(models.Model):
    name = models.CharField(max_length=10)
    
  


class Province(models.Model):
    name = models.CharField(max_length=30)
    acronym = models.CharField(max_length=3, default="")
    area = models.ForeignKey(Area, on_delete=models.PROTECT)




class Branch(models.Model):
    province = models.ForeignKey(Province, on_delete=models.PROTECT)
    name = models.CharField(max_length=30)


class PopPlus(models.Model):
    name = models.CharField(max_length=20)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT)
    area_OSPF = models.IntegerField()
    octet2_ip_OSPF_MGMT = models.IntegerField()
    octet2_ip_MGMT = models.IntegerField()
    octet3_ip_MGMT = models.IntegerField()
    vlan_PPPoE = models.IntegerField()




class Pop(models.Model):
    name = models.CharField(max_length=20)
    ring = models.CharField(max_length=20)
    range_ip = models.GenericIPAddressField()
    vlan_PPPoE = models.CharField(max_length=20)
    metro = models.CharField(max_length=20)
    popPlus = models.ForeignKey(PopPlus, on_delete=models.PROTECT)
    province = models.ForeignKey(Province, on_delete=models.PROTECT)
    sequence_ring = models.IntegerField()



class Brand(models.Model):
    name = models.CharField(max_length=30)
    company = models.CharField(max_length=30)


class Device(models.Model):
    popID= models.ForeignKey(Pop, on_delete=models.PROTECT)
    name = models.CharField(max_length=50)
    role = models.CharField(max_length=20)
    ip = models.GenericIPAddressField()
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT )
