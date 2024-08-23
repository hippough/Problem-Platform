"use client"

import { FC } from "react";
import { Card } from "../ui/card";
import { timeAgo } from "../../../lib/functions";

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



export default Post;
