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
import ClerkFetchUser from "@/middleware/clerk-fetch-user";

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
const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];
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
