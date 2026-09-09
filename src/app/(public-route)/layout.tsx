import Footer from "@/components/modules/publicComponents/Footer";
import { Navbar1 } from "@/components/modules/publicComponents/navbar1";
import ChatBot from "@/components/modules/userComponents/ChatBot";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar1 />

      <main className="flex-1">{children}</main>

      <Footer />

      {/* এখানে ফ্লোটিং চ্যাটবট বসিয়ে দেওয়া হলো, ফলে সব পেজেই এটি শো করবে */}
      <ChatBot />
    </div>
  );
}
