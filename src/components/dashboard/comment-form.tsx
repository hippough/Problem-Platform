"use client"

import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { postComment } from "@/actions/actions";


export default function CommentForm({ problemId } : { problemId: string}){
    const [description, setDescription] = useState('');

    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (description.trim() === '') {
            toast.info('Comment cannot be empty.');
            return;
        }

        try {
            const response = await postComment({ problemId, description})

            if (response) {
                setDescription('');
                toast.success('Comment posted successfully! Reload the page to view.');
            } else {
                throw new Error('Failed to post comment');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };
    
    return (
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
                <Button type="submit" className="w-full" >Post Comment</Button>

        </form>
    )
}