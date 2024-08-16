"use client"

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Toaster, toast } from "sonner";

export default function ProblemForm() {
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (description.trim() === '') {
            toast.info('Description cannot be empty.');
            return;
        }

        try {
            const response = await fetch('/api/problem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description }),
            });

            if (response.ok) {
                setDescription('');
                toast.success('Problem posted successfully!');
            } else {
                throw new Error('Failed to post problem');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                name="description"
                value={description}
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your problem..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
                type="submit"
                className="w-full"
            >
                Post Problem
            </Button>
        </form>
        
    );
}
