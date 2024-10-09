import { useState, useEffect } from "react";

const SettingFirst = () => {
  const [filterToggle, setFilterToggle] = useState(false); // Teen Mode
  const [pipMode, setPipMode] = useState(false); // Picture-in-Picture Mode
  const [vibrantMode, setVibrantMode] = useState(false); // Vibrant Mode

  // Save the settings to localStorage
  useEffect(() => {
    const settings = {
      filterToggle,
      pipMode,
      vibrantMode,
    };
    localStorage.setItem("movieAppSettings", JSON.stringify(settings));
  }, [filterToggle, pipMode, vibrantMode]);

  return (
    <div className="profile-div">
      <div className="profile-div-main w-full">
        <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1>Teen Mode</h1>
            <p className="settings-text">
              R18 content will not be displayed once this setting is activated
            </p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filterToggle}
                onChange={() => setFilterToggle((prev) => !prev)}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                  filterToggle
                    ? "peer-checked:bg-[#F54100] hover:peer-checked:bg-[#F54100]"
                    : "peer-checked:bg-[#606060]"
                }`}
              ></div>
            </label>
          </div>
        </div>

        {/* Picture-in-Picture Mode */}
        <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1>Picture-In-picture mode</h1>
            <p className="settings-text">
              Automatically start picture-in-picture mode when leaving the app.
            </p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pipMode}
                onChange={() => setPipMode((prev) => !prev)}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                  pipMode
                    ? "peer-checked:bg-[#F54100] hover:peer-checked:bg-[#F54100]"
                    : "peer-checked:bg-[#606060]"
                }`}
              ></div>
            </label>
          </div>
        </div>

        {/* Vibrant Mode */}
        <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1>Vibrant Mode</h1>
            <p className="settings-text">
              Elevate Your App with Dynamic Motion in Every Interaction
            </p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={vibrantMode}
                onChange={() => setVibrantMode((prev) => !prev)}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                  vibrantMode
                    ? "peer-checked:bg-[#F54100] hover:peer-checked:bg-[#F54100]"
                    : "peer-checked:bg-[#606060]"
                }`}
              ></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingFirst;
