import { Globe, User } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="w-full h-24 px-2 py-2.5 bg-black/80 backdrop-blur-xl border-b border-green-700/20 flex justify-center items-center">
      <div className="w-full max-w-7xl flex justify-between items-center px-5">
        {/* Logo */}
        <div className="flex justify-center items-center gap-1">
          <div className="w-9 h-9 relative overflow-hidden">
            <Globe className="w-7 h-7 text-green-700 absolute top-1 left-1" />
          </div>
          <div className="text-white text-2xl font-medium font-inter">Tourly</div>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-start items-center gap-9">
          <div className="text-white text-xl font-normal font-poppins cursor-pointer hover:text-green-700 transition-colors">Tours</div>
          <div className="text-white text-xl font-normal font-poppins cursor-pointer hover:text-green-700 transition-colors">Experiencias</div>
        </div>

        {/* User Actions */}
        <div className="flex justify-start items-center gap-3.5">
          <div className="w-6 h-6 relative overflow-hidden cursor-pointer">
            <Globe className="w-5 h-5 text-white absolute top-0.5 left-0.5" />
          </div>
          <div className="w-6 h-6 relative overflow-hidden cursor-pointer">
            <User className="w-4 h-4 text-white absolute top-1 left-1" />
          </div>
        </div>
      </div>
    </div>
  );
}