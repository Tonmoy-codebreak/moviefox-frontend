import { Navbar1 } from "@/components/modules/publicComponents/navbar1";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 ">
      <Navbar1></Navbar1>

      {children}
    </div>
  );
}
