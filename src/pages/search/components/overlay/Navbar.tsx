import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setHistoryData } from "../../slice/HistorySlice";
import { useLazyGetAutocompleteQuery } from "../../services/searchApi";

const Navbar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Store autocomplete suggestions
  const [isFocused, setIsFocused] = useState(false); // Manage input focus
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // State to track header visibility

  const [triggerAutocomplete, { data: autocompleteData }] =
    useLazyGetAutocompleteQuery(); // Lazy query for autocomplete

  useEffect(() => {
    if (query.trim()) {
      // Trigger the autocomplete API when query changes
      const timer = setTimeout(() => {
        triggerAutocomplete({ keyword: query });
      }, 300); // Add debounce for 300ms to avoid too many calls
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]); // Clear suggestions if the query is empty
    }
  }, [query, triggerAutocomplete]);

  useEffect(() => {
    if (autocompleteData) {
      setSuggestions(autocompleteData.data); // Set autocomplete suggestions when data is received
    }
  }, [autocompleteData]);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion); // Set the clicked suggestion as the query
    setSuggestions([]); // Clear suggestions
    if (suggestion.trim()) {
      dispatch(setHistoryData({ data: suggestion.trim() }));
      navigate(`/search?query=${encodeURIComponent(suggestion.trim())}`);
    }
  };

  const handleRedirect = (event: any) => {
    event.preventDefault();

    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 68) {
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
        // className={`flex gap-4 w-full py-1 px-3 input-bg-overlay z-[9999]  fixed items-center justify-between transition-all duration-300 ${
        //   isHeaderVisible ? "top-0" : "-top-[135px]"
        // }`}
        className="flex gap-4 w-full py-1 px-3 input-bg-overlay z-[9999]  fixed items-center justify-between transition-all duration-300 top-0"
      >
        <form onSubmit={handleSubmit} className="w-full py-3 pt-3  ">
          <div className="absolute left-6 top-[22px]">
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
              onChange={(e) => setQuery(e.target.value)} // Update the query state on input change
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicks on suggestions
              style={{ fontSize: "16px" }} // Ensure font size is 16px or higher to prevent zoom
            />
          </div>
        </form>
        <div className="w-[40px]">
          <button className="search-btn" onClick={handleRedirect}>
            取消
          </button>
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
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
