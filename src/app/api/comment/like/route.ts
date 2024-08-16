import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import client from '../../../../../lib/db';
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

        // First, check if the user has already disliked the problem
        const problem = await problems.findOne({ "_id": pId, dislikes: userId });

        // If the user has disliked the problem, remove the dislike
        if (problem) {
            await problems.updateOne(
                { "_id": pId },
                { $pull: { dislikes: userId } as any },
            );
        }

        // Create a new problem document
        const theProblem = await problems.updateOne(
            { "_id": pId },
            { $addToSet: { likes: userId } },
            
        );
        // Check if any document was matched and modified
        if (theProblem.matchedCount === 0) {
            return NextResponse.json({ success: false, message: 'Problem not found' }, { status: 404 });
        }
        if (theProblem.modifiedCount === 0) {
            return NextResponse.json({ success: false, message: 'User already liked this problem' }, { status: 200 });
        }

        


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
