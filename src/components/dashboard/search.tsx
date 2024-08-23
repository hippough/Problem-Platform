'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { SignOutButton } from '../sign-out-button';
import Link from 'next/link';
import Image from "next/image";

const Searchbar = ({ search }: { search?: string }) => {
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
    <div className="flex w-full items-center p-4 mx-auto justify-between max-w-3xl">
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
        <SignOutButton />
      </div>
    </div>
  );
};

export default Searchbar;
