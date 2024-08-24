import { Toaster } from "sonner";
import Feed from "../../components/dashboard/feed";
import SessionProvider from "../../components/dashboard/session-wrapper";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Searchbar from "@/components/dashboard/search";
import ProblemForm from "@/components/dashboard/problem-form";
import { ObjectId } from "mongodb";
import client from "../../../lib/db";
import { base62Encode, getUserInteraction } from "../../../lib/functions";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - Problem Platform",
    description: "Explore and manage problems on the Problem Platform. Check out hot, new, and top problems, and interact with posts through likes, comments, and more.",
  };

type Problem = {
    _id: ObjectId;
    name: string;
    description: string;
    likes: ObjectId[];
    dislikes: ObjectId[];
    comments: ObjectId[];
    createdAt: Date;
    relevance: number;
    score: number;
};

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const session = await auth();
    

    // Correct the typo and ensure searchParams.search is a string
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

    const db = client.db();
    const userId = session?.user!.id;
    
    async function fetchProblems(db: any, sortField: string, limit: number): Promise<Problem[]> {
        return db.collection("problems").find().sort({ [sortField]: -1 }).limit(limit).toArray();
    }

    const [hotProblems, newProblems, topProblems] = await Promise.all([
        fetchProblems(db, 'relevance', 10),
        fetchProblems(db, 'createdAt', 10),
        fetchProblems(db, 'score', 10),
    ]);

    



    const initialHot = hotProblems.map(problem => ({
        _id: base62Encode(problem._id.toString()), // Convert MongoDB ObjectId to string
        user: problem.name,         
        text: problem.description,  
        likes: problem.likes.length,
        dislikes: problem.dislikes.length,
        comments: problem.comments.length,
        createdAt: problem.createdAt, 
        state: getUserInteraction(new ObjectId(userId), problem.likes, problem.dislikes) // Custom logic for interaction state
    }));
    
    const initialNew = newProblems.map(problem => ({
        _id: base62Encode(problem._id.toString()), // Convert MongoDB ObjectId to string
        user: problem.name,         
        text: problem.description,  
        likes: problem.likes.length,
        dislikes: problem.dislikes.length,
        comments: problem.comments.length,
        createdAt: problem.createdAt, 
        state: getUserInteraction(new ObjectId(userId), problem.likes, problem.dislikes) // Custom logic for interaction state
    }));

    const initialTop = topProblems.map(problem => ({
        _id: base62Encode(problem._id.toString()), // Convert MongoDB ObjectId to string
        user: problem.name,         
        text: problem.description,  
        likes: problem.likes.length,
        dislikes: problem.dislikes.length,
        comments: problem.comments.length,
        createdAt: problem.createdAt, 
        state: getUserInteraction(new ObjectId(userId), problem.likes, problem.dislikes) // Custom logic for interaction state
    }));


    return (
        <SessionProvider>
            <main>
                <Toaster />
                <Searchbar name={session?.user!.name as string} auth={session ? true : false} img={session?.user!.image as string}/>
                <ProblemForm />
                <Feed initialHot={initialHot} initialNew={initialNew} initialTop={initialTop} totalProblemsNumber={hotProblems.length} />
            </main>
        </SessionProvider>
    );
}
