"use client";

import { useMagicAuth, getStoredUser, isLoggedIn } from "@siva/shared-ui";
export { useMagicAuth, getStoredUser, isLoggedIn };

export const SITE_CONFIG = {
  name: "ResumeVault",
  site: "resumevault",
  accentColor: "#f59e0b",
  freeLimit: 2,
  freeFeature: "free resume builds",
  lockedFeature: "unlimited resumes + PDF export + ATS score",
};

export const AFFILIATES = [
  {
    name: "Grammarly",
    tagline: "Polish your resume with AI writing assistance",
    cta: "Try Grammarly Free →",
    color: "#15803d",
    icon: "✍️",
    url: "https://grammarly.com/?affiliate=siva",
  },
  {
    name: "Canva Pro",
    tagline: "Design stunning resume layouts with 1000+ templates",
    cta: "Get Canva Free →",
    color: "#7c3aed",
    icon: "🎨",
    url: "https://canva.com/?affiliate=siva",
  },
  {
    name: "LinkedIn Premium",
    tagline: "See who viewed your profile + InMail credits",
    cta: "Start Free Trial →",
    color: "#1e3a5f",
    icon: "💼",
    url: "https://linkedin.com/premium?affiliate=siva",
  },
];
