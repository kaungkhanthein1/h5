import { useNavigate } from "react-router-dom"; // Import useNavigate
import MovieCard from "./MovieCard";
import { useGetExploreListQuery } from "../../pages/explorer/services/explorerAPi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import FilterMovie from "./FilterMovie";


const Tab1 = () => {
  const dispatch = useDispatch()
  const activeTab = useSelector((state: any) => state.explore.activeTab);
  const sort = useSelector((state: any) => state.explore.sort);
  const classData = useSelector((state: any) => state.explore.class);
  const area = useSelector((state: any) => state.explore.area);
  const year = useSelector((state: any) => state.explore.year);
  const { data: exploreList, refetch } = useGetExploreListQuery({
    id: activeTab,
    sort,
    classData,
    area,
    year,
  });
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle click and navigate to player with movie ID
  const handleMovieClick = (id: string) => {
    navigate(`/player/${id}`); // Navigate to player with movie id as a route parameter
  };

  // useEffect(() => {

  // })

  useEffect(() => {
    refetch();
  }, [sort, classData, activeTab, area, year]);

  return (
    <div className="pb-32 min-h-screen px-3">
      <FilterMovie />
    </div>
  );
};

export default Tab1;
