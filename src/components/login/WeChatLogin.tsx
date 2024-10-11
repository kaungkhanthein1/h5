import React, { useEffect } from "react";
import {
  getSocialLoginUrl,
  handleSocialLoginCallback,
} from "../../services/userService";
import weChat from "../../assets/login/weChat.png";
import { useSearchParams } from "react-router-dom";

const WeChatLogin = () => {
  const [searchParams] = useSearchParams();
  const handleWeChatLogin = async () => {
    try {
      const socialLoginData = await getSocialLoginUrl("google", "login");

      const wechatLoginUrl = socialLoginData.data.url; // Make sure this matches the actual structure

      window.location.href = wechatLoginUrl;
    } catch (error) {
      console.error("Error during WeChat login:", error);
    }
    // WeChat OAuth URL
    // const wechatAppID = 'YOUR_WECHAT_APP_ID';
    // const redirectURI = encodeURIComponent('http://localhost:3000/wechat/callback'); // Your app's callback URL
    // const wechatLoginUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppID}&redirect_uri=${redirectURI}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;

    // window.location.href = wechatLoginUrl;
  };

  useEffect(() => {
    const code = searchParams.get("code"); // Extract the code from URL
    const type = searchParams.get("type"); // e.g., qq, wx, sina
    if (code && type) {
      handleSocialLoginCallback(type, "login", code);
    }
  }, [searchParams]);

  return (
    <img
      onClick={handleWeChatLogin}
      className="w-[50px] h-[50px]"
      src={weChat}
      alt="WeChat"
    />
  );
};

export default WeChatLogin;
