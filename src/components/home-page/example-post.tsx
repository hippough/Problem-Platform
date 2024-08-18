import { FC } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
import { ThumbsUp, ThumbsDown, MessageSquareText } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface PostProps {
  user: string;
  text: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  comments: number;
}

const Post: FC<PostProps> = ({ user, text, createdAt, likes, dislikes, comments }) => {


  return (


    <Card className="p-4">
      <div className="flex justify-between">
        <div className="w-full max-w-[calc(100%-120px)] pr-4">
          <p className="text-sm text-gray-500">Posted by {user} {timeAgo(createdAt)}</p>
          <p className="mt-4 py-4">
            {text}
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <ToggleGroup disabled={true} className="flex-col" type="single">
              <ToggleGroupItem value="like" size="sm" className="text-gray-500">
                  <ThumbsUp size={20} />
                  <span className="ml-1">{likes}</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="dislike" size="sm" className="text-gray-500">
                  <ThumbsDown size={20} />
                  <span className="ml-1">{dislikes}</span>
              </ToggleGroupItem>
          
          </ToggleGroup>
          <Button disabled={true} variant="ghost" size="sm" className="text-gray-500 mt-2">
              <MessageSquareText size={20} />
              <span className="ml-1">{comments}</span>
          </Button>
        </div>
      </div>
    </Card>
    

  );
};

function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
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
