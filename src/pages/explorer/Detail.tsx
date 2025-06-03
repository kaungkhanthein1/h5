import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MovieCard from "../../components/home/MovieCard";
import backArrow from "../../assets/back.svg";
import Loader from "../search/components/Loader";
import NewAds from "../../components/NewAds";
import { convertToSecureUrl } from "../../services/newEncryption";

const Detail = () => {
  const [details, setDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const settings = JSON.parse(localStorage.getItem("movieAppSettings") || "{}");

  // Set the X-Client-Setting header dynamically
  const headers = {
    "X-Client-Setting": JSON.stringify({
      "pure-mode": settings.filterToggle ? 1 : 0,
    }),
  };

  const getDetails = async () => {
    setIsLoading(true);
    const res = await fetch(
      convertToSecureUrl(`${process.env.REACT_APP_API_URL}/movie/topic/${id}`),
      { headers }
    );
    const data = await res.json();
    setDetails(data?.data);
    setIsLoading(false);
  };
  useEffect(() => {
    getDetails();
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen bg-background">
          <Loader />
        </div>
      ) : (
        <div className="bg-background text-white pb-32 pt-14">
          <div className="relative">
            <img
              src={details?.cover}
              alt=""
              className="w-full h-auto object-cover"
            />
            <div className=" bg-gradient-to-t from-black via-black/5 to-transparent absolute  bottom-0 py-1 w-full">
              <p className="text-[16px] font-semibold px-2">{details?.name}</p>
            </div>
            <div className="absolute top-4 left-4">
              <img
                onClick={() => navigate(-1)}
                src={backArrow}
                alt=""
                className="cursor-pointer"
              />
            </div>
          </div>
          <p className="px-3 text-[12px] text-[#aaa] my-3">
            {details?.description}
          </p>
          <NewAds section="topic_movies_top" />
          <p className="px-3 text-[12px] mt-2 mb-3">
            Include {details?.movies?.length} Films
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:gird-cols-8 gap-3 px-3">
            {details?.movies?.map((movie: any) => (
              <Link
                key={movie}
                to={`/player/${movie.id}`}
                className="mx-auto w-full"
              >
                <MovieCard movie={movie} height={""} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Detail;
