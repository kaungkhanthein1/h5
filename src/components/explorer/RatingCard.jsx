import { Link } from "react-router-dom";
import rate from "../../assets/rate.svg";

const RatingCard = ({ movie, index }) => {
  return (
    <div className="flex gap-3 items-center">
      <Link to={`/player/${movie?.id}`} className="relative">
        <img
          src={movie?.cover}
          className="w-[80px] h-[111px] md:w-[160px] md:h-[222px] rounded-md object-cover"
          alt=""
        />
        <div
          className={`absolute top-0 left-0 ${
            (index + 1 == 1 && "rank1-bg") ||
            (index + 1 == 2 && "rank2-bg") ||
            (index + 1 == 3 && "rank3-bg") ||
            "bg-[#00000066]"
          }  rounded-tl-md rounded-br-md text-[12px] flex justify-center items-center text-white w-[25px] h-[21px] font-bold`}
        >
          {index + 1}
        </div>
        <div className="absolute rounded-bl-md rounded-br-md  h-full w-full inset-0 bg-gradient-to-b from-transparent via-black/5 to-black"></div>
        <div className="flex absolute justify-between items-center px-3 bottom-2 w-full text-[12px]">
          <p>{movie?.dynamic}</p>
        </div>
      </Link>
      <div className="flex-1">
        <div className="flex flex-col gap-2 ">
          <div className="flex w-full items-start">
            <h1 className="text-white text-[16px]">{movie?.name}</h1>
            <div className="flex ml-auto">
              {index >= 5 ? (
                <img src={rate} alt="" />
              ) : (
                Array.from({ length: 5 - index }, (_, index) => index).map(
                  (ri) => <img key={ri} src={rate} alt="" />
                )
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <p className="px-2 py-[2px] text-[12px] bg-gray-800 rounded-md">
              {movie?.year}
            </p>
            {movie?.tags?.map((tag) => (
              <p
                className="px-2 py-[2px] text-[12px] bg-gray-800 rounded-md"
                key={tag?.id}
              >
                {tag?.name}
              </p>
            ))}
          </div>
          <p className="text-gray-500 text-[12px]">{movie?.blurb}</p>
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
