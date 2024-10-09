import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faStar, faShareAlt } from '@fortawesome/free-solid-svg-icons';

interface FeedbackComponentProps {
  onClose: () => void;
  movieId: string;
  onActionComplete: (action: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const FeedbackComponent: React.FC<FeedbackComponentProps> = ({ onClose, movieId, onActionComplete, isLoading, setIsLoading
 }) => {
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const issues = [
    '播放问题',
    '集数不全',
    '资源缺失',
    '信息有误',
    '分类不准',
    'BUG 反馈'
  ];

  const handleIssueSelect = (issue: string) => {
    setSelectedIssue(issue);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedIssue || !description) {
      alert('请填写所有必填项。');
      return;
    }
    setIsLoading(true);
    try {
      // Submit feedback API call
      const response = await fetch('https://cc3e497d.qdhgtch.com:2345/api/v1/movie/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movieId,
          issue: selectedIssue,
          description,
        }),
      });
      if (response.ok) {
        alert('反馈提交成功');
        onClose();
      } else {
        alert('提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('提交失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bottom-0">
      <div className="bg-black backdrop-blur-md w-full max-w-md rounded-xl p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">反馈求片</h2>
          <button onClick={onClose} className="text-white">
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* <div className="actions flex justify-between my-4">
          <button
            onClick={handleStarToggle}
            className={`action-btn flex flex-col items-center px-4 py-2 rounded-md ${isStarred ? 'text-orange-500' : 'text-gray-200'}`}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faStar} className="h-7 mb-2" />
            <span>收藏</span>
          </button>

          <button onClick={onClose} className="flex flex-col items-center px-4 py-2 rounded-md">
            <span className="text-gray-200">反馈/求片</span>
          </button>

          <button onClick={handleShare} className="action-btn flex flex-col items-center px-4 py-2 rounded-md" disabled={isLoading}>
            <FontAwesomeIcon icon={faShareAlt} className="h-7 mb-2" />
            <span className="text-gray-200">分享</span>
          </button>
        </div> */}

        <div className="mb-4">
          <h3 className="text-md mb-2">选择遇到的问题</h3>
          <div className="grid grid-cols-2 gap-2">
            {issues.map((issue, index) => (
              <button
                key={index}
                onClick={() => handleIssueSelect(issue)}
                className={`px-4 py-2 rounded-md w-full text-center ${
                  selectedIssue === issue
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                {issue}
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
          {isLoading ? '提交中...' : '提 交'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackComponent;