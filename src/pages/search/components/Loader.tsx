import "../search.css";

const Loader = () => {
  return (
    <div className="relative">
      <div className="w-5 h-5 border-[3px] border-t-orange-600 border-r-orange-500 border-b-transparent border-l-transparent rounded-full spinner"></div>
    </div>
  );
};

export default Loader;
