"use client"

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Toaster, toast } from "sonner";

export default function ProblemForm() {
    const [description, setDescription] = useState('');
    const [anonymous, setAnonymous] = useState(false);

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
                body: JSON.stringify({ description, anonymous }),
            });

            if (response.ok) {
                setDescription('');
                setAnonymous(false);
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
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="anonymous"
                    checked={anonymous}
                    onChange={() => setAnonymous(!anonymous)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-600">Post anonymously</label>
            </div>
            <Button
                type="submit"
                className="w-full"
            >
                Post Problem
            </Button>
        </form>
    );
}
