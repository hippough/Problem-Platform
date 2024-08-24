"use server"

import client from "../../lib/db";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { base62Decode, base62Encode, calculateRelevance, getUserInteraction } from "../../lib/functions";


export async function fetchProblems({ sortField, limit, page = 1, search }: { sortField: string; limit: number; page: number, search?: string }) {
    const session = await auth();

    const db = client.db();
    const userId = session?.user!.id;
    const problemsCollection = db.collection("problems");

    try {
        
        
        
        const problems = await problemsCollection
            .find()
            .sort({ [sortField]: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        return problems.map(problem => ({
            _id: base62Encode(problem._id.toString()), // Convert MongoDB ObjectId to string
            user: problem.name,         
            text: problem.description,  
            likes: problem.likes.length,
            dislikes: problem.dislikes.length,
            comments: problem.comments.length,
            createdAt: problem.createdAt, 
            state: session ? getUserInteraction(new ObjectId(userId), problem.likes, problem.dislikes) : 0 // Custom logic for interaction state
        }));;
    } catch (error) {
        console.error("Failed to fetch problems:", error);
        return [];
    }
}

export async function postProblem({
    description,
    anonymous,
  }: {
    description: string;
    anonymous: boolean;
  }) {
    const session = await auth();
  
    if (!session) {
        redirect('/sign-in');
        return null;
    }

    try {

      if(description.length > 500){
        return null;
      }
  
      // Set the name based on the anonymous flag
      const name = anonymous ? 'Anonymous' : session.user!.name;
  
      // Create a new problem document
      const newProblem = await client.db().collection('problems').insertOne({
        description: description,
        userId: new ObjectId(session.user!.id),
        name: name,
        likes: [],
        dislikes: [],
        comments: [],
        score: 0,
        relevance: 0,
        createdAt: new Date(),
      });
  
      // Return the newly created problem's ID
      return base62Encode(newProblem.insertedId.toString());
    } catch (error) {
      console.error('Error posting problem:', error);
      // Handle error accordingly (e.g., return an error message or null)
      return null;
    }
}
  
export async function postComment({ problemId, description } : { problemId: string, description: string }){

    // Check user authentication
    const session = await auth();
    if (!session) {
        redirect('/sign-in');
    }

    try {      
        

        if(description.length > 500){
            return null;
        }

        const pId = new ObjectId(base62Decode(problemId));

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
            return null;
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
        return problemId;
    } catch (error) {
        return null;
    }
}

export async function like({ problemId } : { problemId: string }){

    // Check user authentication
    const session = await auth();
    if (!session) {
        redirect('/sign-in')
    }

    try {

        // Access the database collection
        const problems = client.db().collection('problems');

        const userId = new ObjectId(session.user!.id);
        const pId = new ObjectId(base62Decode(problemId));

        const problem = await problems.findOne({ "_id": pId });

        if(!problem){
            return null;
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

        await problems.updateOne(
            { "_id": pId },
            {
                $addToSet: { likes: userId },
                $set: { score: likes-dislikes+1, relevance: calculateRelevance(likes+1, comments, createdAt) } // Update relevance based on new score
            },
        );
        


        // Respond with success
        return problemId;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function dislike({ problemId }: { problemId: string }){
    // Check user authentication
    const session = await auth();
    if (!session) {
        redirect('/sign-in');
    }

    try {

        // Access the database collection
        const problems = client.db().collection('problems');

        const userId = new ObjectId(session.user!.id);
        const pId = new ObjectId(base62Decode(problemId));

        const problem = await problems.findOne({ "_id": pId });
        if(!problem){
            return null;
        }

        // Check if the user has already liked the problem
        const likeCheck = await problems.findOne({ "_id": pId, likes: userId });

        // If the user has liked the problem, remove the like
        if (likeCheck) {
            await problems.updateOne(
                { "_id": pId },
                { $pull: { likes: userId } as any },
            );

        }
        

        let likes = problem.likes.length;
        let dislikes = problem.dislikes.length;
        let comments = problem.comments.length;
        let createdAt = problem.createdAt;


        // Create a new problem document
        await problems.updateOne(
            { "_id": pId },
            { 
                $addToSet: { dislikes: userId },
                $set: { score: likes-dislikes-1, relevance: calculateRelevance(likes, comments, createdAt) } // Update relevance based on new score
            },
            
        );
        



        // Respond with success
        return problemId;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function remove({ problemId }: { problemId: string }){

    // Check user authentication
    const session = await auth();
    if (!session) {
        redirect('/sign-in');
    }

    try {

        // Access the database collection
        const problems = client.db().collection('problems');

        const userId = new ObjectId(session.user!.id);
        const pId = new ObjectId(base62Decode(problemId));

        // First, check if the user has already disliked the problem
        const problemA = await problems.findOne({ "_id": pId, dislikes: userId });
        
        let likes;
        let dislikes;
        let comments;
        let createdAt;

        // If the user has disliked the problem, remove the dislike
        if (problemA) {
            likes = problemA.likes.length;
            dislikes = problemA.dislikes.length;
            comments = problemA.comments.length;
            createdAt = problemA.createdAt;


            await problems.updateOne(
                { "_id": pId },
                { 
                    $pull: { dislikes: userId } as any,
                    $set: { score: likes-dislikes+1, relevance: calculateRelevance(likes, comments, createdAt) } // Update relevance based on new score
            
                }
                
            );

            
        }

        // First, check if the user has already liked the problem
        const problemB = await problems.findOne({ "_id": pId, likes: userId });

        // If the user has liked the problem, remove the like
        if (problemB) {
            likes = problemB.likes.length;
            dislikes = problemB.dislikes.length;
            comments = problemB.comments.length;
            createdAt = problemB.createdAt;


            await problems.updateOne(
                { "_id": pId },
                { 
                    $pull: { likes: userId } as any,
                    $set: { score: likes-dislikes-1, relevance: calculateRelevance(likes-1, comments, createdAt) } // Update relevance based on new score
                },
            );
 
        }

        // Respond with success
        return problemId;
    } catch (error) {
        console.error('Error:', error);
        return null
    }
}
