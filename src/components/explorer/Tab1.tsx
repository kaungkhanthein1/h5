import { useNavigate } from "react-router-dom"; // Import useNavigate
import MovieCard from "./MovieCard";
import { useGetExploreListQuery } from "../../pages/explorer/services/explorerAPi";

const Tab1 = () => {
  const { data: exploreList } = useGetExploreListQuery();
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle click and navigate to player with movie ID
  const handleMovieClick = (id: string) => {
    navigate(`/player/${id}`); // Navigate to player with movie id as a route parameter
  };

  return (
    <div className="pb-32 min-h-screen pt-5 px-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {exploreList?.data?.list?.map((list: any) => (
          <div
            key={list?.id}
            onClick={() => handleMovieClick(list.id)}
            className="mx-auto"
          >
            <MovieCard movie={list} height={"200px"} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tab1;
