import "./LoadingStyle.css";
import Logo from "../../../assets/loadingLogo.png";

const PlayerLoading: React.FC<any> = ({onBack}) => {
  return (
    <>
      <div className="loading-back flex-row pt-20">
      <div className="absolute top-4 left-4 z-50">
      <button className="text-white text-2xl" onClick={onBack}>
        <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7.828 11H20V13H7.828L13.192 18.364L11.778 19.778L4 12L11.778 4.22198L13.192 5.63598L7.828 11Z"
                fill="white"
              />
            </svg>
      </button>
    </div>
        <img src={Logo} alt="" className="m-auto h-12"/>
        <div className="animated-line"></div>
        <div className="text">精彩即将开始...</div>
      </div>
    </>
  );
};

export default PlayerLoading;
