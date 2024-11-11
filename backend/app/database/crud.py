from sqlalchemy.orm import Session
from app.database.models import Report
from app.schemas import SaveReportRequest


def create_report(db: Session, report: SaveReportRequest, session_id: str):
    db_report = Report(
        patent_id=report.patent_id,
        company_name=report.company_name,
        results=report.results,
        session_id=session_id,
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


def get_reports_by_session_id(db: Session, session_id: str):
    return db.query(Report).filter(Report.session_id == session_id).all()
