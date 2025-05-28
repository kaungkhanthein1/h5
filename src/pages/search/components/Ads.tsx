import React from "react";
import { Link } from "react-router-dom";

const Ads = ({ advert }: { advert: any }) => {
  return (
    <div className="px-3">
      <Link className="ads" to={advert?.url}>
        <img src={advert?.image} alt="" className="w-full" />
      </Link>
    </div>
  );
};

export default Ads;
