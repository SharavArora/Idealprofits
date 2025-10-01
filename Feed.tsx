import React, { useEffect, useState } from "react";
import IdeaCard from "./IdeaCard";
import {
  getFeed,
  upvoteIdea,
  startChat,
  payWithGemini,
  uploadCommissionScreenshot,
  Idea,
} from "./api";

const Feed: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getFeed();
        setIdeas(data.map((idea) => ({ ...idea, creator: String(idea.creator) })));
      } catch (err: any) {
        setError(err.message || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handleUpvote = async (id: number) => {
    try {
      await upvoteIdea(id);
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === id ? { ...idea, upvotes: idea.upvotes + 1 } : idea
        )
      );
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  const handleAgreeCommission = async (id: number) => {
    try {
      const chat = await startChat(id, 1, 2); // Replace 1,2 with real IDs

      const payDirectly = window.confirm(
        "Pay directly via Gemini? Cancel to upload screenshot."
      );

      if (payDirectly) {
        await payWithGemini(chat.id, 0.001); // replace amount dynamically
        alert("Payment successful!");
      } else {
        // Upload screenshot
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = async () => {
          if (fileInput.files && fileInput.files.length > 0) {
            await uploadCommissionScreenshot(id, fileInput.files[0]);
            alert("Screenshot uploaded for verification!");
          }
        };
        fileInput.click();
      }
    } catch (err: any) {
      console.error("Commission failed:", err.message || err);
      alert("Commission/Payment failed!");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading feed...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trending Ideas</h1>
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          id={idea.id}
          creator={idea.creator}
          text={idea.text}
          upvotes={idea.upvotes}
          entrepreneurs={idea.entrepreneurs || []}
          onUpvote={handleUpvote}
          onAgree={handleAgreeCommission}
        />
      ))}
    </div>
  );
};

export default Feed;
