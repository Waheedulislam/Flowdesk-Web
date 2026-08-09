import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your FlowDesk account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      heading="Set a new password"
      subheading="Choose a strong password you haven't used before."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
