from pydantic import BaseModel
from typing import List, Optional


class ProductAnalysis(BaseModel):
    product_name: str
    analysis: str


class InfringementReport(BaseModel):
    patent_id: str
    company_name: str
    results: List[ProductAnalysis]


class InfringementRequest(BaseModel):
    patent_id: int  # Use integer since patent IDs are numeric
    company_name: str
