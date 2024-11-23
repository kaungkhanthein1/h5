const Versions = () => {
  return (
    <div className="profile-div">
      <div className="profile-div-main w-full">
        <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1 className="versions-title">当前版本</h1>
          </div>
          <div>
            <h1 className="versions-text">V 1.0.0</h1>
          </div>
        </div>
        {/* <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1 className="versions-title">清楚缓存</h1>
          </div>
          <div>
            <h1 className="versions-text">35.8 Mb</h1>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Versions;
