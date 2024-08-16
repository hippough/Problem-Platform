import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import client from '../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const { problemId } = await req.json();

        // Check user authentication
        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Access the database collection
        const problems = client.db().collection('problems');

        const userId = new ObjectId(session.user!.id);
        const pId = new ObjectId(problemId);

        const problem = await problems.findOne({ "_id": pId });

        if(!problem){
            return NextResponse.json({ success: false, message: 'Problem not found' }, { status: 404 });
        }

        // First, check if the user has already disliked the problem
        const dislikeCheck = await problems.findOne({ "_id": pId, dislikes: userId });

   

        // If the user has disliked the problem, remove the dislike
        if (dislikeCheck) {
            await problems.updateOne(
                { "_id": pId },
                { $pull: { dislikes: userId } as any },
            );

        
            
        }

        let likes = problem.likes.length;
        let dislikes = problem.dislikes.length;
        let comments = problem.comments.length;
        let createdAt = problem.createdAt;

        // Create a new problem document

        const theProblem = await problems.updateOne(
            { "_id": pId },
            {
                $addToSet: { likes: userId },
                $set: { score: likes-dislikes+1, relevance: calculateRelevance(likes+1, comments, createdAt) } // Update relevance based on new score
            },
        );
        


        // Respond with success
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: 'Error saving problem' }, { status: 500 });
    }
}

// Optionally handle other HTTP methods
export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'GET method not supported' }, { status: 405 });
}

function calculateRelevance(likes: number, comments: number, createdAt: Date): number {
    // Weights for the factors
    const weightLikes = 0.4; // Weight for likes
    const weightComments = 0.6; // Weight for comments

    // Calculate time in days since the problem was created
    const now = new Date();
    const timeDifference = Math.max(0, now.getTime() - new Date(createdAt).getTime()); // Time in milliseconds
    const timeDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days

    // Apply exponential decay function
    const decayRate = 0.1; // Rate of decay
    const timeDecay = Math.exp(-decayRate * timeDays); // Exponential decay

    // Calculate weighted engagement
    const weightedEngagement = (likes * weightLikes) + (comments * weightComments);

    // Calculate relevance with time decay
    const relevance = weightedEngagement * timeDecay;

    return relevance;
}


