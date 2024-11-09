import openai, json
from app.config import Config
from loguru import logger

openai.api_key = Config.API_KEY


def parse_response_content(response_content):
    """
    Parse the JSON-like response content from the OpenAI API.
    Handles Markdown formatting and extracts the JSON.
    """
    # Remove Markdown-like formatting
    if response_content.startswith("```json"):
        response_content = response_content.strip("```json").strip("```").strip()

    # Parse JSON content
    try:
        parsed_data = json.loads(response_content)
        return parsed_data
    except json.JSONDecodeError:
        raise ValueError("Failed to parse response content as JSON.")


def analyze_infringement(claims: str, product_description: str):
    """
    Analyze product against patent claims and return:
    - Likelihood score (High, Moderate, Low)
    - Relevant claims at issue
    """
    messages = [
        {
            "role": "system",
            "content": "You are a patent infringement analysis assistant.",
        },
        {
            "role": "user",
            "content": (
                f"Patent Claims: {claims}\n"
                f"Product Description: {product_description}\n"
                "Provide an analysis of the likelihood of infringement, relevant patent claims affected, and a brief explanation in the following JSON format:\n"
                '{"likelihood": "High, Moderate, or Low","claims": ["1", "3"],"explanation": "A detailed explanation of the analysis.","specific_features": A List of key functionalities}\n'
                "Please ensure that the response strictly adheres to the JSON format."
            ),
        },
    ]

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=300,
        temperature=0.7,
    )
    result = response.choices[0].message.content
    logger.debug(f"Response from OpenAI: {result}")
    parse_result = parse_response_content(result)
    logger.debug(f"result: {parse_result}")
    return parse_result


def analyze_overall_risk_assessment(report: dict):
    """
    Analyze the overall risk assessment of the patent infringement report.
    """
    messages = [
        {
            "role": "system",
            "content": "You are a patent infringement risk assessment expert.",
        },
        {
            "role": "user",
            "content": (
                f"Patent Infringement Report: {report}\n"
                "Provide an overall risk assessment of the patent infringement report in the following JSON format:\n"
                "{\n"
                '  "overall_risk_assessment": "A summary of the risk level (High/Moderate/Low) along with a brief explanation of the reasons. '
                'For example, highlight products, claims, and specific features that contribute to the risk."\n'
                "}\n"
                "Ensure the response strictly adheres to the JSON format with a clear explanation of the reasoning behind the risk assessment."
            ),
        },
    ]

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=300,
        temperature=0.7,
    )
    result = response.choices[0].message.content.strip()
    logger.debug(f"Response from OpenAI: {result}")
    parse_result = parse_response_content(result)
    logger.debug(f"Parsed result: {parse_result}")
    return parse_result
