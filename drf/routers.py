from rest_framework.routers import DefaultRouter
from . viewsets import *


router = DefaultRouter()
router.register("projects", ProjectViewSet)
router.register("topics", TopicViewSet)
router.register("languages", LanguageViewSet)
urlpatterns = router.urls
