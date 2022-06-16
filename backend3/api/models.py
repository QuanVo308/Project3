from django.db import models

# Create your models here.


from django.db import models

# Create your models here.
class Area(models.Model):
    name = models.CharField(max_length=10)
    
    def __str__(self):
        return self.name


class Province(models.Model):
    name = models.CharField(max_length=30)
    acronym = models.CharField(max_length=3, default="")
    areaID = models.ForeignKey(Area, on_delete=models.PROTECT)

    def __str__(self):
        return self.code


class Branch(models.Model):
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name

class PopPlus(models.Model):
    name = models.CharField(max_length=20)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    area_OSPF = models.IntegerField()
    octet2_Ip_OSPF_MGMT = models.IntegerField()
    octet2_Ip_MGMT = models.IntegerField()
    octet3_Ip_MGMT = models.IntegerField()
    vlan_PPPoE = models.IntegerField()

    def __str__(self):
        return self.name


class Pop(models.Model):
    name = models.CharField(max_length=20)
    ring = models.CharField(max_length=20)
    range_Ip = models.GenericIPAddressField()
    vlan_PPPoE = models.CharField(max_length=20)
    popPlus = models.ForeignKey(PopPlus, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=30)
    company = models.CharField(max_length=30)

    def __str__(self):
        return self.name

class Device(models.Model):
    popID= models.ForeignKey(Pop, on_delete=models.PROTECT)
    name = models.CharField(max_length=50)
    role = models.CharField(max_length=20)
    ip = models.GenericIPAddressField()
    brandID = models.ForeignKey(Brand, on_delete=models.PROTECT )

    def __str__(self):
        return self.name
