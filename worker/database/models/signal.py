from datetime import datetime

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
    external_id = StringField(required=True, unique=True)
    type = StringField(choices=["startup", "discussion"], default="discussion")
    title = StringField()
    content = StringField(required=True)
    score = IntField()
    time = DateTimeField(required=True)
    url = StringField()
    sentiment_score = FloatField()
    ai_summary = StringField()
    ai_sentiment = StringField()
    ai_topics = ListField(StringField())
    metadata = DictField()
    total_score = FloatField(default=0.0)
    trend_score = FloatField(default=0.0)  # Legacy support
    embedding_vector = ListField(FloatField())
    cluster_id = StringField()
    tags = ListField(StringField())
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {"indexes": ["external_id", "cluster_id", "platform", "time"]}
