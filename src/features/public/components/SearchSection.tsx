import { MapPin, Clock, DollarSign, Search } from 'lucide-react';

export default function SearchSection() {
  return (
    <div className="w-[882px] h-96 p-6 bg-gradient-to-br from-neutral-900/90 via-neutral-800/80 to-green-900/30 backdrop-blur-sm border border-green-700/20 rounded-[10px] flex flex-col justify-center items-center gap-11 shadow-2xl shadow-green-900/20">
      {/* Search Form */}
      <div className="w-[826px] flex justify-center items-end gap-6">
        {/* Where to? */}
        <div className="w-72 flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch text-white text-2xl font-medium font-inter">Where to?</div>
          <div className="self-stretch p-2.5 bg-gradient-to-r from-stone-900 to-stone-800/80 border border-green-700/10 rounded-[10px] flex justify-center items-center gap-3.5 cursor-pointer hover:from-stone-800 hover:to-stone-700/80 hover:border-green-700/30 transition-all duration-300">
            <MapPin className="w-6 h-6 text-green-700" />
            <div className="text-zinc-400 text-xl font-light font-poppins">Where do you want to go?</div>
          </div>
        </div>

        {/* Duration */}
        <div className="w-32 flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch text-white text-2xl font-medium font-inter">Duration?</div>
          <div className="self-stretch p-2.5 bg-gradient-to-r from-stone-900 to-stone-800/80 border border-green-700/10 rounded-[10px] flex justify-center items-center gap-3.5 cursor-pointer hover:from-stone-800 hover:to-stone-700/80 hover:border-green-700/30 transition-all duration-300">
            <Clock className="w-6 h-6 text-green-700" />
            <div className="text-zinc-400 text-xl font-light font-poppins">1 hour?</div>
          </div>
        </div>

        {/* Price */}
        <div className="w-32 flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch text-white text-2xl font-medium font-inter">Price?</div>
          <div className="self-stretch p-2.5 bg-gradient-to-r from-stone-900 to-stone-800/80 border border-green-700/10 rounded-[10px] flex justify-center items-center gap-3.5 cursor-pointer hover:from-stone-800 hover:to-stone-700/80 hover:border-green-700/30 transition-all duration-300">
            <DollarSign className="w-6 h-6 text-green-700" />
            <div className="text-zinc-400 text-xl font-light font-poppins">5 dolar?</div>
          </div>
        </div>

        {/* Search Button */}
        <button className="px-3.5 py-2.5 bg-gradient-to-r from-green-700 via-green-600 to-green-700 hover:from-green-600 hover:via-green-500 hover:to-green-600 rounded-[10px] flex justify-start items-center gap-2.5 transition-all duration-300 shadow-lg shadow-green-700/30 hover:shadow-green-600/40 transform hover:scale-105">
          <Search className="w-6 h-6 text-white" />
          <div className="text-white text-xl font-medium font-poppins">Search Tours</div>
        </button>
      </div>

      {/* Divider */}
      <div className="w-[750px] h-px bg-gradient-to-r from-transparent via-green-700/50 to-transparent" />

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
  );
}