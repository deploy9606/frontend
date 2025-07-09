import type { DevelopmentData } from "../types";

export const fallbackDevelopmentData: DevelopmentData = {
  warning: "Data is for illustrative purposes only. Based on static snapshot, not live web data.",
  region: "South Chicago Heights, IL",
  analysisDate: "2025-08-07",
  growthStatus: "Declining",
  growthSummary:
    "South Chicago Heights is experiencing population decline at ~1.51% annually, with an overall decrease of 7.11% since 2020. Vacancy rates are above national average at 9.7%, but the area still benefits from proximity to major logistics hubs in Joliet and greater Chicago.",
  developments: [
    {
      name: "Plainfield Business Center",
      type: "Industrial / Logistics",
      distanceFromSubject: "25 miles",
      impact: "positive",
      description:
        "Trammell Crow Co. broke ground on the first building of an industrial campus to total more than 8 million square feet with 40-foot clear heights and 80 dock doors, expandable to 160.",
      status: "Under Construction",
      investmentValue: "Not disclosed",
      completionDate: "2025-12",
      source: "Commercial Property Executive, February 2025",
    },
    {
      name: "CyrusOne Aurora Data Center",
      type: "Data Center",
      distanceFromSubject: "28 miles",
      impact: "positive",
      description:
        "Second data center campus comprising two buildings totaling 446,000 square feet with initial IT capacity of 40 MW.",
      status: "Under Construction",
      investmentValue: "Not disclosed",
      completionDate: "2025-12",
      source: "Commercial Property Executive, February 2025",
    },
    {
      name: "Oak Forest Logistics Center",
      type: "Industrial / Logistics",
      distanceFromSubject: "20 miles",
      impact: "positive",
      description:
        "Logistics Property Co. completed 664,453-square-foot industrial building with 117 exterior loading docks and 40-foot clear heights.",
      status: "Completed",
      investmentValue: "Not disclosed",
      completionDate: "2024-10",
      source: "Commercial Property Executive, October 2024",
    },
    {
      name: "Joliet Logistics Park",
      type: "Industrial / Logistics",
      distanceFromSubject: "15 miles",
      impact: "positive",
      description:
        "Hillwood development with capacity to expand to 1.5 million square feet, part of ongoing industrial expansion in Joliet area.",
      status: "Announced",
      investmentValue: "Not disclosed",
      completionDate: "2025-12",
      source: "Commercial Property Executive, February 2025",
    },
  ],
  offshoringActivity: [],
  developmentSummary:
    "Four key industrial and logistics projects within 30 miles of South Chicago Heights reflect sustained infrastructure investment, despite declining demographic trends in the region.",
};
