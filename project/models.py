from django.db.models import *
from topic.models import Topic
from language.models import Language


# Create your models here.
class Project(Model):
    name = CharField(max_length=50)
    description = TextField()       # can be html
    notes = TextField()
    topic = ManyToManyField(Topic)
    language = ManyToManyField(Language)
    github = URLField()
    start = DateField()
    finished = DateField()

    def __str__(self):
        return self.name
