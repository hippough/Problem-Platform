"use client";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { postProblem } from "@/actions/actions"; // Adjust the path based on your file structure

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
            const problemId = await postProblem({ description, anonymous });

            if (problemId) {
                setDescription('');
                setAnonymous(false);
                toast.success('Problem posted successfully! Reload the page to view.');
            } else {
                throw new Error('Failed to post problem');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="px-2">
            <Card className="mt-2 p-6 max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Create New Problem</h2>
                
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
            </Card>
        </div>
        
    );
}
