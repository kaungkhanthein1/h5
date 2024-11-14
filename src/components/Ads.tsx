import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Ads = ({ adsData, setAdsData }: any) => {
  // const [adsData, setAdsData] = useState<any>([]);

  const getData = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/advert/config`
    );
    // console.log(data?.data, "ads");
    const convertedData = Object.entries(data?.data).map(
      ([key, value]: any) => {
        // You can process the key and value here as needed
        return { key, ...value };
      }
    );
    const finalData = convertedData?.filter((item: any) => item.data);
    setAdsData(finalData);
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(adsData);

  console.log(adsData);
  return (
    <div className="max-md:px-3 px-10">
      <div className="grid grid-cols-5 justify-between gap-2">
        {adsData?.map((item: any) => (
          <Link to={item?.data?.url} key={item?.data?.url}>
            <img
              src={item?.data?.image}
              className={`w-[52px] h-[52px] object-cover rounded-[4px] mx-auto`}
              alt=""
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Ads;
