from supabase import Client, create_client
from config import settings

_supabase_client: Client | None = None


def connect() -> Client:
    """Initializes and returns a shared Supabase client."""
    global _supabase_client

    if _supabase_client is not None:
        return _supabase_client

    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured"
        )

    _supabase_client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY,
    )
    return _supabase_client


def get_supabase() -> Client:
    """Returns the initialized Supabase client."""
    return connect()
