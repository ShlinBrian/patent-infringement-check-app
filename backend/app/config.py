import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    API_KEY = os.environ.get(
        "API_KEY",
        "",
    )
    DATABASE_URL = os.environ.get("DATABASE_URL", "")
