from django.contrib import admin
from django.urls import path, include
from main.views import *
from drf import routers


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(routers)),
    path('', main),
]
