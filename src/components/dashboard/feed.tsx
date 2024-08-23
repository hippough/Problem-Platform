"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { SignOutButton } from "../sign-out-button";
import { Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Flame, Sparkles, ChartColumnIncreasing } from "lucide-react";
import { Document } from 'mongodb'
import Post from "../dashboard/post";

import { fetchProblems } from '@/actions/actions';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

import { useInView } from 'react-intersection-observer'

export default function Feed({ 
    initialHot, initialNew, initialTop
}: { 
    initialHot: Document[] | undefined, 
    initialNew: Document[] | undefined, 
    initialTop: Document[] | undefined,
    totalProblemsNumber: number
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentTab = searchParams.get('tab') || 'hot';

    // Update the URL when a tab is selected
    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", value);
        
        router.push(`?${params.toString()}`);
        
        
    };


    // Problem Arrays
    const [hotPage, setHotPage] = useState(1);
    const [newPage, setNewPage] = useState(1);
    const [topPage, setTopPage] = useState(1);

    const [ref, inView] = useInView();

    const [hotProblems, setHotProblems] = useState(initialHot);
    const [newProblems, setNewProblems] = useState(initialNew);
    const [topProblems, setTopProblems] = useState(initialTop);

    const loadMore = async () => {
        try {
            
            switch (currentTab) {
              case "hot":
                const addHot = await fetchProblems({ sortField: 'relevance', limit: 10, page: hotPage + 1 });
                if(addHot?.length) {
                    setHotProblems((prev) => [...(prev?.length ? prev : []), ...addHot]);
                    setHotPage((prev) => prev + 1);
                }
                
                break;
              case "new":
                const addNew = await fetchProblems({ sortField: 'createdAt', limit: 10, page: newPage + 1 });
                if(addNew?.length){
                    setNewProblems((prev) => [...(prev?.length ? prev : []), ...addNew]);
                    setNewPage((prev) => prev + 1)
                }
                     
                break;
              case "top":
                const addTop = await fetchProblems({ sortField: 'score', limit: 10, page: topPage + 1 });
                if(addTop?.length) {
                    setTopProblems((prev) => [...(prev?.length ? prev : []), ...addTop]);
                    setTopPage((prev) => prev + 1)
                }
                break;
              default:
                return;
            }


    
            
          } catch (error) {
            console.error('Error loading more problems:', error);
          }
    }




    const renderProblems = (problems: any[]) => (
        <>
            <div className="space-y-4">
                {problems.map(( problem, index ) => (
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
            { (
                <div
                ref={ref}
                className='col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4'
            >
                <svg
                aria-hidden='true'
                className='h-10 w-10 animate-spin fill-sky-600 text-gray-200 dark:text-gray-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                >
                <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                />
                <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                />
                </svg>
                <span className='sr-only'>Loading...</span>
            </div>
            )}
            
            
        </>
        
    );

    useEffect(() => {
        if (inView) {
          loadMore()
        }
      }, [inView])

    return (
        <div className="max-w-3xl mx-auto px-5 mb-5">

            <Tabs value={currentTab} onValueChange={handleTabChange} className="mt-4">
                <TabsList>
                    <TabsTrigger value="hot"><Flame size={15} className="mr-2" />Hot</TabsTrigger>
                    <TabsTrigger value="new"><Sparkles size={15} className="mr-2" /> New</TabsTrigger>
                    <TabsTrigger value="top"><ChartColumnIncreasing size={15} className="mr-2" />Top</TabsTrigger>
                </TabsList>

                <TabsContent value="hot">{renderProblems(hotProblems!)}</TabsContent>
                <TabsContent value="new">{renderProblems(newProblems!)}</TabsContent>
                <TabsContent value="top">{renderProblems(topProblems!)}</TabsContent>
            </Tabs>
        </div>
    );
}
