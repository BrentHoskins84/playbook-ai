import { DashboardBreadcrumb } from "@/components/dashboard/header/dashboard-breadcrumb";
import { DashboardHeaderWrapper } from "@/components/dashboard/header/dashboard-header-wrapper";
import { DynamicTitle } from "@/components/dashboard/header/dynamic-title";
import { DashboardNav } from "@/components/dashboard/navigation/sidebar";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Playbook AI",
  description: "Manage your team and practice plans",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/oauth");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <DashboardNav />

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <DashboardHeaderWrapper title={<DynamicTitle />}>
          <DashboardBreadcrumb />
        </DashboardHeaderWrapper>

        {/* Main Content Area */}
        <main className="flex-1 p-8 pt-24">
          <div className="max-w-8xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
