import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";

export const metadata: Metadata = {
  title: "FlowDesk — Work, together",
  description: "FlowDesk brings projects, collaboration, AI, and workflow automation into one focused workspace.",
  keywords: ["project management", "team collaboration", "workflow automation", "AI workspace"],
  openGraph: { title: "FlowDesk — Work, together", description: "The workspace for projects, collaboration, AI, and automation." },
};

export default function HomePage() { return <LandingPage />; }
