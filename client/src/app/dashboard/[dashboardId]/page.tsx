import DashboardPageContent from "./dashboard-page";

export default function DashboardPage({ params }: { params: { dashboardId: string } }) {
  return <DashboardPageContent dashboardId={params.dashboardId} />;
}
