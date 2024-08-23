import { fetchProblems } from '../../../actions/actions';
import Searchbar from '../../../components/dashboard/search';
import Post from '../../../components/dashboard/post';
import client from '../../../../lib/db';
import { base62Encode, getUserInteraction } from '../../../../lib/functions';
import { ObjectId } from 'mongodb';
import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Head from 'next/head';

export async function generateMetadata(searchParams: { [key: string]: string | string[] | undefined }): Promise<Metadata> {
    // Extract search query
    const query = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q || '';

    return {
        title: query ? `Search Results for "${query}" - Problem Platform` : "Problem Platform",
        description: query 
            ? `Search results for "${query}" on Problem Platform. Discover and engage with problems based on your search criteria.`
            : "A web app where users can share, discuss, and find solutions to various problems. Engage with posts through likes, comments, and discover the most relevant issues based on user interaction and recency.",
    };
}


export default async function page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

    const session = await auth();
    if (!session) {
        redirect('/sign-in');
        return null;
    }

    const query = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q || ''; // Get the search query from the URL
    const db = client.db();
    const userId = session.user!.id;

    const pipeline: PipelineStage[] = [{ $skip: 0 }, { $limit: 30 }]

    if (query) {
      pipeline.unshift({
        $search: {
          index: 'problemSearch',
          text: {
            query,
            fuzzy: {
            },
            path: {
              wildcard: '*'
            }
          }
        }
      })
    }

    
    const problems = db.collection("problems");

    const result = await problems.aggregate(pipeline).toArray();
    const results = result.map(problem => ({
        _id: base62Encode(problem._id.toString()), // Convert MongoDB ObjectId to string
        user: problem.name,         
        text: problem.description,  
        likes: problem.likes.length,
        dislikes: problem.dislikes.length,
        comments: problem.comments.length,
        createdAt: problem.createdAt, 
        state: getUserInteraction(new ObjectId(userId), problem.likes, problem.dislikes) // Custom logic for interaction state
    }));;

    return (
        <>
            
            <Searchbar />
            <div className="max-w-4xl mx-auto mt-8">
                <h1 className="text-2xl font-semibold mb-6">Search Results for "{query}"</h1>
                <div className="space-y-4 mb-4">
                    {results.map(( problem, index ) => (
                        <Post
                            key={index}
                            user={problem.user}
                            text={problem.text}
                            likes={problem.likes}
                            dislikes={problem.dislikes}
                            comments={problem.comments}
                            createdAt={problem.createdAt}
                            problemId={problem._id}
                            state={problem.state}
                        />
                    ))}
                </div>
            </div>
        </>
        
    );
}

type PipelineStage =
  | {
      $search: {
        index: string
        text: {
          query: string
          fuzzy: {}
          path: {
            wildcard: string
          }
        }
      }
    }
  | {
      $skip: number
    }
  | {
      $limit: number
    }