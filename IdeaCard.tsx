import React from "react";

interface IdeaCardProps {
  id: number;
  creator: string;
  text: string;
  upvotes: number;
  entrepreneurs: string[];
  onUpvote: (id: number) => void;
  onAgree: (id: number) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  id,
  creator,
  text,
  upvotes,
  entrepreneurs,
  onUpvote,
  onAgree,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md mb-4 hover:shadow-xl transition-shadow duration-300">
      <h3 className="font-semibold text-lg mb-2 text-gray-800">{creator}</h3>
      <p className="text-gray-700 mb-3">{text}</p>

      <div className="flex justify-between items-center text-gray-600 mb-3">
        <span className="text-sm">Upvotes: {upvotes}</span>
        <span className="text-sm">
          Entrepreneurs: {entrepreneurs && entrepreneurs.length > 0 ? entrepreneurs.join(", ") : "None"}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition-colors"
          onClick={() => onUpvote(id)}
        >
          Upvote
        </button>
        <button
          type="button"
          className="bg-orange-500 text-white px-4 py-1 rounded-lg hover:bg-orange-600 transition-colors"
          onClick={() => onAgree(id)}
        >
          Agree Commission
        </button>
      </div>
    </div>
  );
};

export default IdeaCard;
