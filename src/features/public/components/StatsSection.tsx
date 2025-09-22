export default function StatsSection() {
  return (
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
  );
}