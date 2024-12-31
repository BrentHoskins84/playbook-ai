import { getProfile } from "@/lib/services/user-service";
import { DashboardHeader } from "./dashboard-header";

interface DashboardHeaderWrapperProps {
  title: any;
  children?: React.ReactNode;
}

export async function DashboardHeaderWrapper({
  title,
  children,
}: DashboardHeaderWrapperProps) {
  const profile = await getProfile();

  const title_str: string = title;

  return (
    <DashboardHeader title={title_str} profile={profile}>
      {children}
    </DashboardHeader>
  );
}
