import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import client from '../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const { problemId, description } = await req.json();

        // Check user authentication
        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const pId = new ObjectId(problemId);

        // Access the database collection
        const problems = client.db().collection('problems');
        const comments = client.db().collection('comments');

        const newComment = await comments.insertOne({ 
            description: description,
            userId: new ObjectId(session.user!.id),
            problemId: pId,
            name: session.user!.name,
            likes: [],
            dislikes: [],
            score: 0,
            createdAt: new Date()
        });

        // Create a new problem document
        const updateProblem = await problems.findOneAndUpdate(
            { "_id": pId },
            {
                $push: {
                    comments: newComment.insertedId as any
                }
                
            }
        );

        if (!updateProblem) {
            return NextResponse.json({ success: false, message: 'Problem not found' }, { status: 404 });
        }

        let likes = updateProblem.likes.length;
        let dislikes = updateProblem.dislikes.length;
        let cmts = updateProblem.comments.length;
        let createdAt = updateProblem.createdAt;

        await problems.updateOne(
            { "_id": pId },
            {
                $set: { score: likes-dislikes, relevance: calculateRelevance(likes, cmts+1, createdAt) } // Update relevance based on new score
            },
        
        )



        // Respond with success
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: 'Error saving problem' }, { status: 500 });
    }
}

// Optionally handle other HTTP methods
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const problemId = searchParams.get('problemId');

        if (!problemId) {
            throw new Error('Missing problemId');
        }

        const db = client.db();
        const problems = db.collection('problems');
        const comments = db.collection('comments');

        // Fetch the problem
        const problem = await problems.findOne({ "_id": new ObjectId(problemId) });

        if (!problem) {
            throw new Error('Problem not found');
        }

        // Fetch the comments using the IDs stored in the problem
        const commentIds = problem.comments; // Assume `problem.comments` is an array of comment IDs
        const commentDocs = await comments.find({ _id: { $in: commentIds.map((id: string) => new ObjectId(id)) } }).toArray();

        const mappedComments = commentDocs.map((comment: any) => ({
            _id: comment._id,
            name: comment.name,
            description: comment.description,
            createdAt: comment.createdAt
        }));

        


        return NextResponse.json({ success: true, comments: mappedComments });
    } catch(error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: 'Error getting comments' }, { status: 500 });
    }
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

