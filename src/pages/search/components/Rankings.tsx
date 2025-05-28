import { useGetSearchRankingQuery } from "../services/searchApi";
import Rank from "./Rank";

const Rankings = ({
  ranks,
  isFetching,
  isLoading,
}: {
  ranks: any;
  isFetching: any;
  isLoading: any;
}) => {
  if (isFetching || isLoading) {
    return (
      <></>
      // <div className="flex justify-center items-center h-[300px]">
      //   <h1 className="text-center text-white ">Loading...</h1>
      // </div>
    );
  }

  return (
    <div className="px-3 mt-5 mb-5">
      <div className="flex gap-3 container_scroll">
        {ranks?.map((rank: any, index: any) => (
          <Rank data={rank} key={index} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Rankings;
