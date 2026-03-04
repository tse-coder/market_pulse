from datetime import datetime
from mongoengine import (
    Document,
    StringField,
    IntField,
    DateTimeField,
    FloatField,
    ListField,
)


class Cluster(Document):
    name = StringField(required=True)  # AI-generated summary title
    description = StringField()  # AI-generated
    embedding_centroid = ListField(FloatField())
    total_signals = IntField(default=0)
    total_startups = IntField(default=0)
    total_discussions = IntField(default=0)
    avg_sentiment = FloatField(default=0.0)
    momentum_score = FloatField(default=0.0)
    pain_score = FloatField(default=0.0)
    opportunity_score = FloatField(default=0.0)
    primary_tags = ListField(StringField())
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {"indexes": ["name", "created_at", "momentum_score"]}


class ClusterSnapshot(Document):
    cluster_id = StringField(required=True)
    date = DateTimeField(default=datetime.utcnow)
    signal_count = IntField(default=0)
    startup_count = IntField(default=0)
    discussion_count = IntField(default=0)
    avg_sentiment = FloatField(default=0.0)
    engagement_total = IntField(default=0)
    pain_score = FloatField(default=0.0)
    momentum_score = FloatField(default=0.0)
    opportunity_score = FloatField(default=0.0)

    meta = {"indexes": [("cluster_id", "date")]}
