import Main from "./components/info/Main";
import Navbar from "./components/info/Navbar";
import "./profile.css";

const Info = () => {
  return (
    <div>
      <div className="fixed-bg"></div>
      <div className="text-white">
        <Navbar />
      </div>
      <div>
        <Main />
      </div>
    </div>
  );
};

export default Info;
