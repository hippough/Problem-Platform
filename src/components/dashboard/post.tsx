"use client"

import { FC } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
import { ThumbsUp, ThumbsDown, MessageSquareText } from "lucide-react";
import Toggles from "./toggles";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { createSlug, timeAgo } from "../../../lib/functions";

interface PostProps {
  user: string;
  text: string;
  likes: number;
  dislikes: number;
  comments: number;
  createdAt: Date;
  problemId: string;
  state: number;
}

const Post: FC<PostProps> = ({ user, text, likes, dislikes, comments, createdAt, problemId, state }) => {
  
  

  return (
    <Card className="p-4" >
      <div className="flex justify-between">
        <div className="w-full max-w-[calc(100%-30px)] pr-4">
          <p className="text-sm text-gray-500">Posted by {user} {timeAgo(createdAt)}</p>
          <p className="mt-4">
            <Link href={`/dashboard/problem/${problemId}/${createSlug(text)}`}>
              {text}
            </Link>
            
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Toggles likes={likes} dislikes={dislikes} problemId={problemId} state={state} />
          <Link href={`/dashboard/problem/${problemId}/${createSlug(text)}`} passHref>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <MessageSquareText size={20} />
              <span className="ml-1">{comments}</span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};



export default Post;
