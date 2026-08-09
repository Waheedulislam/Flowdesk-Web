import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your FlowDesk account and set up your workspace.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      heading="Create your account"
      subheading="Start your FlowDesk workspace. No credit card required."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
