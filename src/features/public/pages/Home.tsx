import { MapPin, Clock, DollarSign, Search, Globe, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <div className="w-full h-24 px-2 py-2.5 bg-neutral-950 border-b border-neutral-400 backdrop-blur-[100px] flex justify-center items-center">
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

      {/* Main Content */}
      <div className="flex flex-col items-center bg-neutral-950 justify-center min-h-screen space-y-16 px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center space-y-8">
          {/* Title */}
          <div className="w-[560px] flex flex-col justify-center items-center">
            <div className="self-stretch text-center text-white text-6xl font-bold font-inter">Discover Amazing</div>
            <div className="self-stretch text-center text-green-700 text-6xl font-bold font-inter">Tours & Experiences</div>
          </div>

          {/* Subtitle */}
          <div className="w-[861px] h-14 relative">
            <div className="w-[861px] text-center text-zinc-400 text-2xl font-medium font-poppins">
              Find unique local experiences, guided tours, and adventures around the world. Book with confidence and create unforgettable memories.
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="w-[882px] h-96 p-6 bg-neutral-900 rounded-[10px] flex flex-col justify-center items-center gap-11">
          {/* Search Form */}
          <div className="w-[826px] flex justify-center items-end gap-6">
            {/* Where to? */}
            <div className="w-72 flex flex-col justify-start items-start gap-2.5">
              <div className="self-stretch text-white text-2xl font-medium font-inter">Where to?</div>
              <div className="self-stretch p-2.5 bg-stone-900 rounded-[10px] flex justify-center items-center gap-3.5 cursor-pointer hover:bg-stone-800 transition-colors">
                <MapPin className="w-6 h-6 text-green-700" />
                <div className="text-zinc-400 text-xl font-light font-poppins">Where do you want to go?</div>
              </div>
            </div>

            {/* Duration */}
            <div className="w-32 flex flex-col justify-start items-start gap-2.5">
              <div className="self-stretch text-white text-2xl font-medium font-inter">Duration?</div>
              <div className="self-stretch p-2.5 bg-stone-900 rounded-[10px] flex justify-center items-center gap-3.5 cursor-pointer hover:bg-stone-800 transition-colors">
                <Clock className="w-6 h-6 text-green-700" />
                <div className="text-zinc-400 text-xl font-light font-poppins">1 hour?</div>
              </div>
            </div>

            {/* Price */}
            <div className="w-32 flex flex-col justify-start items-start gap-2.5">
              <div className="self-stretch text-white text-2xl font-medium font-inter">Price?</div>
              <div className="self-stretch p-2.5 bg-stone-900 rounded-[10px] flex justify-center items-center gap-3.5 cursor-pointer hover:bg-stone-800 transition-colors">
                <DollarSign className="w-6 h-6 text-green-700" />
                <div className="text-zinc-400 text-xl font-light font-poppins">5 dolar?</div>
              </div>
            </div>

            {/* Search Button */}
            <button className="px-3.5 py-2.5 bg-green-700 rounded-[10px] flex justify-start items-center gap-2.5 hover:bg-green-600 transition-colors">
              <Search className="w-6 h-6 text-white" />
              <div className="text-white text-xl font-medium font-poppins">Search Tours</div>
            </button>
          </div>

          {/* Divider */}
          <div className="w-[750px] h-px bg-zinc-400" />

          {/* Popular Destinations */}
          <div className="w-[750px] flex flex-col justify-start items-center gap-7">
            <div className="self-stretch text-center text-zinc-400 text-xl font-medium font-poppins">Popular Destinations</div>
            <div className="self-stretch flex justify-center items-center gap-11 flex-wrap">
              <div className="cursor-pointer hover:text-green-600 transition-colors">
                <div className="text-center text-green-700 text-xl font-medium font-poppins">Guanacaste</div>
              </div>
              <div className="cursor-pointer hover:text-green-600 transition-colors">
                <div className="text-center text-green-700 text-xl font-medium font-poppins">Limon</div>
              </div>
              <div className="cursor-pointer hover:text-green-600 transition-colors">
                <div className="text-center text-green-700 text-xl font-medium font-poppins">Puntarenas</div>
              </div>
              <div className="cursor-pointer hover:text-green-600 transition-colors">
                <div className="text-center text-green-700 text-xl font-medium font-poppins">Monteverde</div>
              </div>
              <div className="cursor-pointer hover:text-green-600 transition-colors">
                <div className="text-center text-green-700 text-xl font-medium font-poppins">Manuel Antonio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="flex justify-center items-center gap-36 flex-wrap">
          <div className="w-40 flex flex-col justify-center items-center gap-2.5">
            <div className="self-stretch text-center text-green-700 text-5xl font-bold font-inter">150+</div>
            <div className="self-stretch text-center text-zinc-400 text-2xl font-medium font-poppins">Tour available</div>
          </div>
          <div className="w-40 flex flex-col justify-center items-center gap-2.5">
            <div className="self-stretch text-center text-green-700 text-5xl font-bold font-inter">25+</div>
            <div className="self-stretch text-center text-zinc-400 text-2xl font-medium font-poppins">Countries</div>
          </div>
          <div className="w-40 flex flex-col justify-center items-center gap-2.5">
            <div className="self-stretch text-center text-green-700 text-5xl font-bold font-inter">200+</div>
            <div className="self-stretch text-center text-zinc-400 text-2xl font-medium font-poppins">Happy hosts</div>
          </div>
          <div className="w-48 flex flex-col justify-center items-center gap-2.5">
            <div className="self-stretch text-center text-green-700 text-5xl font-bold font-inter">500+</div>
            <div className="self-stretch text-center text-zinc-400 text-2xl font-medium font-poppins">Happy Travelers</div>
          </div>
        </div>
      </div>
    </div>
  );
}