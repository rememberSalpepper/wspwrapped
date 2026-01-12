export type PlanId = "free" | "pro-month" | "pro-annual";

export const PLANS = {
  free: {
    id: "free" as PlanId,
    label: "Free",
    priceUsd: 0,
    interval: "",
    discount: 0
  },
  proMonth: {
    id: "pro-month" as PlanId,
    label: "Pro",
    priceUsd: 10000, // Using this field for CLP now
    interval: "month",
    discount: 0
  },
  proAnnual: {
    id: "pro-annual" as PlanId,
    label: "Pro Annual",
    priceUsd: 78,
    interval: "year",
    discount: 0.35
  }
};
