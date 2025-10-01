import React, { useEffect, useState } from "react";
import PostIdea from "./PostIdea";
import IdeaCard from "./IdeaCard";
import Leaderboard from "./Leaderboard";

// Idea interface
interface Idea {
  id: number;
  creator: string;
  text: string;
  upvotes: number;
  entrepreneurs: string[];
}

// Props interface
interface DashboardProps {
  userId: number; // must be passed from parent (App or Auth)
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all ideas from backend
  const fetchIdeas = async () => {
    try {
      const res = await fetch("http://localhost:8000/ideas");
      const data: Idea[] = await res.json();
      setIdeas(data);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();

    // WebSocket for real-time updates
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

  // Handle new idea posted
  const handleIdeaPosted = (newIdea: Idea) => {
    setIdeas((prev) => [newIdea, ...prev]);
  };

  // Handle upvote
  const handleUpvote = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/ideas/${id}/upvote`, { method: "POST" });
      if (res.ok) {
        setIdeas((prev) =>
          prev.map((idea) => (idea.id === id ? { ...idea, upvotes: idea.upvotes + 1 } : idea))
        );
      }
    } catch (error) {
      console.error("Error upvoting idea:", error);
    }
  };

  // Handle agree commission
  const handleAgree = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/ideas/${id}/agree`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entrepreneur_id: userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setIdeas((prev) =>
          prev.map((idea) => (idea.id === id ? { ...idea, entrepreneurs: data.entrepreneurs } : idea))
        );
      }
    } catch (error) {
      console.error("Error agreeing commission:", error);
    }
  };

  if (!userId) return <p className="text-gray-500">Loading user info...</p>;

  return (
    <div className="container mx-auto p-5">
      {/* Post new idea */}
      <PostIdea creatorId={userId} onIdeaPosted={handleIdeaPosted} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        {/* Idea list */}
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-gray-500">Loading ideas...</p>
          ) : ideas.length === 0 ? (
            <p className="text-gray-500">No ideas yet.</p>
          ) : (
            ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                id={idea.id}
                creator={idea.creator}
                text={idea.text}
                upvotes={idea.upvotes}
                entrepreneurs={idea.entrepreneurs}
                onUpvote={handleUpvote}
                onAgree={handleAgree}
              />
            ))
          )}
        </div>

        {/* Leaderboard */}
        <div>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
