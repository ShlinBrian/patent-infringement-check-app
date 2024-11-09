from pydantic import BaseModel
from typing import List, Optional


class ProductAnalysis(BaseModel):
    product_name: str
    infringement_likelihood: str
    relevant_claims: List[str]
    explanation: str
    specific_features: Optional[List[str]]


class InfringementReport(BaseModel):
    patent_id: str
    company_name: str
    top_infringing_products: List[ProductAnalysis]
    overall_risk_assessment: str | None = None


class InfringementRequest(BaseModel):
    patent_id: str
    company_name: str
