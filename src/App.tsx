import React, { startTransition, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import FooterNav from "./components/FooterNav";
import { useDispatch, useSelector } from "react-redux";
import LoginEmail from "./components/login/LoginEmail";

import {
  setAuthModel,
  setLoginOpen,
  setPanding,
  setSignupOpen,
} from "./features/login/ModelSlice";
import Login from "./pages/login";
import SignUp from "./components/login/SignUp";
import Favorite from "./pages/profile/Favorite";
import Loader from "./pages/search/components/Loader";
import Landing from "./components/Landing";

// Lazy load the pages
const Home = React.lazy(() => import("./pages/home"));
const Search = React.lazy(() => import("./pages/search"));
const Main = React.lazy(() => import("./pages/search/Main"));
const Explorer = React.lazy(() => import("./pages/explorer"));
const Profile = React.lazy(() => import("./pages/profile"));
const Player = React.lazy(() => import("./pages/player"));
const Detail = React.lazy(() => import("./pages/explorer/Detail"));
const History = React.lazy(() => import("./pages/profile/History"));
const Settings = React.lazy(() => import("./pages/profile/Settings"));
const Notifications = React.lazy(() => import("./pages/profile/Notifications"));

// ProtectedRoute component to handle route guarding
// const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
//   const isLoggedIn = localStorage.getItem("authToken"); // Check if the user is authenticated
//   return isLoggedIn ? children : <Navigate to="/login" replace />;
// };

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { openAuthModel, openLoginModel, openSignupModel, panding } =
    useSelector((state: any) => state.model);
  console.log(panding);
  const location = useLocation();
  // const isLoggedIn = localStorage.getItem("authToken"); // Check if the user is authenticated

  // Hide header and footer when the current path is "/player/:id" or "/login"
  const hideHeaderFooter =
    location.pathname.startsWith("/player") ||
    location.pathname.startsWith("/history") ||
    location.pathname.startsWith("/favorites") ||
    location.pathname.startsWith("/notifications") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/search_overlay") ||
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/profile");

  const hideHeader = location.pathname.startsWith("/explorer");
  useEffect(() => {
    dispatch(setPanding(true));
    const timer = setTimeout(() => {
      dispatch(setPanding(false));
    }, 6000);

    return () => clearTimeout(timer);
  }, [dispatch]);
  console.log(panding);

  // useEffect(() => {
  //   // Redirect to login if not logged in and trying to access any route other than login
  //   if (!isLoggedIn && location.pathname !== "/login") {
  //     window.location.href = "/login";
  //   }
  // }, [isLoggedIn, location.pathname]);

  const handleBack = () => {
    startTransition(() => {
      dispatch(setAuthModel(true));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
    });
  };

  const closeAllModals = () => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
    });
  };

  return (
    <>
      {panding ? (
        <Landing />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Conditionally render Header */}
          {!hideHeaderFooter && !hideHeader && <Header />}

          <div className="flex-grow overflow-auto ">
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-screen bg-[#161619]">
                  <Loader />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<Main />} />
                <Route path="/search_overlay" element={<Search />} />

                <Route path="/explorer" element={<Explorer />} />
                <Route path="/explorer/:id" element={<Detail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/player/:id" element={<Player />} />
                <Route path="/history" element={<History />} />
                <Route path="/favorites" element={<Favorite />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
              </Routes>
            </Suspense>
          </div>

          {/* Conditionally render FooterNav */}
          {!hideHeaderFooter && <FooterNav />}
          {location.pathname.startsWith("/profile") && <FooterNav />}

          {(openAuthModel || openLoginModel || openSignupModel) && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-[998]" // Overlay with 50% opacity
              onClick={closeAllModals} // Close all modals on click
            ></div>
          )}
          {openAuthModel && <Login />}
          {openLoginModel && <LoginEmail handleBack={handleBack} />}
          {openSignupModel && <SignUp handleBack={handleBack} />}
        </div>
      )}
    </>
  );
};

// Wrap the App component with Router for useLocation to work
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
