import React, { useEffect, useState } from "react";

interface Idea {
  id: number;
  creator: string;
  text: string;
  upvotes: number;
  entrepreneurs: string[];
}

const Leaderboard: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch top ideas from backend
  const fetchIdeas = async () => {
    try {
      const res = await fetch("http://localhost:8000/ideas/top");
      const data = await res.json();
      setIdeas(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();

    // Optional: WebSocket for real-time updates
    const ws = new WebSocket("ws://localhost:8000/ws/ideas");

    ws.onmessage = (event) => {
      const updatedIdea: Idea = JSON.parse(event.data);
      setIdeas((prev) => {
        const exists = prev.find((i) => i.id === updatedIdea.id);
        if (exists) {
          return prev.map((i) => (i.id === updatedIdea.id ? updatedIdea : i));
        } else {
          return [updatedIdea, ...prev];
        }
      });
    };

    return () => ws.close();
  }, []);

  if (loading) return <p className="text-gray-500">Loading leaderboard...</p>;

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      {ideas.length === 0 ? (
        <p className="text-gray-500">No ideas yet.</p>
      ) : (
        <ul>
          {ideas.map((idea) => (
            <li key={idea.id} className="border-b py-3">
              <p className="font-semibold">{idea.creator}</p>
              <p className="text-gray-700">{idea.text}</p>
              <p className="text-sm text-gray-500">Upvotes: {idea.upvotes}</p>
              <p className="text-sm text-gray-500">
                Entrepreneurs: {idea.entrepreneurs.length > 0 ? idea.entrepreneurs.join(", ") : "None"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;
