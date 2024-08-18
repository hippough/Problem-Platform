"use client"

import { FC } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
import { ThumbsUp, ThumbsDown, MessageSquareText } from "lucide-react";
import Toggles from "./Toggles";
import { ObjectId } from "mongodb";
import CommentButton from "./CommentButton";

interface PostProps {
  user: string;
  text: string;
  likes: number;
  dislikes: number;
  comments: string[];
  createdAt: Date;
  problemId: string;
  state: number;
}

const Post: FC<PostProps> = ({ user, text, likes, dislikes, comments, createdAt, problemId, state }) => {


  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <div className="w-full max-w-[calc(100%-120px)] pr-4">
          <p className="text-sm text-gray-500">Posted by {user} {timeAgo(createdAt)}</p>
          <p className="mt-4">
            {text}
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Toggles likes={likes} dislikes={dislikes} problemId={problemId} state={state} />
          <CommentButton num={comments.length} postString={"Posted by " + user + " " + timeAgo(createdAt)} text={text} problemId={problemId}/>
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
