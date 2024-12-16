import React, { useState, useEffect } from "react";
import {
  useLazyGetAutocompleteQuery, // Lazy query for autocomplete suggestions
} from "../services/searchApi"; // Adjust the import based on your API setup
import { Link } from "react-router-dom";
import Filter from "./Filter";

interface NavbarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void; // Function to trigger search
  setresActive: any;
  setsortActive: any;
  settypeActive: any;
  res_type: any;
  sort: any;
  type: any;
  movies: any;
  resActive: any;
  sortActive: any;
  typeActive: any;
}

const Navbar: React.FC<NavbarProps> = ({
  query,
  setQuery,
  onSearch,
  setresActive,
  setsortActive,
  settypeActive,
  res_type,
  sort,
  type,
  movies,
  resActive,
  sortActive,
  typeActive,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]); // Store autocomplete suggestions
  const [isFocused, setIsFocused] = useState(false); // Manage input focus
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // State to track header visibility
  const [triggerAutocomplete, { data: autocompleteData }] =
    useLazyGetAutocompleteQuery(); // Lazy query for autocomplete

  // Fetch autocomplete suggestions when the query changes
  useEffect(() => {
    if (query.trim()) {
      const timer = setTimeout(() => {
        triggerAutocomplete({ keyword: query }); // Fetch autocomplete suggestions
      }, 300); // Debounce to avoid too many API calls
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]); // Clear suggestions if query is empty
    }
  }, [query, triggerAutocomplete]);

  // Update suggestions when autocomplete data arrives
  useEffect(() => {
    if (autocompleteData) {
      setSuggestions(autocompleteData.data);
    }
  }, [autocompleteData]);

  // Handle form submit (trigger search)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSuggestions([]); // Clear suggestions after search
      onSearch(); // Trigger the search
    }
  };

  // Handle suggestion click (trigger search with selected suggestion)
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion); // Set the clicked suggestion as the query
    setSuggestions([]); // Clear suggestions after click
    onSearch();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down, hide the header
        setIsHeaderVisible(false);
      } else if (window.scrollY < lastScrollY) {
        // Scrolling up, show the header
        setIsHeaderVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className="relative">
      <div
        // className={`fixed input-bg w-full z-[9999] pb-3  transition-all duration-300 ${
        //   isHeaderVisible ? "top-0" : "-top-[135px]"
        // }`}
        className="fixed input-bg w-full z-[9999] pb-3  transition-all duration-300 top-0"
      >
        <div className="flex gap-4 w-full py-3 pt-5 px-3 z-10  items-center justify-between">
          <form onSubmit={handleSearch} className="w-full">
            <div className="absolute top-[27px] left-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="22"
                viewBox="0 0 21 22"
                fill="none"
              >
                <path
                  d="M14.0482 14.0737L17 17.0248L16.0248 18L13.0737 15.0482C11.9757 15.9285 10.6099 16.4072 9.20262 16.4052C5.77877 16.4052 3 13.6265 3 10.2026C3 6.77877 5.77877 4 9.20262 4C12.6265 4 15.4052 6.77877 15.4052 10.2026C15.4072 11.6099 14.9285 12.9757 14.0482 14.0737ZM12.6657 13.5624C13.5404 12.6629 14.0289 11.4572 14.0269 10.2026C14.0269 7.53687 11.8677 5.37836 9.20262 5.37836C6.53687 5.37836 4.37836 7.53687 4.37836 10.2026C4.37836 12.8677 6.53687 15.0269 9.20262 15.0269C10.4572 15.0289 11.6629 14.5404 12.5624 13.6657L12.6657 13.5624Z"
                  fill="white"
                  fillOpacity="0.6"
                />
              </svg>
            </div>

            <div className="w-full">
              <input
                value={query}
                type="text"
                className="search-input"
                placeholder="觉醒年代"
                onChange={(e) => setQuery(e.target.value)} // Update the query state
                onFocus={() => setIsFocused(true)} // Show suggestions on focus
                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay for clicks on suggestions
                style={{ fontSize: "16px" }} // Ensure font size is 16px or higher to prevent zoom
              />
            </div>
          </form>
          <div className="w-[40px]">
            <Link to={"/search_overlay"} className="search-btn">
              搜索
            </Link>
          </div>
        </div>

        {isFocused && suggestions.length > 0 && (
          <ul className="fixed top-[60px] left-0 pt-[20px] pb-[80px] h-screen w-full bg-[#161616] text-white z-50 overflow-y-auto">
            {suggestions.map((suggestion: any, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion.name)}
                className="cursor-pointer ml-[20px] p-2 active:text-[#f54100]"
                dangerouslySetInnerHTML={{
                  __html: suggestion?.highlight.replace(
                    /<em>(.*?)<\/em>/g,
                    '<span style="color: #F54100;">$1</span>'
                  ),
                }} // Render highlighted text
              />
            ))}
          </ul>
        )}
        <Filter
          movies={movies}
          res_type={res_type}
          sort={sort}
          type={type}
          resActive={resActive}
          setresActive={setresActive}
          sortActive={sortActive}
          setsortActive={setsortActive}
          typeActive={typeActive}
          settypeActive={settypeActive}
        />
      </div>
    </div>
  );
};

export default Navbar;
