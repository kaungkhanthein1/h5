import { FC, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import SVG files directly
import homeIcon from '../assets/home.png';
import homeSelectedIcon from '../assets/homeSelected.png';
import explorerIcon from '../assets/explorer.png';
import explorerSelectedIcon from '../assets/explorerSelected.png';
import profileIcon from '../assets/profile.png';
import profileSelectedIcon from '../assets/profileSelected.png';

const Footer: FC = () => {
  const { t } = useTranslation();
  const location = useLocation(); // Hook to get the current URL
  const [selectedMenu, setSelectedMenu] = useState('home');
  useEffect(() => {
    // Update the selected menu based on the current location path
    if (location.pathname === '/' || location.pathname === '/home') {
      setSelectedMenu('home');
    } else if (location.pathname === '/explorer') {
      setSelectedMenu('explorer');
    } else if (location.pathname === '/profile') {
      setSelectedMenu('profile');
    }
  }, [location.pathname]);
  return (
    <footer className={`bg-[#1f1f21] fixed bottom-0 w-full shadow-lg z-50`}>
      <div className="flex justify-around items-center py-2">
        
        {/* Home Icon */}
        <Link to="/" className="flex flex-col items-center" onClick={() => setSelectedMenu('home')}>
          <div className="rounded-full">
            <img
              src={selectedMenu === 'home' ? homeSelectedIcon : homeIcon}
              alt="Home"
              className="h-8 w-8"  // Adjust size as needed
            />
          </div>
          <span className={`${selectedMenu === 'home' ? 'text-white' : 'text-white/80'} text-[10px]`}>
            {t('footer.home')}
          </span>
        </Link>

        {/* Explorer Icon */}
        <Link to="/explorer" className="flex flex-col items-center" onClick={() => setSelectedMenu('explorer')}>
          <div className="rounded-full">
            <img
              src={selectedMenu === 'explorer' ? explorerSelectedIcon : explorerIcon}
              alt="Explorer"
              className="h-8 w-8"
            />
          </div>
          <span className={`${selectedMenu === 'explorer' ? 'text-white' : 'text-white/80'} text-[10px]`}>
            {t('footer.explorer')}
          </span>
        </Link>

        {/* Profile Icon */}
        <Link to="/profile" className="flex flex-col items-center" onClick={() => setSelectedMenu('profile')}>
          <div className="rounded-full">
            <img
              src={selectedMenu === 'profile' ? profileSelectedIcon : profileIcon}
              alt="Profile"
              className="h-8 w-8"
            />
          </div>
          <span className={`${selectedMenu === 'profile' ? 'text-white' : 'text-white/80'} text-[10px]`}>
            {t('footer.profile')}
          </span>
        </Link>

      </div>
    </footer>
  );
};

export default Footer;