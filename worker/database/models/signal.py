# define a mongodb model for the signal
from mongoengine import Document, StringField, IntField, DateTimeField, FloatField

class Signal(Document):
    platform = StringField(required=True)
    content = StringField(required=True)
    # score = IntField(required=True)
    # author = StringField(required=True)
    time = DateTimeField(required=True)
    url = StringField(required=True)
    