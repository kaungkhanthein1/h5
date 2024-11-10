import React from 'react';

const Popup: React.FC<{setOpenPopup: (open: boolean) => void}> = ({setOpenPopup}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#303033] popup-custom">
        <button className="block popup-item">复制</button>
        <button className="block popup-item">举报</button>
        <button className="block cancel-btn" onClick={(e)=>setOpenPopup(false)}>取消</button>
      </div>
    </div>
  );
}

export default Popup;
