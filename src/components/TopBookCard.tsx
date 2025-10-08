import React from "react";

interface Props {
  position: number;
  imageUrl: string;
  title: string;
}

const TopBookCard: React.FC<Props> = ({ position, imageUrl, title }) => {
  return (
    <div className="relative flex flex-col items-center justify-start w-[220px] h-[320px] shrink-0">

      <span className="absolute -left-4 top-6 font-extrabold text-[#5C17A6] text-[7rem] leading-[1] z-[4] select-none">
  {position}
</span>


      <div className="relative z-[2] rounded-2xl overflow-hidden shadow-md w-[190px] h-[280px] bg-white">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full rounded-2xl"
        />

      </div>
    </div>
  );
};

export default TopBookCard;

