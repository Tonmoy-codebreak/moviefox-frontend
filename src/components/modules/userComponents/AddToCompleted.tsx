"use client";

import {
  addToCompletedAction,
  checkIfInCompleted,
} from "@/actions/userAction/addToCompleted.action";
import { useState, useEffect, useTransition } from "react";

interface AddToCompletedProps {
  mediaId: string;
}

export default function AddToCompleted({ mediaId }: AddToCompletedProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // কম্পোনেন্ট মাউন্ট হওয়ার সাথে সাথে চেক করবে এটি কমপ্লিটেড লিস্টে আছে কিনা
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const exists = await checkIfInCompleted(mediaId);
        if (exists) {
          setIsSuccess(true);
        }
      } catch (error) {
        console.error("Error checking completed status", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [mediaId]);

  const handleAddToCompleted = () => {
    startTransition(async () => {
      const result = await addToCompletedAction(mediaId);

      if (result.success) {
        setIsSuccess(true);
        setMessage("Marked as Completed! 🎉");
      } else {
        setMessage(result.message || "Something went wrong!");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleAddToCompleted}
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
            ? "Saving..."
            : isSuccess
              ? "Completed ✓"
              : "Mark as Completed 🎯"}
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
