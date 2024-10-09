import React, { useState } from 'react';

interface SkipSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSkipTime: string; // Initial time for the skip setting
  type: 'intro' | 'outro';  // Type of skip setting
  onSave: (type: 'intro' | 'outro', skipTime: string) => void;
}

const SkipSettingsModal: React.FC<SkipSettingsModalProps> = ({ isOpen, onClose, initialSkipTime, type, onSave }) => {
  const [skipTime, setSkipTime] = useState(initialSkipTime);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(type, skipTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white p-4 rounded-lg space-y-4">
        <h2 className="text-lg">{type === 'intro' ? '跳过片头设置' : '跳过片尾设置'}</h2>
        <div>
          <label htmlFor="skip-time">{type === 'intro' ? '跳过片头时间' : '跳过片尾时间'}: {skipTime}</label>
          <input
            id="skip-time"
            type="range"
            min="0"
            max="300"  // Maximum 5 minutes
            value={skipTime}
            onChange={(e) => setSkipTime(e.target.value)}
            className="w-full range range-primary"
          />
        </div>
        <div className="flex justify-between">
          <button className="btn btn-error" onClick={onClose}>取消</button>
          <button className="btn btn-success" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
};

export default SkipSettingsModal;
