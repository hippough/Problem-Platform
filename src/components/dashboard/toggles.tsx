"use client"

import { FC, useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"
import { ThumbsUp } from "lucide-react"
import { ThumbsDown } from "lucide-react"
import { Toaster, toast } from "sonner"
import { ObjectId } from "mongodb"
import { dislike, like, remove } from "@/actions/actions"

interface toggleNums{
    likes: number;
    dislikes: number;

    problemId: string;
    state: number


}

const Toggles: FC<toggleNums> = ({ likes, dislikes, problemId, state }) => {

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
                const response = await like({ problemId });
                if (response) {
                    toast.success("Liked!");
                } else {
                    throw new Error('Failed to like');
                }
                
            } catch (error) {
                toast.error('An error occurred. Please try again.');
            }

        } else if(newValue === "dislike"){
            setL(likes);
            setD(dislikes+1);

            try {
                const response = await dislike({ problemId });
    
                if (response) {
                    toast.success("Disliked!");
                } else {
                    throw new Error('Failed to dislike');
                }
                
            } catch (error) {
                toast.error('An error occurred. Please try again.');
            }
        } else {
            setL(likes);
            setD(dislikes);

            try {
                const response = await remove({ problemId });
                if(response){
                    toast.success("Removed.");
                } else{
                    throw new Error('Failed to remove');
                }
            } catch (error) {
                toast.error('An error occurred. Please try again.');
            }
        }
        
    }

    return (
        
        <ToggleGroup className="flex-col" type="single" value={value} onValueChange={handleValueChange} defaultValue={defaultValue} >
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