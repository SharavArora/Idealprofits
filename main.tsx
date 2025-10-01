import React from "react";
import ReactDOM from "react-dom/client";
import IdeaCard from "./IdeaCard";

const idea = {
  id: 1,
  creator: "Alice",
  text: "A new way to connect entrepreneurs.",
  upvotes: 10,
  entrepreneurs: ["Bob", "Charlie"],
};

const handleUpvote = (id: number) => {
  alert(`Upvoted idea ${id}`);
};

const handleAgree = (id: number) => {
  alert(`Agreed to commission for idea ${id}`);
};

const App = () => (
  <div className="p-10">
    <IdeaCard
      id={idea.id}
      creator={idea.creator}
      text={idea.text}
      upvotes={idea.upvotes}
      entrepreneurs={idea.entrepreneurs}
      onUpvote={handleUpvote}
      onAgree={handleAgree}
    />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
