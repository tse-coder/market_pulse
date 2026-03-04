# define a mongodb model for the signal
from mongoengine import (
    Document,
    StringField,
    IntField,
    DateTimeField,
    FloatField,
    DictField,
    ListField,
)


class Signal(Document):
    platform = StringField(required=True)
    external_id = StringField(required=True)
    title = StringField()
    content = StringField(required=True)
    score = IntField()
    time = DateTimeField(required=True)
    url = StringField()
    sentiment_score = FloatField()
    ai_summary = StringField()
    ai_sentiment = StringField()  # e.g., "Positive", "Negative", "Neutral"
    ai_topics = ListField(StringField())
    metadata = DictField()
    trend_score = FloatField(default=0.0)
    total_score = FloatField(default=0.0)
    cluster_id = StringField()
