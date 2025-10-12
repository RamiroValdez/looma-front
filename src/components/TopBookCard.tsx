import React from "react";

interface Props {
  position: number;
  cover: string;
  title: string;
}

const TopBookCard: React.FC<Props> = ({ position, cover, title }) => {
  return (
    <div className="relative flex flex-col items-center justify-start w-[190px] h-[240px] shrink-0">

      <span
        className="absolute font-extrabold text-transparent leading-[1] z-[1] select-none overflow-y-hidden"
        style={{
          fontSize: "15rem",
          top: "-2rem",
          left: "-4rem",
          WebkitTextStroke: "4px #5C17A6", 
          opacity: 0.5, 
        }}
      >
        {position}
      </span>

      <div className="relative z-[2] rounded-2xl overflow-hidden shadow-md w-[170px] h-[260px] bg-white">
        <img
          src={cover}
          alt={title}
          className="object-cover w-full h-full rounded-2xl"
        />
      </div>
    </div>
  );
};

export default TopBookCard;

