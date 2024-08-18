import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import client from '../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    return NextResponse.json({ success: false, message: "POST not supported"})
}

// Optionally handle other HTTP methods
export async function GET(req: NextRequest) {
    const db = client.db();
    const hotProblems = await db.collection("problems").find().sort({ relevance: -1 }).limit(3).toArray();

    return NextResponse.json({ success: true, posts: hotProblems });
}
