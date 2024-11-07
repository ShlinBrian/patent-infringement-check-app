import openai
from app.config import Config

openai.api_key = Config.API_KEY


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
                "Provide an analysis including the likelihood of infringement (High, Moderate, Low), "
                "relevant patent claims affected, and a brief explanation."
            ),
        },
    ]

    response = openai.chat.completions.create(
        model="gpt-4o-mini",  # or "gpt-4o-mini"
        messages=messages,
        max_tokens=200,
        temperature=0.7,
    )

    result = response["choices"][0]["message"]["content"].strip()

    # Parse the response content
    lines = result.split("\n")
    likelihood = next(
        (line.split(":")[1].strip() for line in lines if "Likelihood" in line), "Low"
    )
    claims = next(
        (line.split(":")[1].strip() for line in lines if "Claims" in line), ""
    )
    explanation = "\n".join(
        line for line in lines if not ("Likelihood" in line or "Claims" in line)
    ).strip()

    return {"likelihood": likelihood, "claims": claims, "explanation": explanation}
