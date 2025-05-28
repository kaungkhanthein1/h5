import React, { useState } from "react";
import BottomAds from '../assets/bottomAds.jpg';

const BannerAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const adLink = 'https://rcn8wlcamk0g.shop/?utm_source=WZ-xingkongyingshi&utm_medium=WZ-xingkongyingshi&utm_id=WZ-xingkongyingshi';

  const closeAd = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={styles.bannerContainer}>
      <div style={styles.closeButton} onClick={closeAd}>
        x
      </div>
      <a href={adLink}>
      <img
        src={BottomAds} // Replace with your ad image URL
        alt="Ad Banner"
        style={styles.bannerImage}
      />
      </a>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  bannerContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTop: "1px solid #ddd",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  closeButton: {
    position: "absolute",
    top: -15,
    right: 0,
    color: "#fff",
    borderRadius: "50%",
    padding: "0.3em",
    cursor: "pointer",
    fontSize: "1.2em",
    lineHeight: "1em",
    textAlign: "center",
    opacity: 0.6,
    background: '#000000'
  },
  bannerImage: {
    width: "100%",
    // maxWidth: "728px", // Adjust size as needed
    minHeight: "auto",
  },
};

export default BannerAd;
