"use client";

import {
  addToWatchlistAction,
  checkIfInWatchlist,
} from "@/actions/userAction/addtoWatchlist.action";
import { useState, useEffect, useTransition } from "react";

interface AddToWatchlistProps {
  mediaId: string;
}

export default function AddToWatchlist({ mediaId }: AddToWatchlistProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const exists = await checkIfInWatchlist(mediaId);
        if (exists) {
          setIsSuccess(true);
        }
      } catch (error) {
        console.error("Error checking watchlist status", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [mediaId]);

  const handleAddToWatchlist = () => {
    startTransition(async () => {
      const result = await addToWatchlistAction(mediaId);

      if (result.success) {
        setIsSuccess(true);
        setMessage("Added to Watchlist! 🎉");
      } else {
        setMessage(result.message || "Something went wrong!");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleAddToWatchlist}
        disabled={isPending || isSuccess || isChecking}
        className={`px-5 py-2.5 font-medium rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2 ${
          isSuccess
            ? "bg-green-600 text-white cursor-default"
            : "bg-gray-900 hover:bg-gray-800 text-white"
        } disabled:opacity-50`}
      >
        {isChecking
          ? "Checking..."
          : isPending
            ? "Adding..."
            : isSuccess
              ? "In Watchlist ✓"
              : "Add to Watchlist 🔖"}
      </button>
      {message && (
        <p
          className={`text-xs ${isSuccess ? "text-green-600" : "text-red-500"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
