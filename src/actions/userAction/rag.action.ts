"use server";

export async function askRagAction(prompt: string) {
  try {
    const mainURL = process.env.NEXT_PUBLIC_API_URL;
    const backendUrl = `${mainURL}/rag/ask`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      cache: "no-store", // যাতে চ্যাটের উত্তর ক্যাশ হয়ে পুরনো ডেটা না দেখায়
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to fetch response from RAG server",
      );
    }

    return {
      success: true,
      data: result.data, // এখানে answer এবং sources থাকবে
    };
  } catch (error: unknown) {
    console.error("RAG Action Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while communicating with AI";

    return {
      success: false,
      message,
    };
  }
}
