import React from "react";
import {useNavigate} from "react-router-dom";

interface Props {
  position: number;
  cover: string;
  title: string;
  idWork: number;
}

const TopBookCard: React.FC<Props> = ({ position, cover, title, idWork }) => {

    const navigation = useNavigate();

    const handleCoverNavigation = () => {
        navigation("/work/" + idWork);
    }

    return (
    <div className="relative flex flex-col items-center justify-start w-[190px] h-[240px] shrink-0" onClick={handleCoverNavigation}>

      <span
        className="absolute font-extrabold text-transparent leading-[1] z-[1] select-none overflow-y-hidden"
        style={{
          fontSize: "16rem",
          top: "-2rem",
          left: "-4.5rem",
          WebkitTextStroke: "4px #5C17A6", 
          opacity: 0.5, 
        }}
      >
        {position}
      </span>

      <div className="relative z-[2] rounded-2xl overflow-hidden shadow-md w-[170px] h-[260px] bg-white hover:scale-105 transition-transform duration-300 cursor-pointer">
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

