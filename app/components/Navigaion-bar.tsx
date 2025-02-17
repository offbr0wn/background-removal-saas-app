import { Button } from "@/components/ui/button";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { MobileNav } from "./ui/mobile-nav";
import {
  SignedInComponent,
  SignedOutComponent,
} from "@/middleware/clerk-component-type";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useSession,
} from "@clerk/nextjs";
import { ClerkFetchUser } from "@/api/helpers/clerk-fetch-user";

type UserType = {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileImage: string | null;
} | null;
export type NavProps = {
  user: UserType | null;
  userId: string | null;
} | null;

const navItems = [
  {
    name: "Features",
    href: "/features",
  },
  {
    name: "Examples",
    href: "/examples",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
];

export function NavigationBar() {
  const [usersFetched, setUsersFetched] = useState<NavProps | null>(null);
  const { isSignedIn } = useSession();

  useEffect(() => {
    const fetchClerkUsers = async () => {
      const usersFetches = await ClerkFetchUser();
      setUsersFetched(usersFetches);
    };
    fetchClerkUsers();
  }, [isSignedIn]);

  return (
    <nav className="flex items-center justify-between">
      <Link href="/">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold">RB</span>
          </div>
          <span className="text-white text-xl font-bold">Remove</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-white/70 hover:text-white text-lg transition-colors cursor-pointer"
          >
            {item.name}
          </Link>
        ))}
        <div className="flex items-center space-x-4 ">
          {/* Clerk Auth Sign in / Sign out */}
          <h2 className="text-white font-semibold ">
            {usersFetched?.user?.firstName}
          </h2>
          <SignedOutComponent>
            <SignInButton>
              <Button variant="ghost" className="text-white " asChild>
                <Link href="/login">Log in</Link>
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button
                className="bg-blue-700 hover:bg-blue-700 text-white"
                asChild
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </SignUpButton>
          </SignedOutComponent>

          <SignedInComponent>
            <UserButton />
          </SignedInComponent>
        </div>
      </div>
      {/* Feature for when app starts to gain more traction  */}

      {/* Mobile Navigaiton */}
      <div className="md:hidden">
        <MobileNav usersFetched={usersFetched} />
      </div>
    </nav>
  );
}
