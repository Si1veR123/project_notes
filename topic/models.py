from django.db.models import *
from language.models import Language


# Create your models here.
class Topic(Model):
    name = CharField(max_length=50)
    description = TextField()
    language = ManyToManyField(Language)

    def __str__(self):
        return self.name
