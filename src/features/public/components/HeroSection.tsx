export default function HeroSection() {
  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Title */}
      <div className="w-[660px] gap-2 flex flex-col justify-center items-center">
        <div className="text-center text-white text-6xl font-bold font-inter">Discover Amazing</div>
        <div className="text-center text-green-700 text-6xl font-bold font-inter">Tours & Experiences</div>
      </div>

      {/* Subtitle */}
      <div className="w-[861px] h-14 relative">
        <div className="w-[861px] text-center text-zinc-400 text-2xl font-medium font-poppins">
          Find unique local experiences, guided tours, and adventures around the world. Book with confidence and create unforgettable memories.
        </div>
      </div>
    </div>
  );
}