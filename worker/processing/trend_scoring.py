from datetime import datetime, timezone


def calculate_trend_score(score: int, published_at: datetime) -> float:
    """
    Calculates a trend score based on engagement (score) and time decay.
    Uses a gravity-based formula: (score + 1) / ((hours_old + 2) ** 1.8)
    """
    if not published_at:
        return float(score)

    # Ensure published_at is timezone-aware for comparison
    if published_at.tzinfo is None:
        published_at = published_at.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)
    delta = now - published_at
    hours_old = max(0, delta.total_seconds() / 3600)

    # Gravity formula (similar to Hacker News ranking)
    trend_score = (score + 1) / ((hours_old + 2) ** 1.8)
    return float(trend_score)
