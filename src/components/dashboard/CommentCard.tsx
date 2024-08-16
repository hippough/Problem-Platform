import { FC } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
import { ThumbsUp, ThumbsDown, MessageSquareText } from "lucide-react";
import Toggles from "./Toggles";
import { ObjectId } from "mongodb";
import CommentButton from "./CommentButton";
import CommentToggles from "./CommentToggles";

interface CommentProps {
  user: string;
  text: string;
//   likes: number;
//   dislikes: number;
  createdAt: Date;
//   commentId: string;
//   state: number;
}

const Post: FC<CommentProps> = ({ user, text, createdAt }) => {

  const createdAtDate = new Date(createdAt);
  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <div className="w-full pr-4">
          <p className="text-sm text-gray-500">Posted by {user} {timeAgo(createdAtDate)}</p>
          <p className="mt-4">
            {text}
          </p>
        </div>
        
      </div>
    </Card>
  );
};

function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const interval = Math.floor(seconds / 31536000); // seconds in a year

  if (interval > 1) {
      return `${interval} years ago`;
  }
  if (interval === 1) {
      return `1 year ago`;
  }

  const days = Math.floor(seconds / 86400); // seconds in a day
  if (days > 1) {
      return `${days} days ago`;
  }
  if (days === 1) {
      return `1 day ago`;
  }

  const hours = Math.floor(seconds / 3600); // seconds in an hour
  if (hours > 1) {
      return `${hours} hours ago`;
  }
  if (hours === 1) {
      return `1 hour ago`;
  }

  const minutes = Math.floor(seconds / 60); // seconds in a minute
  if (minutes > 1) {
      return `${minutes} minutes ago`;
  }
  if (minutes === 1) {
      return `1 minute ago`;
  }

  return `just now`;
}

export default Post;
