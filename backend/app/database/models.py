from sqlalchemy import Column, Integer, String, JSON, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


# class Report(Base):
#     __tablename__ = "report"

#     id = Column(Integer, primary_key=True, index=True)
#     patent_id = Column(String, nullable=False)
#     company_name = Column(String, nullable=False)
#     results = Column(JSON, nullable=False)  # Store report details as JSON
#     session_id = Column(String, nullable=False)  # Session ID to link reports
#     create_time = Column(TIMESTAMP, server_default=func.now())  # Auto timestamp


class Report(Base):
    __tablename__ = "report"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, nullable=False)  # Session ID to identify the user
    report_data = Column(JSON, nullable=False)  # Store the entire report as JSON
    created_time = Column(TIMESTAMP, server_default=func.now())  # Auto timestamp
