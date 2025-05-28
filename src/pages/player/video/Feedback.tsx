import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { showToast } from "../../../pages/profile/error/ErrorSlice";
import { useDispatch } from "react-redux";
import { convertToSecurePayload } from "../../../services/newEncryption";

interface FeedbackComponentProps {
  onClose: () => void;
  movieId: string;
  onActionComplete: (action: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  height: any;
}

const FeedbackComponent: React.FC<FeedbackComponentProps> = ({
  onClose,
  movieId,
  onActionComplete,
  isLoading,
  setIsLoading,
  height,
}) => {
  const [selectedIssue, setSelectedIssue] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const dispatch = useDispatch();
  const modalRef = useRef<any>(null);

  const issues = [
    {
      name: "播放问题",
      value: 1000,
    },
    {
      name: "集数不全",
      value: 1001,
    },
    {
      name: "资源缺失",
      value: 1002,
    },
    {
      name: "信息有误",
      value: 1003,
    },
    {
      name: "积分兑换",
      value: 1004,
    },
    {
      name: "BUG反馈",
      value: 1005,
    },
  ];

  const handleIssueSelect = (issue: number) => {
    setSelectedIssue(issue);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const handleSubmitFeedback = async () => {
    if (!selectedIssue || !description) {
      dispatch(showToast({ message: "请填写所有必填项。", type: "error" }));
      return;
    }
    setIsLoading(true);
    try {
      // Submit feedback API call
      const loginResponse = await localStorage.getItem("authToken");
      const loginInfo = loginResponse ? JSON.parse(loginResponse || "") : null;
      const authorization =
        loginInfo && loginInfo.data && loginInfo.data.access_token
          ? `${loginInfo.data.token_type} ${loginInfo.data.access_token}`
          : null;
      if (authorization) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user/feedback/submit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorization,
            },
            body: JSON.stringify(
              convertToSecurePayload({
                extra: movieId,
                type_id: selectedIssue,
                content: description,
              })
            ),
          }
        );

        if (response.ok) {
          dispatch(showToast({ message: "反馈提交成功", type: "success" }));
          onClose();
        } else {
          dispatch(
            showToast({ message: "提交失败，请稍后重试", type: "error" })
          );
        }
      }
    } catch (error) {
      dispatch(showToast({ message: "提交失败，请稍后重试", type: "error" }));
      alert("提交失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bottom-0">
      <div
        className="bg-background backdrop-blur-md w-full max-w-md rounded-xl p-4 text-white"
        style={{ height: height }}
        ref={modalRef}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">反馈求片</h2>
          <button onClick={onClose} className="text-white">
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-md mb-2">选择遇到的问题</h3>
          <div className="grid grid-cols-2 gap-2">
            {issues.map((issue, index) => (
              <button
                key={index}
                onClick={() => handleIssueSelect(issue.value)}
                className={`px-4 py-2 rounded-md w-full text-center ${
                  selectedIssue === issue.value
                    ? "bg-orange-500 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {issue.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-md mb-2">详细描述问题（必填）</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="请描述遇到的问题，我们会帮您解决"
            rows={4}
          />
        </div>

        <button
          onClick={handleSubmitFeedback}
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none"
          disabled={isLoading}
        >
          {isLoading ? "提交中..." : "提 交"}
        </button>
      </div>
    </div>
  );
};

export default FeedbackComponent;
