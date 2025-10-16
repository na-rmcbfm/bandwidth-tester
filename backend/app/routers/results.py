from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models import TestResult, TestResultCreate, TestResultDB

router = APIRouter(prefix="/api/results", tags=["results"])


@router.post("/", response_model=TestResult, status_code=201)
def create_result(
    result: TestResultCreate,
    db: Session = Depends(get_db)
) -> TestResult:
    """
    Save a new bandwidth test result to the database.
    """
    db_result = TestResultDB(
        download_speed=result.download_speed,
        upload_speed=result.upload_speed,
        latency=result.latency,
        jitter=result.jitter,
        ip_address=result.ip_address,
        user_agent=result.user_agent
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)

    return TestResult.model_validate(db_result)


@router.get("/", response_model=List[TestResult])
def get_results(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[TestResult]:
    """
    Retrieve list of bandwidth test results.
    Results are ordered by timestamp (most recent first).
    """
    results = db.query(TestResultDB)\
        .order_by(TestResultDB.timestamp.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

    return [TestResult.model_validate(result) for result in results]


@router.get("/{result_id}", response_model=TestResult)
def get_result(
    result_id: str,
    db: Session = Depends(get_db)
) -> TestResult:
    """
    Retrieve a specific bandwidth test result by ID.
    """
    result = db.query(TestResultDB).filter(TestResultDB.id == result_id).first()

    if result is None:
        raise HTTPException(status_code=404, detail="Result not found")

    return TestResult.model_validate(result)


@router.delete("/{result_id}", status_code=204)
def delete_result(
    result_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete a specific bandwidth test result by ID.
    """
    result = db.query(TestResultDB).filter(TestResultDB.id == result_id).first()

    if result is None:
        raise HTTPException(status_code=404, detail="Result not found")

    db.delete(result)
    db.commit()

    return None
