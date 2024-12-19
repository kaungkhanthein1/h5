import short from "../../assets/short.gif";
import "./short.css";

const Short = () => {
  return (
    <div className="flex justify-center items-center h-screen short_main  px-5">
      <div className="short_div p-6 mb-10 rounded-2xl max-w-sm w-full">
        <div className="p-5 rounded-xl mb-4">
          <img src={short} alt="" height={"160px"} />
        </div>
        <div className="text-center p-4 rounded-lg  text-white">
          <h2 className="short_head">短剧刷不停！</h2>
          <p className="short_des mt-2">
            刷短剧，刷出精彩！尽情沉浸在一集接一集的短剧世界中，
            <br />
            随时随地享受高能剧情，快来体验吧！
          </p>
          <div className="flex justify-center items-center mt-4">
            <button className="short_btn">即将上线，敬请期待！</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Short;
