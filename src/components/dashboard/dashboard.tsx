import { auth } from "../../../auth";
import { SignOutButton } from "../sign-out-button";
import { redirect } from 'next/navigation';
import { Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Flame, Sparkles, ChartColumnIncreasing } from "lucide-react";
import ProblemForm from "./ProblemForm";
import Post from "./Post";

import client from "../../../lib/db";
import { ObjectId } from "mongodb";

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

// Utility function to fetch problems
async function fetchProblems(db: any, sortField: string, limit: number): Promise<Problem[]> {
    return db.collection("problems").find().sort({ [sortField]: -1 }).limit(limit).toArray();
}

// Utility function to get user interaction state
function getUserInteraction(userId: ObjectId, likes: ObjectId[], dislikes: ObjectId[]): number {
    if (likes.some(id => id.equals(userId))) return 1; // User liked the problem
    if (dislikes.some(id => id.equals(userId))) return 2; // User disliked the problem
    return 0; // User did nothing
}

export default async function Dashboard() {
    const session = await auth();
    if (!session) {
        redirect('/sign-in');
        return null;
    }

    const db = client.db();
    const userId = new ObjectId(session.user!.id);

    // Fetch all the problems in parallel
    const [hotProblems, newProblems, topProblems] = await Promise.all([
        fetchProblems(db, 'relevance', 40),
        fetchProblems(db, 'createdAt', 40),
        fetchProblems(db, 'score', 40),
    ]);

    const renderProblems = (problems: Problem[]) => (
        <div className="space-y-4">
            {problems.map(problem => (
                <Post
                    key={problem._id.toString()}
                    user={problem.name}
                    text={problem.description}
                    likes={problem.likes.length}
                    dislikes={problem.dislikes.length}
                    comments={problem.comments.map(id => id.toString())}
                    createdAt={problem.createdAt}
                    problemId={problem._id.toString()}
                    state={getUserInteraction(userId, problem.likes, problem.dislikes)}
                />
            ))}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Welcome back, {session.user!.name}</h1>
                <SignOutButton />
            </div>

            <Card className="mt-8 p-6">
                <h2 className="text-xl font-semibold mb-4">Create New Problem</h2>
                <ProblemForm />
            </Card>

            <Tabs defaultValue="hot" className="mt-8">
                <TabsList>
                    <TabsTrigger value="hot"><Flame size={15} className="mr-2" />Hot</TabsTrigger>
                    <TabsTrigger value="new"><Sparkles size={15} className="mr-2" /> New</TabsTrigger>
                    <TabsTrigger value="top"><ChartColumnIncreasing size={15} className="mr-2" />Top</TabsTrigger>
                </TabsList>

                <TabsContent value="hot">{renderProblems(hotProblems)}</TabsContent>
                <TabsContent value="new">{renderProblems(newProblems)}</TabsContent>
                <TabsContent value="top">{renderProblems(topProblems)}</TabsContent>
            </Tabs>
        </div>
    );
}



// import { auth } from "../../../auth";
// import { SignOutButton } from "../sign-out-button";
// import { redirect } from 'next/navigation';
// import { Card } from "../ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
// import { Textarea } from "../ui/textarea";
// import { Button } from "../ui/button";
// import Post from "./Post"; 
// import { ChartColumnIncreasing, Flame, Sparkles } from "lucide-react";
// import ProblemForm from "./ProblemForm";

// import client from "../../../lib/db";
// import { ObjectId } from "mongodb";



// export default async function Dashboard() {
//     const session = await auth();


//     if (!session) {
//         redirect('/sign-in');
//         return null;
//     }

//     const db = client.db();
//     const userId = new ObjectId(session.user!.id);

//     const users = db.collection("users");

//     const hotProblems = await db.collection("problems").find().sort({ relevance: -1 }).limit(20).toArray();
//     const newProblems = await db.collection("problems").find().sort({ createdAt: -1 }).limit(20).toArray();
//     const topProblems = await db.collection("problems").find().sort({ score: -1 }).limit(20).toArray();

//     const getUserInteraction = (likes: ObjectId[], dislikes: ObjectId[]): number => {
        
//         if (likes.some(id => id.equals(new ObjectId(userId)))) return 1; // User liked the problem
//         if (dislikes.some(id => id.equals(new ObjectId(userId)))) return 2; // User disliked the problem
//         return 0; // User did nothing
//     };

//     return (
//         <>
//             <div className="max-w-2xl mx-auto p-6">
//                 <div className="flex justify-between items-center">
//                     <h1 className="text-3xl font-bold">Welcome back, {session.user!.name}</h1>
//                     <SignOutButton />
//                 </div>

//                 <Card className="mt-8 p-6">
//                     <h2 className="text-xl font-semibold mb-4">Create New Problem</h2>

//                     <ProblemForm />
                    
//                 </Card>

//                 <Tabs defaultValue="hot" className="mt-8">
//                     <TabsList>
//                         <TabsTrigger value="hot"><Flame size={15} className="mr-2"/>Hot</TabsTrigger>
//                         <TabsTrigger value="new"><Sparkles size={15} className="mr-2"/> New</TabsTrigger>
//                         <TabsTrigger value="top"><ChartColumnIncreasing size={15} className="mr-2"/>Top</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="hot">
//                     <div className="space-y-4">
//                             {hotProblems.map((problem: any) => (
//                                 <Post
//                                     key={problem._id}
//                                     user={problem.name} // Adjust as needed
//                                     text={problem.description}
//                                     likes={problem.likes.length}
//                                     dislikes={problem.dislikes.length}
//                                     comments={problem.comments.map((id: ObjectId) => id.toString())}
//                                     createdAt={problem.createdAt}
//                                     problemId={problem._id.toString()}
//                                     state={getUserInteraction(problem.likes, problem.dislikes)}
                                    
//                                 />
//                             ))}
//                         </div>
//                     </TabsContent>

//                     <TabsContent value="new">
//                         <div className="space-y-4">
//                             {newProblems.map((problem: any) => (
//                                 <Post
//                                     key={problem._id}
//                                     user={problem.name} // Adjust as needed
//                                     text={problem.description}
//                                     likes={problem.likes.length}
//                                     dislikes={problem.dislikes.length}
//                                     comments={problem.comments.map((id: ObjectId) => id.toString())}
//                                     createdAt={problem.createdAt}
//                                     problemId={problem._id.toString()}
//                                     state={getUserInteraction(problem.likes, problem.dislikes)}
//                                 />
//                             ))}
//                         </div>
//                     </TabsContent>

//                     <TabsContent value="top">
//                     <div className="space-y-4">
//                             {topProblems.map((problem: any) => (
//                                 <Post
//                                     key={problem._id}
//                                     user={problem.name} // Adjust as needed
//                                     text={problem.description}
//                                     likes={problem.likes.length}
//                                     dislikes={problem.dislikes.length}
//                                     comments={problem.comments.map((id: ObjectId) => id.toString())}
//                                     createdAt={problem.createdAt}
//                                     problemId={problem._id.toString()}
//                                     state={getUserInteraction(problem.likes, problem.dislikes)}
//                                 />
//                             ))}
//                         </div>
//                     </TabsContent>
//                 </Tabs>
//             </div>
//         </>
//     );
// }


    