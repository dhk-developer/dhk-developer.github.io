/**
 * Professional history. Public-safe by design: no client names, no client
 * metrics, no programme names. Generalise rather than omit when in doubt.
 */
export interface Role {
  organisation: string;
  title: string;
  period: string;
  context: string;
  /** What I did, phrased as evidence rather than adjectives. */
  evidence: string[];
  /** Capabilities this role demonstrates (used for the skills model). */
  demonstrates: string[];
  current?: boolean;
}

export const roles: Role[] = [
  {
    organisation: "Infotechtion",
    title: "Business Analyst · Change Management",
    period: "Current",
    current: true,
    context:
      "Consultancy delivering Microsoft 365 data-governance, records-management and information-protection programmes for enterprise clients.",
    evidence: [
      "Turn ambiguous stakeholder goals into business and technical requirements, user stories and acceptance criteria, managed in Azure DevOps.",
      "Plan and run structured user research with Records Management and Information Governance users: sessions, synthesis of needs, usability and process problems, and prioritisation.",
      "Run technical discovery and stakeholder interviews that span business owners and engineering teams.",
      "Map current and future processes, including data ingestion and validation workflows.",
      "Support adoption with training, communications and change activity alongside delivery.",
    ],
    demonstrates: ["Requirements", "User research", "Process analysis", "Stakeholder engagement", "Azure DevOps", "Change & adoption"],
  },
  {
    organisation: "Xander Talent",
    title: "Technical Consultant",
    period: "From Dec 2023",
    context: "Technical consultancy combining data and CRM work with client-facing analysis.",
    evidence: [
      "Ran current-state and future-state analysis to find why a client's Salesforce CRM was under-used, and what would change that.",
      "Reduced redundant form inputs and extraction work through an ETL redesign, then presented the results to the client.",
      "Presented data insights to non-technical stakeholders so they could make decisions from them.",
      "Worked in iterative Scrum delivery with regular client review.",
    ],
    demonstrates: ["Current/future-state analysis", "ETL", "Data insight", "Scrum"],
  },
  {
    organisation: "Jaffe & Co",
    title: "US/UK Tax Trainee",
    period: "Jul – Nov 2023",
    context: "Cross-border tax practice.",
    evidence: [
      "Prepared and checked US and UK individual and corporate returns, working across two regulatory systems.",
      "Reviewed client documents for validity and completeness before filing.",
    ],
    demonstrates: ["Regulated process", "Attention to detail"],
  },
  {
    organisation: "University of Cambridge · In2Research",
    title: "Computational Research Assistant",
    period: "Jul – Sep 2022",
    context: "Summer research placement in computational materials science.",
    evidence: [
      "Built a Python workflow that generates random polyethylene structures and relaxes them with a force field, following the AIRSS structure-search method.",
      "Presented the work as a poster at the In2Research summer conference.",
    ],
    demonstrates: ["Python", "NumPy", "Scientific computing", "HPC / Linux"],
  },
];

export const education = [
  {
    organisation: "Imperial College London",
    title: "MSci Chemistry (2:1)",
    period: "2019 – 2023",
    note: "Computational dissertation: reproducibility when building complex inputs for large biological assemblies in Gaussian16. I developed and reviewed a workflow to streamline the process.",
  },
  {
    organisation: "Xander Academy",
    title: "Technical specialism",
    period: "2023 – 2024",
    note: "Python (Flask, SQLAlchemy, Pandas), SQL (MySQL), data modelling, ETL, Power BI.",
  },
];
