import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserNameProps {}

const UserName: React.FC<UserNameProps> = ({}) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isFocusedName, setIsFocusedName] = useState(false);

  const validateName = (name: string) => {
    const lengthValid = name.length >= 6 && name.length <= 25;
    const containsLetters = /[a-zA-Z]/.test(name);
    const containsNumbers = /\d/.test(name);
    return lengthValid && (containsLetters || containsNumbers);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (validateName(name)) {
    navigate("/");
    // } else {
    //   alert("Invalid name. Please enter a name with 6-25 characters and include letters or numbers.");
    // }
  };

  return (
    <div className="w-screen h-screen absolute z-[90909099] bg-[#161619] p-[20px]">
      <div>
        {/* header */}
        <div className="flex justify-between">
          <h1 className="text-white text-[14px] font-[500]">Your Name</h1>
          <button
            onClick={() => navigate("/")} // Ensure this triggers navigation correctly
            className="text-white text-[14px] font-[500] bg-transparent border-none"
          >
            Skip
          </button>
        </div>
        <div className="pt-[40px]">
          <form onSubmit={handleSubmit}>
            {/* Add onSubmit to handle form submission */}
            <div className="relative py-[20px]">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocusedName(true)}
                onBlur={() => setIsFocusedName(name !== "")}
                className="w-full px-4 py-2 bg-[#161619] input_border focus:outline-none text-white placeholder-transparent"
                required
                placeholder=""
              />
              <label
                htmlFor="name"
                className={`absolute text-[14px] left-4 text-gray-500 transition-all duration-300 pointer-events-none ${
                  isFocusedName || name
                    ? "top-[-8px] text-xs text-blue-500"
                    : "top-1/2 transform -translate-y-1/2"
                }`}
              >
                Set Your Name
              </label>
            </div>
            <button
              disabled={!validateName(name)}
              type="submit"
              className={`w-full mt-[20px] py-2 px-4 rounded-lg ${
                validateName(name) ? "login_button" : "next_button"
              } transition duration-300 ease-in-out`}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserName;
