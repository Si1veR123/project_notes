from rest_framework import viewsets

from project.models import Project
from project.serializer import ProjectSerializer

from language.models import Language
from language.serializer import LanguageSerializer

from topic.models import Topic
from topic.serializer import TopicSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
