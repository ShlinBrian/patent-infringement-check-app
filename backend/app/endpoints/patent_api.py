from fastapi import APIRouter, HTTPException, Request, Response
from app.utils import load_json, get_patent_by_id, find_company_products
from app.analysis import analyze_infringement, analyze_overall_risk_assessment
from app.schemas import InfringementRequest, InfringementReport, ProductAnalysis
from datetime import datetime
from loguru import logger


router = APIRouter()

# Load data
patents = load_json("data/patents.json")
companies = load_json("data/company_products.json")["companies"]


@router.post("/check-infringement")
async def check_infringement(request: InfringementRequest):
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
        try_count = 0
        logger.debug(f"Analyzing product: {product['name']}")
        while try_count < 3:
            try:
                analysis = analyze_infringement(
                    patent["claims"], product["description"]
                )
                logger.debug(f"Analysis result: {analysis}")
                break
            except Exception as e:
                try_count += 1
                logger.error(
                    f"Error analyzing product: {product['name']}. An error occurred: {str(e)}. Retrying ...",
                    exc_info=True,
                )

        product_analyses.append(
            {
                "product_name": product["name"],
                "likelihood": analysis["likelihood"],
                "claims": analysis["claims"],
                "explanation": analysis["explanation"],
                "specific_features": analysis["specific_features"],
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
    report = InfringementReport(
        patent_id=request.patent_id,
        company_name=company["name"],
        top_infringing_products=[
            ProductAnalysis(
                product_name=product["product_name"],
                infringement_likelihood=product["likelihood"],
                relevant_claims=product["claims"],
                explanation=product["explanation"],
                specific_features=product["specific_features"],
            )
            for product in top_infringing_products
        ],
    )
    logger.debug(f"Report: {report}")
    try_count = 0
    while try_count < 3:
        try:
            overall_risk_assessment = analyze_overall_risk_assessment(
                report.model_dump()
            )
            logger.debug(f"Overall risk assessment: {overall_risk_assessment}")
            break
        except Exception as e:
            try_count += 1
            logger.error(
                f"Error analyzing overall risk assessment. An error occurred: {str(e)}. Retrying ...",
                exc_info=True,
            )
    report.overall_risk_assessment = overall_risk_assessment["overall_risk_assessment"]
    report.create_time = datetime.now()
    return report
