import mongoengine

def connect():
    mongoengine.connect(
        db="market-pulse",
        host="mongodb://localhost:27017/market-pulse"
    )
