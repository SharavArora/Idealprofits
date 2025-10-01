import React, { useState } from "react";

interface PostIdeaProps {
  creatorId: number;
  onIdeaPosted: (newIdea: { id: number; creator: string; text: string; upvotes: number; entrepreneurs: string[] }) => void;
}

const PostIdea: React.FC<PostIdeaProps> = ({ creatorId, onIdeaPosted }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      // Replace this URL with your FastAPI endpoint
      const res = await fetch("http://localhost:8000/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creator_id: creatorId, text }),
      });
      const data = await res.json();

  onIdeaPosted({ id: data.id, creator: data.creator, text: data.text, upvotes: data.upvotes || 0, entrepreneurs: [] });
      setText(""); // reset input
    } catch (error) {
      console.error("Error posting idea:", error);
      alert("Failed to post idea. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md mb-4">
      <textarea
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
        rows={4}
        placeholder="Share your idea..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className={`bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition-colors ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Posting..." : "Post Idea"}
      </button>
    </form>
  );
};

export default PostIdea;
