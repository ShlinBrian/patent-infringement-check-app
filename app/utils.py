import json
from fuzzywuzzy import process


def load_json(file_path: str):
    """Load JSON data from a file."""
    with open(file_path, "r") as file:
        return json.load(file)


def get_patent_by_id(patents, patent_id):
    """Retrieve patent by its ID."""
    return next((patent for patent in patents if patent["id"] == patent_id), None)


def find_company_products(companies, company_name):
    """Find company and its products using fuzzy matching."""
    best_match = process.extractOne(
        company_name,
        [c["name"] for c in companies if isinstance(c, dict) and "name" in c],
    )
    if best_match and best_match[1] > 80:  # Threshold for match confidence
        return next((c for c in companies if c["name"] == best_match[0]), None)
    return None
