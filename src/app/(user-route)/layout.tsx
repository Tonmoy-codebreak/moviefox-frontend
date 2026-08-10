import { Navbar1 } from "@/components/navbar1";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <Navbar1></Navbar1>

      {children}
    </div>
  );
}
