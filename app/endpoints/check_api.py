from fastapi import APIRouter, HTTPException, Request, Response
from app.utils import load_json, get_patent_by_id, find_company_products
from app.analysis import analyze_infringement
from app.schemas import InfringementRequest, InfringementReport, ProductAnalysis
from loguru import logger


router = APIRouter()

# Load data
patents = load_json("data/patents.json")
companies = load_json("data/company_products.json")["companies"]


@router.post("/check-infringement", response_model=InfringementReport)
def check_infringement(request: InfringementRequest):
    # Find the patent
    patent = get_patent_by_id(patents, request.patent_id)
    if not patent:
        raise HTTPException(status_code=404, detail="Patent not found")
    logger.debug(f"Patent found: {patent}")

    # Find the company
    company = find_company_products(companies, request.company_name)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    logger.debug(f"Company found: {company}")

    # Analyze all products
    product_analyses = []
    for product in company["products"]:
        analysis = analyze_infringement(patent["claims"], product["description"])
        product_analyses.append(
            {
                "product_name": product["name"],
                "likelihood": analysis["likelihood"],
                "claims": analysis["claims"],
                "explanation": analysis["explanation"],
            }
        )

    # Sort products by infringement likelihood (High > Moderate > Low)
    likelihood_order = {"High": 3, "Moderate": 2, "Low": 1}
    sorted_products = sorted(
        product_analyses, key=lambda x: likelihood_order[x["likelihood"]], reverse=True
    )

    # Select the top 2 infringing products
    top_infringing_products = sorted_products[:2]

    # Format the response
    return InfringementReport(
        patent_id=request.patent_id,
        company_name=company["name"],
        results=[
            ProductAnalysis(
                product_name=product["product_name"],
                analysis=(
                    f"Likelihood: {product['likelihood']}\n"
                    f"Claims: {product['claims']}\n"
                    f"Explanation: {product['explanation']}"
                ),
            )
            for product in top_infringing_products
        ],
    )
