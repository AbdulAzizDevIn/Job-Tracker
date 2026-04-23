import { Briefcase } from "lucide-react";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="border-b  border-gray-200 bg-white">
      <div className="container mx-auto ">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary" >
          <Briefcase />
          Job Tracker
        </Link>
        <div>
            
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
