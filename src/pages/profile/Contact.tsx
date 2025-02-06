import React, { useState } from "react";
import Navbar from "./components/contact/Navbar";
import logo from "../../assets/ContactLogo.png";
import { Link } from "react-router-dom";
import { useGetTagsQuery } from "../search/services/searchApi";
import Loader from "../search/components/Loader";
import { useGetHeaderTopicsQuery } from "../../services/helperService";

const Contact = () => {
  const [show, setshow] = useState(false);
  const handleClick = () => {
    setshow((prev) => !prev);
  };
  // const {
  //   data,
  //   isLoading: isLoader,
  //   isFetching: isFetch,
  // } = useGetTagsQuery(undefined, {
  //   skip: !show,
  // });
  const {
    data,
    isLoading: isLoader,
    isFetching: isFetch,
  } = useGetHeaderTopicsQuery();

  const about = data?.data?.about;

  return (
    <div>
      <div className="fixed-bg"></div>
      <div className="text-white h-screen">
        <Navbar />

        <div className="flex justify-center -mt-[100px] text-center h-screen">
          <div className="flex flex-col justify-center items-center">
            <img src={logo} alt="" className="w-[90px]" />
            <p className="contact-text mt-3">版本号 2.0.2</p>
          </div>
        </div>

        <div className="">
          {show ? (
            <div className="bg-[#303033] bottom-0 rounded-t-[30px] absolute w-full p-4">
              <div>
                <div className="flex justify-center relative text-center items-center">
                  {/* <div></div> */}
                  <div>联系我们</div>
                  <button onClick={handleClick} className="absolute right-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 10.5862L16.95 5.63623L18.364 7.05023L13.414 12.0002L18.364 16.9502L16.95 18.3642L12 13.4142L7.04999 18.3642L5.63599 16.9502L10.586 12.0002L5.63599 7.05023L7.04999 5.63623L12 10.5862Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
                {about && (
                  <div className="flex flex-col mt-5">
                    {about?.map((data: any, index: number) => (
                      <Link
                        key={index}
                        target="_blank"
                        to={`${
                          data?.link?.includes("@gmail")
                            ? `mailto:${data?.link}`
                            : data?.link
                        }`}
                        className="flex justify-between mt-2 items-center bg-[#3b3b3d] p-3 rounded-sm"
                      >
                        <div className="contact-link-text">{data?.text}</div>
                        <div className="flex items-center">
                          <span className="content-link">{data?.link}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <g opacity="0.2">
                              <path
                                d="M13.172 12.0002L8.22198 7.05023L9.63598 5.63623L16 12.0002L9.63598 18.3642L8.22198 16.9502L13.172 12.0002Z"
                                fill="white"
                              />
                            </g>
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {isLoader && (
                  <div className="text-white text-center flex justify-center items-center h-[100px] mt-5">
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className=" absolute px-4 py-3 bottom-0 w-full">
              <button
                className={`w-full  bg-[#F54100] rounded-sm text-white text-center p-3`}
                onClick={handleClick}
              >
                联系我们
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
