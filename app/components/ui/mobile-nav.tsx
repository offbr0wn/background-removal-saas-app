"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { SignedInComponent, SignedOutComponent } from "@/middleware/clerk-component-type";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";


const menuItems = [
  {
    title: "Features",
    items: [{ title: "Background Removal", href: "/features" }],
  },
  {
    title: "Pricing",
    items: [
      { title: "Free Tier", href: "/pricing#Basic" },
      { title: "Pro Tier", href: "/pricing#Pro" },
      { title: "Enterprise Tier", href: "/pricing#Enterprise" },
    ],
  },

  {
    title: "Examples",
    items: [{ title: "Gallery", href: "/examples" }],
  },
];

export function MobileNav({ usersFetched }: any) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };
  return (
    <div className="relative md:hidden">
      <div className=" flex items-center ">
        <SignedInComponent>
          <UserButton />
        </SignedInComponent>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50"
        >
          <Menu className=" text-white" size={40} />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-[50vw] z-50  bg-gray-900/40 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-800"
          >
            <div className="p-4">
              {menuItems?.map((section, index) => (
                <Collapsible
                  key={section.title}
                  open={openSections.includes(section.title)}
                  onOpenChange={() => toggleSection(section.title)}
                  className={index !== 0 ? "mt-4" : ""}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors">
                    {section.title}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openSections.includes(section.title) ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <div className="pl-4 space-y-1">
                      {section.items?.map((item) => (
                        <Link
                          key={item?.title}
                          href={item?.href}
                          className="block px-2 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {item?.title}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
              {!usersFetched?.userId && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="space-y-3">
                    <SignedOutComponent>
                      <SignInButton>
                        <Button
                          variant="outline"
                          className="w-full text-white border-white/20 hover:bg-white/10 dark"
                        >
                          <Link href="/login">Log in</Link>
                        </Button>
                      </SignInButton>
                      <SignUpButton>
                        <Button className="w-full bg-white hover:bg-white/90 text-black">
                          <Link href="/signup">Sign up</Link>
                        </Button>
                      </SignUpButton>
                    </SignedOutComponent>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
