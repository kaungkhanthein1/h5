import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleSocialLoginCallback } from "../../services/userService";
import Bound from "../../components/login/Social/Bound";
import { useDispatch } from "react-redux";
import { setSocial_id } from "../../features/login/ModelSlice";

export const SocialLoginCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [bound, setBound] = useState<boolean>(false);
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setShow(false);
    const code = searchParams.get("code");
    const type = searchParams.get("type");

    const handleCallback = async () => {
      if (code && type) {
        try {
          const data = await handleSocialLoginCallback(type, "login", code); // Await the async call

          if (data) {
            dispatch(setSocial_id(data.social_id));
          }
          if (data?.token) {
            localStorage.setItem("authToken", JSON.stringify(data.token));
            navigate("/profile");
          } else {
            setShow(false);
          }
        } catch (error) {
          console.error("Error handling social login callback:", error);
        }
      }
    };

    handleCallback(); // Call the async function
  }, [searchParams]);

  return (
    <div className="h-screen w-screen p-[20px] bg-[#161619]">
      {show ? "loading.." : <Bound />}
    </div>
  );
};

export default SocialLoginCallbackPage;
