import React from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from "../../profile/error/ErrorSlice";

const Popup: React.FC<{setOpenPopup: (open: boolean) => void; setOpenReportPopup: (open: boolean) => void; currentSelected: any}> = ({setOpenPopup, setOpenReportPopup, currentSelected}) => {
  const dispatch = useDispatch();

  const copyToClipboard = () => {
    // Create a textarea element to hold the text
    const textArea = document.createElement("textarea");
    textArea.value = currentSelected?.content;

    // Position off-screen and make it invisible
    textArea.style.position = "fixed";
    textArea.style.top = "-1000px";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy"); // This works on most browsers, including iOS Safari
      dispatch(showToast({ message: "复制的", type: "success" }));
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }

    // Remove the textarea after copying
    document.body.removeChild(textArea);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#303033] popup-custom">
        <button className="block popup-item" onClick={copyToClipboard}>复制</button>
        <button className="block popup-item" onClick={(e)=>setOpenReportPopup(true)}>举报</button>
        <button className="block cancel-btn" onClick={(e)=>setOpenPopup(false)}>取消</button>
      </div>
    </div>
  );
}

export default Popup;
