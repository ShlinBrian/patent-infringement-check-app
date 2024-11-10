from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@0.0.0.0:5432/patent_checker"

# Create the database engine
engine = create_engine(DATABASE_URL)

# MetaData for migrations
metadata = MetaData()

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
