"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-6 flex justify-between items-center">
        {/* Logo Navigation Menu */}
        <NavigationMenu className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/icon_light.svg" // Replace with your logo path
              alt="Logo"
              width={40}
              height={40}
            />
            <span className="ml-2 text-lg font-semibold">Problem Platform</span>
          </Link>
        </NavigationMenu>
  
        {/* Hamburger Icon for Mobile */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
  
        {/* Buttons Navigation Menu */}
        <NavigationMenu
          className={`${
            isOpen ? "block" : "hidden"
          } sm:flex flex-col sm:flex-row absolute sm:static top-16 right-0 w-full sm:w-auto bg-white sm:bg-transparent sm:p-0 p-4 sm:mt-0 mt-4 sm:space-y-0 space-y-2`}
        >
          <NavigationMenuList className="flex sm:flex-row flex-col items-center sm:space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink href="/dashboard" className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/#features" className={navigationMenuTriggerStyle()}>Features</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href="/sign-in" className={navigationMenuTriggerStyle()}>Login</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
}
