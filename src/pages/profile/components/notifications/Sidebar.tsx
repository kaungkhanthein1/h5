const Sidebar = ({ notices, onNoticeClick, selectedNotice }: any) => {
  return (
    <div className="sidebar bg-[#242427] rounded-r-lg pb-10 p-1">
      {notices.map((notice: any) => (
        <button
          key={notice.id}
          className={`sidebar-button ${
            selectedNotice === notice.id ? "active" : ""
          }`}
          onClick={() => onNoticeClick(notice.id)}
        >
          {notice.title}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
