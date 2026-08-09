import { getWithAuth } from "@/lib/api-server";
import Link from "next/link";
import { redirect } from "next/navigation";

interface WatchlistItem {
  id: string;
  media: {
    id: string;
    title: string;
    slug: string;
    type: string;
    access: string;
    releaseYear: number;
    posterUrl?: string;
    avgRating: number;
  };
  createdAt: string;
}

export default async function WatchlistPage() {
  let watchlist: WatchlistItem[] = [];

  try {
    // সার্ভার থেকে সরাসরি ডেটা ফেচ করছি
    const result = await getWithAuth("/watchlist/my-watchlist");
    watchlist = result?.data || [];
  } catch (error) {
    // যদি টোকেন না থাকে বা ৪০১ এরর হয়, তবে লগইন পেজে পাঠিয়ে দিন
    console.error("Watchlist fetch error:", error);
    redirect("/login");
  }

  return (
    <main className="container mx-auto p-6 max-w-6xl space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Watchlist
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your saved collection.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-xl text-sm">
          Total Saved: {watchlist.length}
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <p className="text-gray-500 text-lg">
            Your watchlist is currently empty.
          </p>
          <Link
            href="/media"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm"
          >
            Explore Media 🎬
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlist.map((item) => (
            <Link
              key={item.id}
              href={`/media/${item.media.id}`}
              className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group cursor-pointer"
            >
              <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
                {item.media.posterUrl ? (
                  <img
                    src={item.media.posterUrl}
                    alt={item.media.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    No Poster
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-bold text-lg text-gray-800 line-clamp-1">
                  {item.media.title}
                </h2>
                <span className="text-xs text-gray-400">
                  {item.media.releaseYear}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
