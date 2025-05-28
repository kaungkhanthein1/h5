import { useEffect } from "react";
import Navbar from "./components/Navbar";
import "./social.css";
import { useDispatch } from "react-redux";
import { setShowingDetail } from "../../features/login/ModelSlice";

const Social = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setShowingDetail(false))
  },[])
  return (
    <div className="text-white">
      <Navbar />
    </div>
  );
};

export default Social;
