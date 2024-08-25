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
    if (!text) return;
    router.push(`/dashboard/search?q=${text}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center w-full p-4 mx-auto max-w-3xl">
      {/* Logo Section */}
      <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        <Image
          src="/icon_light.svg" // Replace with your logo path
          alt="Logo"
          width={40}
          height={40}
        />
        <span className="text-lg font-semibold">Problem Platform</span>
      </Link>

      {/* Search Section */}
      <div className="flex items-center space-x-2 w-full sm:flex-grow sm:ml-4 order-3 sm:order-2 mt-4 sm:mt-0">
        <Input
          value={text}
          placeholder="Search problems..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full sm:flex-grow"
        />
        <Button variant="ghost" aria-label="Search" onClick={handleSearch}>
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Button>
      </div>

      {/* User Actions Section */}
      <div className="flex items-center space-x-3 order-2 sm:order-3 sm:ml-auto flex-shrink-0 mt-4 sm:mt-0">
        {auth ? (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={img} alt={name} />
              <AvatarFallback className="bg-gray-500 text-white">{name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-800 font-semibold hidden sm:block">{name}</span>
            <SignOutButton />
          </div>
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
