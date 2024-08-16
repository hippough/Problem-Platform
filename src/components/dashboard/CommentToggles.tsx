"use client"

import { FC, useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"
import { ThumbsUp } from "lucide-react"
import { ThumbsDown } from "lucide-react"
import { Toaster, toast } from "sonner"
import { ObjectId } from "mongodb"

interface toggleNums{
    likes: number;
    dislikes: number;

    commentId: string;
    state: number


}




const Toggles: FC<toggleNums> = ({ likes, dislikes, commentId, state }) => {



    let liked = false;
    let disliked = false;

    let defaultValue;

    if(state == 1){
        defaultValue = "like"
        likes = likes - 1;
    } else if(state == 2){
        defaultValue = "dislike"
        dislikes = dislikes - 1;
    } else {
        defaultValue = undefined;
    }
    
    const[l, setL] = useState(likes + (state == 1 ? 1 : 0));
    const[d, setD] = useState(dislikes + (state == 2 ? 1 : 0));

    const [value, setValue] = useState<string | undefined>(undefined);

    

    const handleValueChange = async (newValue: string | undefined) => {
        // Allow deselecting the current value
        
        setValue(newValue);
        if(newValue === "like"){
            setL(likes+1);
            setD(dislikes);
            

            try {
                const response = await fetch('/api/comment/like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ commentId }),
                });
    
                if (response.ok) {
                    // Assuming response.json() returns { success: true }
                    const data = await response.json();
                    if (data.message === 'User already liked this problem') {
                        toast.info('You have already liked this problem.');
                        setL(likes);
                        setD(dislikes);
                    } else if (data.success) {
                        toast.success('Liked!');
                    }
                } else {
                    const data = await response.json();
                    if (data.message === 'Unauthorized') {
                        toast.error('You need to log in to like this.');
                    } else if (data.message === 'Problem not found') {
                        toast.error('Problem not found.');
                    } else {
                        toast.error('Failed to like.');
                    }
                }
                
            } catch (error) {
                toast.error('An error occurred. Please try again.');
            }

        } else if(newValue === "dislike"){
            setL(likes);
            setD(dislikes+1);

            try {
                const response = await fetch('/api/comment/dislike', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ commentId }),
                });
    
                if (response.ok) {
                    // Assuming response.json() returns { success: true }
                    const data = await response.json();
                    if (data.message === 'User already disliked this problem') {
                        toast.info('You have already disliked this problem.');
                        setL(likes);
                        setD(dislikes);
                    } else if (data.success) {
                        toast.success('Disliked!');
                    }
                } else {
                    const data = await response.json();
                    if (data.message === 'Unauthorized') {
                        toast.error('You need to log in to dislike this.');
                    } else if (data.message === 'Problem not found') {
                        toast.error('Problem not found.');
                    } else {
                        toast.error('Failed to dislike.');
                    }
                }
                
            } catch (error) {
                toast.error('An error occurred. Please try again.');
            }
        } else {
            setL(likes);
            setD(dislikes);

            try {
                const response = await fetch('/api/comment/undo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ commentId }),
                });

                

                if(response.ok){
                    toast.success("Removed.");
                } else{
                    toast.error("Problem not found");
                }
            } catch (error) {
                toast.error('An error occurred. Please try again.');
            }
        }
        
    }

    return (
        
        <ToggleGroup className="flex-col" type="single" value={value} onValueChange={handleValueChange} defaultValue={defaultValue}>
            <ToggleGroupItem value="like" size="sm" className="text-gray-500">
                <ThumbsUp size={20} />
                <span className="ml-1">{l}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="dislike" size="sm" className="text-gray-500">
                <ThumbsDown size={20} />
                <span className="ml-1">{d}</span>
            </ToggleGroupItem>
        
        </ToggleGroup>
        
    )
}
export default Toggles;