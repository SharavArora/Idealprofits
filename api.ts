const API_BASE: string = "http://[::]:8000/"; // must be string
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
export async function uploadCommissionScreenshot(
  commissionId: number,
  file: File
): Promise<{ success: boolean }> {
  const formData = new FormData();
  formData.append("screenshot", file);
  formData.append("commission_id", String(commissionId));

  const res = await fetch(`${API_BASE}/commission/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload screenshot");
  return res.json(); // { success: true }
}

// Idea type
export interface Idea {
  id: number;
  creator: string;
  text: string;
  upvotes: number;
  entrepreneurs: string[];
}

// Get feed
export async function getFeed(): Promise<Idea[]> {
  const response = await fetch(`${API_BASE}/feed`);
  if (!response.ok) throw new Error("Failed to fetch feed");
  return await response.json();
}

// Upvote idea
export async function upvoteIdea(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/ideas/${id}/upvote`, { method: "POST" });
  if (!response.ok) throw new Error("Failed to upvote idea");
}

// Start chat
export async function startChat(ideaId: number, userId: number, entrepreneurId: number): Promise<{ id: number }> {
  const response = await fetch(`${API_BASE}/chat/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea_id: ideaId, user_id: userId, entrepreneur_id: entrepreneurId }),
  });
  if (!response.ok) throw new Error("Failed to start chat");
  return await response.json();
}

// Gemini payment
export async function payWithGemini(chatId: number, amount: number): Promise<void> {
  const response = await fetch("https://api.gemini.com/v1/order/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-GEMINI-APIKEY": GEMINI_API_KEY as string,
    } as HeadersInit,
    body: JSON.stringify({
      symbol: "btcusd",
      amount: String(amount),
      price: "1",
      side: "buy",
      type: "exchange limit",
    }),
  });
  if (!response.ok) throw new Error("Gemini payment failed");
}
