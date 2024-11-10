from fastapi import Depends, APIRouter, Request, HTTPException
from app.database.database import get_db
from app.database.crud import create_report, get_reports_by_session_id
from app.database.models import Report
from app.schemas import SaveReportRequest
from sqlalchemy.orm import Session
from app.schemas import InfringementReport
from loguru import logger
from typing import List

router = APIRouter()


@router.post("/save-report")
async def save_report(
    report: InfringementReport, request: Request, db: Session = Depends(get_db)
):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID is missing")

    # Save the entire InfringementReport object
    report.create_time = report.create_time.isoformat()
    logger.debug(f"Saving report: {report.model_dump()}")
    new_report = Report(
        session_id=session_id,
        report_data=report.model_dump(),  # Save the report as a dictionary
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {"message": "Report saved successfully", "report_id": new_report.id}


@router.get("/get-reports", response_model=List[InfringementReport])
async def get_reports(request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID is missing")

    # Fetch all reports for the user's session
    reports = db.query(Report).filter(Report.session_id == session_id).all()

    # Return the saved report_data field along with its create_time
    return [InfringementReport(**report.report_data) for report in reports]
