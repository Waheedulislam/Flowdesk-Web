import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";

export const metadata: Metadata = {
  title: "FlowDesk — Work Smarter. Automate Everything.",
  description: "FlowDesk brings projects, collaboration, AI, and workflow automation into one focused workspace.",
  keywords: ["project management", "team collaboration", "workflow automation", "AI workspace"],
  openGraph: { title: "FlowDesk — Work Smarter. Automate Everything.", description: "The workspace for projects, collaboration, AI, and automation." },
};

export default function HomePage() { return <LandingPage />; }
