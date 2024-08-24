'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { SignOutButton } from '../sign-out-button';
import Link from 'next/link';
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Searchbar = ({ search, name, img, auth }: { search?: string, name?: string, img: string, auth: boolean }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRender = useRef(true);
  

  const [text, setText] = useState(search);


  const handleSearch = () => {
    if(!text) return;
    
    router.push(`/dashboard/search?q=${text}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  return (
    
    <div className={`flex w-full items-center p-4 mx-auto justify-between max-w-${auth ? 4 : 3}xl`}>
      <Link href="/dashboard" className="flex items-center mr-auto">
        <Image
          src="/icon_light.svg" // Replace with your logo path
          alt="Logo"
          width={60}
          height={60}
        />
        <span className="text-xl font-semibold ml-2">Problem Platform</span>
      </Link>
      <div className="flex items-center space-x-2">
        <Input
          value={text}
          placeholder="Search problems..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          className=""
        />
        <Button variant="ghost" className="" aria-label="Search" onClick={handleSearch}>
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Button>

        {auth ? (
          <>
          <div className="flex items-center space-x-3 bg-gray-200 px-4 py-2 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={img} alt={name} />
              <AvatarFallback className="bg-gray-500 text-white">{name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-800 font-semibold">{name}</span>
          </div>
          <SignOutButton />
        </>
        
          
        ) : (
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        )}
        
        
      </div>
    </div>
  );
};

export default Searchbar;
