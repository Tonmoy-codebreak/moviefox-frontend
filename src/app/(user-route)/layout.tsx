import { Navbar1 } from "@/components/navbar1";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <Navbar1></Navbar1>
      <h1 className="text-2xl font-bold mb-4">This is User Layout</h1>
      {children}
    </div>
  );
}
