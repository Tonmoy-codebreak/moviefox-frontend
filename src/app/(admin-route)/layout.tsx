import { Sidebar1 } from "@/components/modules/adminComponents/sidebar1";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Sidebar1>{children}</Sidebar1>;
}
