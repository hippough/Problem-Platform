// handle if slug is typed wrong

import { notFound, redirect } from "next/navigation"
import client from "../../../../../lib/db";
import { ObjectId } from "mongodb";
import { base62Decode, createSlug } from "../../../../../lib/functions";



export default async function Problem( { params }: { params: { problemId: string } } ){
    if(!params.problemId){
        notFound();
    }

    const db = client.db();
    
    const pId = base62Decode(params.problemId);

    const problem = await db.collection('problems').findOne({ _id: new ObjectId(pId) });


    if(!problem){
        notFound();
        
    }

    redirect(`/dashboard/problem/${params.problemId}/${createSlug(problem.description)}`)

    return (
        <>
            <h1></h1>
        </>
    )
}