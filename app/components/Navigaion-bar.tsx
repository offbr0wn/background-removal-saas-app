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
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold">RB</span>
        </div>
        <span className="text-white text-xl font-bold">RemoveBG</span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item, index) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            {item.name}
          </Link>
        ))}
      </div>
      {/* Feature for when app starts to gain more traction  */}
      {/* <div className="flex items-center space-x-4">
        <Button variant="ghost" className="text-gray-300 hover:text-white">
          Log in
        </Button>
        <Button className="bg-blue-900 hover:bg-blue-700 text-white">Sign up</Button>
      </div> */}
    </nav>
  );
}
