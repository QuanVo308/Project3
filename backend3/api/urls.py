from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'popplus', views.PopPlusViewSet,basename="popplus")
router.register(r'pop', views.PopViewSet,basename="pop")
router.register(r'device', views.DeviceViewSet,basename="device")


urlpatterns = [
    path('', include(router.urls)),
    path('', views.index, name='index'),
    path('test', views.test, name='test'),
]
