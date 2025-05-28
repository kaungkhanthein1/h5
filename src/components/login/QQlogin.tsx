import React from "react";
import { getSocialLoginUrl } from "../../services/userService";
import blue from "../../assets/login/blue.png";

const QQLogin = () => {
  const handleWeChatLogin = async () => {
    try {
      const socialLoginData = await getSocialLoginUrl("qq", "login");
      console.log("Social login data:", socialLoginData);
      const wechatLoginUrl = socialLoginData.data.url; // Make sure this matches the actual structure

      console.log("Redirecting to:", wechatLoginUrl);
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

  return (
    <img
      onClick={handleWeChatLogin}
      className="w-[50px] h-[50px]"
      src={blue}
      alt="WeChat"
    />
  );
};

export default QQLogin;
