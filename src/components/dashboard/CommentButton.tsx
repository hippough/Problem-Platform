"use client"

import { MessageSquareText } from "lucide-react";
import { Button } from "../ui/button";
import { FC, useEffect, useState } from "react";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import Toggles from "./Toggles";
import { ObjectId } from "mongodb";
import { toast } from "sonner";
import CommentCard from "./CommentCard";

interface comment {
    num: number,
    postString: string;
    text: string;
    problemId: string;


}



const CommentButton: FC<comment> = ({ num: num, postString: postString, text: text, problemId: problemId }) => {
    const [description, setDescription] = useState('');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comment?problemId=${problemId}`, { method: 'GET' });
            
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments);
            } else {
                throw new Error('Failed to fetch comments');
            }
        } catch (error) {
            toast.error('An error occurred while fetching comments.');
        }
    };


    useEffect(() => {
        if (isSheetOpen) {
            fetchComments();
        }
    }, [isSheetOpen]);
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (description.trim() === '') {
            toast.info('Comment cannot be empty.');
            return;
        }

        try {
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ problemId, description }),
            });

            if (response.ok) {
                setDescription('');
                toast.success('Comment posted successfully!');
            } else {
                throw new Error('Failed to post comment');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };
    
    return (
        <Sheet key="bottom">
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-500 mt-2" onClick={() => setIsSheetOpen(true)}>
                    <MessageSquareText size={20} />
                    <span className="ml-1">{num}</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="bottom"
                className="w-[600px] h-[600px] sm:w-[700px] sm:h-[800px] mx-auto rounded-lg"
            >
                
                <SheetHeader>
                    <SheetTitle>Comments</SheetTitle>
                    <div className="pb-4">
                        <Card className="p-4">
                            <div className="flex justify-between">
                                <div className="w-full pr-4">
                                <p className="text-sm text-gray-500">{postString}</p>
                                <p className="mt-4">
                                    {text}
                                </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <SheetDescription>
                      Add your thoughts to the discussion:
                    </SheetDescription>
                </SheetHeader>
                
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <Textarea
                            name="description"
                            value={description}
                            maxLength={500}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter your thoughts..."
                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <SheetFooter>
                        
                        <Button type="submit">Post Comment</Button>
                        
                    </SheetFooter>
                    <SheetDescription>
                        {comments.length} comments
                    </SheetDescription>

                    <div className="py-4 space-y-4">
                        {comments.map((comment: any) => (
                            <CommentCard
                                key={comment._id}
                                user={comment.name}
                                text={comment.description}
                                createdAt={comment.createdAt}
                            />
                        ))}
                    </div>
                    

                </form>
                
            </SheetContent>
            
        </Sheet>
        
    )
}
export default CommentButton;