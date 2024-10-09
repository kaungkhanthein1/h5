import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MovieCard from "../../components/explorer/MovieCard";
import backArrow from "../../assets/back.svg";
import Loader from "../search/components/Loader";

const Detail = () => {
  const [details, setDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const getDetails = async () => {
    setIsLoading(true);
    const res = await fetch(
      `https://cc3e497d.qdhgtch.com:2345/api/v1/movie/topic/${id}`
    );
    const data = await res.json();
    setDetails(data?.data);
    setIsLoading(false);
    console.log(data?.data, "details data");
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
        <div className="bg-background text-white pb-32">
          <div className="relative">
            <img
              src={details?.cover}
              alt=""
              className="w-full h-auto object-cover"
            />
            <h1 className="text-[16px] font-semibold absolute bottom-2 left-2">
              {details?.name}
            </h1>
            <div className="absolute top-2 left-2">
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
          <p className="px-3 text-[12px] mb-3">
            Include {details?.movies?.length} Films
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:gird-cols-8 gap-3 px-3">
            {details?.movies?.map((movie: any) => (
              <Link key={movie} to={`/player/${movie.id}`} className="mx-auto">
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
