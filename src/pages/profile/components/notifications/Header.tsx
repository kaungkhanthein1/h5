import { Link } from "react-router-dom";

const Header = ({ categories, onCategoryClick, selectedCategory }: any) => {
  return (
    <div className="flex gap-10 noti-header items-center p-5">
      <Link to="/profile">
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
      </Link>

      {categories.map((category: any) => (
        <div
          key={category.id}
          className={selectedCategory === category.id ? "active" : ""}
          onClick={() => onCategoryClick(category.id)}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default Header;
