import { Globe } from 'lucide-react';
import UserDropdown from './UserDropdown';

export default function Navbar() {
  return (
    <div className="w-full h-24 px-2 py-2.5 bg-black/80 backdrop-blur-xl border-b border-green-700/20 flex justify-center items-center">
      <div className="w-full max-w-7xl flex justify-between items-center px-5">
        
        {/* Logo */}
        <div className="flex justify-center items-center gap-1">
          <div className="text-white text-2xl font-medium font-inter">Become a host</div>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-start items-center">
          <div className="w-9 h-9 relative">
            <Globe className="w-7 h-7 text-green-700 absolute top-1 left-1" />
          </div>
          <div className="text-white text-2xl font-medium font-inter">Tourly</div>
        </div>

        {/* User Actions */}
        <div className="flex justify-start items-center gap-3.5">
          <div className="w-6 h-6 relative cursor-pointer">
            <Globe className="w-6 h-6 relative cursor-pointer" />
          </div>
          <UserDropdown />
        </div>
      </div>
    </div>
  );
}
