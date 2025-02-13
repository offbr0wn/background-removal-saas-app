import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  return (
    <nav className="flex items-center justify-between">
      <Link href="/">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold">RB</span>
          </div>
          <span className="text-white text-xl font-bold">RemoveBG</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item, index) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-white/70 hover:text-white text-lg transition-colors cursor-pointer"
          >
            {item.name}
          </Link>
        ))}
      </div>
      {/* Feature for when app starts to gain more traction  */}
      <div className="flex items-center space-x-4 ">
        <Button variant="ghost" className="text-gray-300 hover:text-white" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button className="bg-blue-700 hover:bg-blue-700 text-white" asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    </nav>
  );
}
