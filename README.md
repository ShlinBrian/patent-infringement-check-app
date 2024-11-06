# patent-infringement-check-app

### Problem Statement:

Patent infringement occurs when a party makes, uses, sells, or offers to sell a patented invention without permission from the patent holder. In essence, it means violating the exclusive rights granted to the patent owner, typically leading to legal disputes.

---

### Core Functionality:

The app will allow users to:

1. Input a **patent ID** and a **company name**.
2. Run a patent infringement check against the specified company.
3. Return the **top two infringing products** of the company along with explanations of why these products potentially infringe the patent, specifically detailing which claims are at issue.

The **patent ID** and its corresponding **patent claims** are provided in the `patents.json` file.

Additionally, you will receive a list of companies and their corresponding products and summaries in the `company_products.json` file.

---
