import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import client from '../../../../../../lib/db';
import { redirect } from 'next/navigation';
import { Card } from '../../../../../components/ui/card';
import Toggles from '../../../../../components/dashboard/toggles';
import { Toaster } from 'sonner';
import { auth } from '../../../../../../auth';
import CommentCard from '../../../../../components/dashboard/comment-card';
import Searchbar from '../../../../../components/dashboard/search';
import CommentForm from '../../../../../components/dashboard/comment-form';
import { base62Decode, base62Encode, createSlug, getUserInteraction } from '../../../../../../lib/functions';
import Head from 'next/head';
import { Metadata } from 'next';


export async function generateMetadata({ params }: { params: { problemId: string } }): Promise<Metadata> {
    const pId = base62Decode(params.problemId);

    // Validate ObjectId
    if (!ObjectId.isValid(pId)) {
        return { title: "Problem Not Found", description: "The problem you are looking for does not exist." };
    }

    const db = client.db();
    const problem = await db.collection('problems').findOne({ _id: new ObjectId(pId) });

    if (!problem) {
        return { title: "Problem Not Found", description: "The problem you are looking for does not exist." };
    }

    return {
        title: `${problem.description} - Problem Platform`,
        description: `Discuss and interact with the problem "${problem.description}" posted by ${problem.name}. See comments, reactions, and more.`,
    };
}

const ProblemPage = async ({ params }: { params: { problemId: string, slug: string } }) => {

    const session = await auth();
    if (!session) {
        redirect('/sign-in');
        return null;
    }

  const pId = base62Decode(params.problemId);

  // Validate ObjectId
  if (!ObjectId.isValid(pId)) {
    notFound();
  }

  const db = client.db();
  const problem = await db.collection('problems').findOne({ _id: new ObjectId(pId) });

  if (!problem) {
    console.log("Not found")
    notFound();
  }

  const expectedSlug = createSlug(problem.description); // Assuming `title` is the text field
  if (params.slug !== expectedSlug) {
    redirect(`/dashboard/problem/${params.problemId}/${createSlug(problem.description)}`)
  }


  const comments = await db.collection('comments').find({ _id: { $in: problem.comments } }).toArray();

  return (
    <> 
        <main>
            <Toaster />
            <Searchbar />
            <div className="max-w-4xl mx-auto p-4">
                <Card className="p-6 flex">
                    {/* Problem Details */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold">{problem.description}</h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Posted by {problem.name} {timeAgo(problem.createdAt)}
                        </p>
                    </div>

                    {/* Interaction Section */}
                    <div className="flex items-center space-x-4 ml-6">
                        <Toggles
                            likes={problem.likes.length}
                            dislikes={problem.dislikes.length}
                            problemId={base62Encode(problem._id.toString())}
                            state={getUserInteraction(new ObjectId(session.user!.id), problem.likes, problem.dislikes)} // Pass the current like/dislike state here
                        />
                    </div>
                </Card>

                {/* Comments Section */}
                <Card className="p-6 mt-8">
                    <h2 className="text-xl font-semibold">{problem.comments.length} Comments</h2>
                    
                    <CommentForm problemId={base62Encode(problem._id.toString())}/>
                    
                    <div className="mt-6 space-y-6">
                        {comments.map( (comment, index) => (
                            <CommentCard
                            key={index}
                            user={comment.name}
                            text={comment.description}
                            createdAt={comment.createdAt}
                            />
                        ))}
                    </div>
                </Card>
            </div>
        </main>
    </>
    
    
);
};

export default ProblemPage;


function timeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    const interval = Math.floor(seconds / 31536000); // seconds in a year
  
    if (interval > 1) {
        return `${interval} years ago`;
    }
    if (interval === 1) {
        return `1 year ago`;
    }
  
    const days = Math.floor(seconds / 86400); // seconds in a day
    if (days > 1) {
        return `${days} days ago`;
    }
    if (days === 1) {
        return `1 day ago`;
    }
  
    const hours = Math.floor(seconds / 3600); // seconds in an hour
    if (hours > 1) {
        return `${hours} hours ago`;
    }
    if (hours === 1) {
        return `1 hour ago`;
    }
  
    const minutes = Math.floor(seconds / 60); // seconds in a minute
    if (minutes > 1) {
        return `${minutes} minutes ago`;
    }
    if (minutes === 1) {
        return `1 minute ago`;
    }
  
    return `just now`;
  }
  