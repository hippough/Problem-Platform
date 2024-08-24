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


export default function Navbar() {
    return (
      <div className="container mx-auto px-12 my-6 flex justify-between items-center">
        {/* Logo Navigation Menu */}
        <NavigationMenu className="flex flex-shrink-0 items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/icon_light.svg" // Replace with your logo path
              alt="Logo"
              width={60}
              height={60}
            />
            <span className="text-xl font-semibold">Problem Platform</span>
          </Link>
          
        </NavigationMenu>
  
        {/* Buttons Navigation Menu */}
        <NavigationMenu className="flex">
          <NavigationMenuList className="flex">
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


  