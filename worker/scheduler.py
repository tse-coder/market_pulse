import time
import schedule
import logging
from tasks import run_pipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def job():
    logger.info("Scheduler running pipeline job...")
    run_pipeline()

if __name__ == "__main__":
    logger.info("Starting scheduler. Pipeline will run every 10 minutes.")
    schedule.every(10).minutes.do(job)
    
    # Run once immediately
    job()
    
    while True:
        schedule.run_pending()
        time.sleep(1)
