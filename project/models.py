from django.db.models import *
from topic.models import Topic


# Create your models here.
class Project(Model):
    name = CharField(max_length=50)
    description = TextField()       # can be html
    topic = ManyToManyField(Topic)
    github = URLField()
    start = DateField()
    finished = DateField()

    def __str__(self):
        return self.name
