from datetime import datetime, timezone


def calculate_intelligence_score(
    score: int,
    published_at: datetime,
    sentiment_score: float = 0.0,
    platform: str = "generic",
) -> float:
    """
    Calculates a sophisticated total score considering:
    1. Engagement (score)
    2. Recency (time decay)
    3. Sentiment (emotional weight)
    4. Platform Quality Weights
    """
    if not published_at:
        return float(score)

    # 1. Platform Quality Weighting
    platform_weights = {
        "reddit": 1.0,
        "product_hunt": 1.2,
        "hacker_news": 1.5,
        "generic": 1.0,
    }
    source_weight = platform_weights.get(platform.lower(), 1.0)

    # 2. Time Decay Logic (Gravity formula)
    if published_at.tzinfo is None:
        published_at = published_at.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)
    delta = now - published_at
    hours_old = max(0, delta.total_seconds() / 3600)

    # Engagement gravity
    engagement_factor = (score + 1) * source_weight
    time_decay = (hours_old + 2) ** 1.8
    base_trend = engagement_factor / time_decay

    # 3. Sentiment Pulse
    # Map sentiment_score (-1 to 1) to a multiplier (0.8 to 1.5)
    # Neutral (0) gives 1.0. Positive/Negative both increase interest?
    # Usually in market pulse, we want high sentiment or high controversy.
    # Let's say positive sentiment boosts the score significantly.
    sentiment_multiplier = 1.0 + (abs(sentiment_score) * 0.5)

    # 4. Final Aggregation
    total_score = base_trend * sentiment_multiplier * 100  # Scaling for UI

    return float(total_score)
