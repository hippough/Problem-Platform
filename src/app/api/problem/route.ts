import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import client from '../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const { description } = await req.json();

        // Check user authentication
        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Access the database collection
        const problems = client.db().collection('problems');

        // Create a new problem document
        const newProblem = await problems.insertOne({ 
            description: description,
            userId: new ObjectId(session.user!.id),
            name: session.user!.name,
            likes: [],
            dislikes: [],
            comments: [],
            score: 0,
            relevance: 0,
            createdAt: new Date()
        });

        // Respond with success
        return NextResponse.json({ success: true, data: newProblem }, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: 'Error saving problem' }, { status: 500 });
    }
}

// Optionally handle other HTTP methods
export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'GET method not supported' }, { status: 405 });
}
