"use client";

import { removeFromCompletedAction } from "@/actions/removeFromCompleted.action";
import { useState, useTransition } from "react";

interface RemoveFromCompletedProps {
  mediaId: string;
}

export default function RemoveFromCompleted({
  mediaId,
}: RemoveFromCompletedProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromCompletedAction(mediaId);

      if (result.success) {
        setMessage("Removed! 🗑️");
      } else {
        setMessage(result.message || "Something went wrong!");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleRemove}
        disabled={isPending}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending ? "Removing..." : "Remove 🗑️"}
      </button>
      {message && <p className="text-xs text-red-500">{message}</p>}
    </div>
  );
}
