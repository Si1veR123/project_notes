from django.db.models import *


# Create your models here.
class Language(Model):
    name = CharField(max_length=50)

    def __str__(self):
        return self.name
