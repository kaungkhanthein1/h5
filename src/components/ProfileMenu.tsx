// src/components/ProfileMenu.tsx
import { FC } from 'react';

const ProfileMenu: FC = () => {
  return (
    <div className="p-4">
      <div className="mb-6">
        <button className="flex items-center justify-between p-4 bg-gray-800 rounded-lg text-white">
          <span>History</span>
          <img src="/path-to-arrow-icon.svg" alt="Arrow" />
        </button>
      </div>
      <div className="mb-6">
        <button className="flex items-center justify-between p-4 bg-gray-800 rounded-lg text-white">
          <span>My Collection</span>
          <img src="/path-to-arrow-icon.svg" alt="Arrow" />
        </button>
      </div>
      {/* Add more menu items here */}
    </div>
  );
};

export default ProfileMenu;
