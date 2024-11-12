import React, { useState } from "react";
import DefaultIcon from "../../../assets/icon_check_nor.svg";
import SelectedIcon from "../../../assets/icon_check_select.svg";
import { showToast } from "../../profile/error/ErrorSlice";
import { useDispatch } from "react-redux";

const ReportPopup: React.FC<{
  setOpenPopup: (open: boolean) => void;
  setOpenReportPopup: (open: boolean) => void;
}> = ({ setOpenPopup, setOpenReportPopup }) => {
  const dispatch = useDispatch();

  const [reportCause, setReportCause] = useState<any>(null);

  const reportItems = [
    { key: 1, value: "违反法律法规" },
    { key: 2, value: "侵犯个人利益" },
    { key: 3, value: "仇恨言论" },
    { key: 4, value: "有害社区环境" },
  ];

  const reportSubmit = () => {
    setOpenPopup(false);
    setOpenReportPopup(false);
    dispatch(showToast({ message: "成功", type: "success" }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#303033] popup-custom p-5">
        {reportItems.map((item) => {
          return (
            <div key={item.key} onClick={() => setReportCause(item)}>
              <div className="mb-4 w-full flex justify-between">
                <label htmlFor="option1" className="text-white text-[14px]">
                  {item.value}
                </label>
                {/* <input type="radio" id="option1" name="option" className="mr-2" /> */}
                <img
                  src={
                    reportCause?.key === item.key ? SelectedIcon : DefaultIcon
                  }
                  alt=""
                  className="h-5 rounded-sm"
                />
              </div>
            </div>
          );
        })}
        <button
          className="bg-[#F54100] text-white py-2 px-4 rounded w-full"
          onClick={reportSubmit}
        >
          提交
        </button>
      </div>
    </div>
  );
};

export default ReportPopup;
