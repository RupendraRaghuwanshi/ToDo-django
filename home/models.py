from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Work(models.Model):
    text = models.CharField(max_length=200,null=True,blank=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='userwork',db_index=True)
    todoid = models.AutoField(primary_key=True)
    def workcount(self):
        return self.user.userwork.count()
    def __str__(self):
        return self.user.username
