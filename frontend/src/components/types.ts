// types.ts
export type Product = {
    product_name: string;
    infringement_likelihood: string;
    explanation: string;
    relevant_claims: number[];
    specific_features: string[];
  };
  
  export type InfringementReport = {
    patent_id: string;
    company_name: string;
    overall_risk_assessment: string;
    top_infringing_products: Product[];
    create_time: string;
  };
  