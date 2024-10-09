import React, { useState } from 'react';

const ProductTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'详情' | '评论'>('详情');

  const handleTabClick = (tab: '详情' | '评论') => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="flex border-b border-gray-300">
        <button
          className={`px-4 py-2 text-sm font-medium focus:outline-none ${
            activeTab === '详情'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-600'
          }`}
          onClick={() => handleTabClick('详情')}
        >
          详情
        </button>
        <button
          className={`px-4 py-2 ml-4 text-sm font-medium focus:outline-none ${
            activeTab === '评论'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-600'
          }`}
          onClick={() => handleTabClick('评论')}
        >
          评论 99+
        </button>
      </div>
      <div className="mt-4">
        {activeTab === '详情' && (
          <div>
            {/* Your code for product details goes here */}
          </div>
        )}
        {activeTab === '评论' && (
          <div>
            {/* Your code for product reviews goes here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTab;