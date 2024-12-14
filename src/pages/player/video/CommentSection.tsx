import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faPaperPlane,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ProfileImg from "../../../assets/share/user.svg";
import NoData from "../../../assets/nodata.svg";
import OptionIcon from "../../../assets/option.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModel } from "../../../features/login/ModelSlice";
import { CommentProps, Comment, Reply } from "../../../model/commentModel";
import { showToast } from "../../../pages/profile/error/ErrorSlice";
import Popup from "./Popup";
import ReportPopup from "./ReportPopup";
import Loader from "../../../pages/search/components/Loader";
import { useGetUserQuery } from "../../../pages/profile/services/profileApi";
import {
  convertToSecurePayload,
  convertToSecureUrl,
  decryptWithAes,
} from "../../../services/newEncryption";
import { fetchCommentData } from "../../../services/playerService";

const CommentComponent: React.FC<CommentProps> = ({
  movieId,
  lowerDivHeight,
  setCommentCount,
  commentCount,
  comments,
  setComments,
  hasMore,
  setHasMore
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [isLoggedIn, setIsLoggedLogIn] = useState<boolean>(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openReportPopup, setOpenReportPopup] = useState(false);
  const [currentSelected, setCurrentSelected] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const user = useSelector((state: any) => state.user.user);
  const { data: userData } = useGetUserQuery(undefined);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteParams, setDeleteParams] = useState<any>(null);
  const [numberOfRow, setNumberOfRow] = useState<number>(1);
  const user = userData?.data;
  console.log("user is=>", user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLoginInfo = async () => {
      const loginResponse = await localStorage.getItem("authToken");
      const loginInfo = loginResponse ? JSON.parse(loginResponse) : null;

      setIsLoggedLogIn(
        loginInfo && loginInfo.data && loginInfo.data.access_token
          ? true
          : false
      );
    };
    fetchLoginInfo();
  }, []);

  useEffect(() => {
    // window.scrollTo(0, 0);
  }, []);
  // Fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response: any = await fetchCommentData(movieId || '', page);
      const data: any = response ? await decryptWithAes(response) : null;

      console.log('data is=>', data);
      // Concatenate new comments to existing ones using spread operator (...)
      const updatedComments =
        comments &&
        comments.length > 0 &&
        comments.length < data.data.total &&
        page > 1
          ? [...comments, ...data.data.list]
          : data.data.list;
      setComments(updatedComments);
      setCommentCount(data.data.total);
      // Update hasMore based on total comments and fetched list length
      setHasMore(data.data.total > updatedComments.length);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setIsLoading(false);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page]);

  // Like a comment
  const likeComment = async (commentId: number) => {
    if (!isLoggedIn) {
      dispatch(setAuthModel(true));
      return;
    }
    const loginResponse = await localStorage.getItem("authToken");
    const loginInfo = loginResponse ? JSON.parse(loginResponse || "") : null;
    const authorization =
      loginInfo && loginInfo.data && loginInfo.data.access_token
        ? `${loginInfo.data.token_type} ${loginInfo.data.access_token}`
        : null;

    if (authorization) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/movie/comments/like`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorization,
            },
            body: JSON.stringify(
              convertToSecurePayload({ comment_id: commentId })
            ),
          }
        );
        if (response.ok) {
          setComments((prevComments: any) =>
            prevComments.map((comment: any) =>
              comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment
            )
          );
        } else {
          console.error("Error liking comment");
        }
      } catch (error) {
        console.error("Error liking comment:", error);
      }
    }
  };

  // Load replies
  const loadReplies = async (comment: Comment) => {
    setIsLoading(true);
    try {
      const response: any = await fetch(
        `${process.env.REACT_APP_API_URL}/movie/comments/replies?comment_id=${
          comment.id
        }&last_reply_id=${
          comment.replies.list[comment.replies.list.length - 1].id
        }&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: any = response ? await decryptWithAes(response) : null;
      const newComments = comments.map((c: any) => {
        if (c.id === comment.id) {
          c.replies.list = [...c.replies.list, ...data.data.list];
          c.replies.hasMore = data.data.hasMore;
        }
        return c;
      });
      setComments(newComments);
    } catch (error) {
      console.error("Error loading replies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete comment or reply with authentication
  const deleteCommentOrReply = async (id: number, isReply: boolean) => {
    const loginResponse = await localStorage.getItem("authToken");
    const loginInfo = loginResponse ? JSON.parse(loginResponse || "") : null;
    const authorization =
      loginInfo && loginInfo.data && loginInfo.data.access_token
        ? `${loginInfo.data.token_type} ${loginInfo.data.access_token}`
        : null;

    if (authorization) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/movie/comments/delete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorization,
            },
            body: JSON.stringify(
              convertToSecurePayload({ is_reply: isReply, id })
            ),
          }
        );
        if (response.ok) {
          setComments((prevComments: any) =>
            prevComments.filter((comment: any) => comment.id !== id)
          );
          dispatch(showToast({ message: "已删除", type: "success" }));
        }
      } catch (error) {
        console.error("Error deleting comment/reply:", error);
      }
    }
  };

  const handleDelete = (id: number, isReply: boolean) => {
    setDeleteParams({ id, isReply });
    setShowDeleteConfirmation(true); // Open confirmation modal
  };

  const handleConfirm = () => {
    if (deleteParams) {
      deleteCommentOrReply(deleteParams.id, deleteParams.isReply);
    }
    setShowDeleteConfirmation(false);
  };

  const handleCancel = () => {
    setShowDeleteConfirmation(false);
  };
  // Post a new comment or reply
  const handleCreateCommentOrReply = async () => {
    if (!newComment) return;
    setLoading(true);

    const loginResponse = await localStorage.getItem("authToken");
    const loginInfo = loginResponse ? JSON.parse(loginResponse || "") : null;
    const authorization =
      loginInfo && loginInfo.data && loginInfo.data.access_token
        ? `${loginInfo.data.token_type} ${loginInfo.data.access_token}`
        : null;

    if (authorization) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/movie/comments/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorization,
            },
            body: JSON.stringify(convertToSecurePayload({
              comment_id: replyingTo ? replyingTo : 0,
              movie_id: movieId,
              type: "text",
              content: newComment,
            })),
          }
        );

        await response.json();
        if (page === 1) {
          fetchComments();
        } else {
          setPage(1);
        }

        setNewComment("");
        setReplyingTo(null);
        dispatch(showToast({ message: "已发布", type: "success" }));
      } catch (error) {
        console.error("Error creating comment or reply:", error);
        dispatch(showToast({ message: "创建评论或回复时出错", type: "error" }));
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (replyingTo !== null && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [replyingTo]);

  const handleLoad = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div>
      <div style={{ height: lowerDivHeight - 140, overflow: "scroll" }}>
        {comments && comments.length > 0 ? (
          <InfiniteScroll
            dataLength={comments.length}
            next={handleLoad}
            hasMore={hasMore}
            loader={
              <div className="text-white flex justify-center pb-4 items-center text-center">
                <Loader />
              </div>
            }
            className="comment-section flex flex-col rounded-md p-3"
            height={lowerDivHeight - 140}
          >
            {comments.map((comment: any) => (
              <div key={comment.id} className="comment pb-4 relative">
                {/* Like button at the top right corner */}
                {comment.status !== 0 && (
                  <button
                    disabled={!isLoggedIn}
                    onClick={() => likeComment(comment.id)}
                    className="absolute top-0 right-0 m-2 text-gray-400 hover:text-blue-500"
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <p className="-mt-1">{comment.likes}</p>
                  </button>
                )}
                <div className="profile flex items-center justify-items-center mb-2">
                  <img
                    src={comment.user?.avatar || ProfileImg}
                    alt={comment.user?.nickname}
                    className="w-8 h-8 rounded-full mr-2 mt-3"
                  />
                  <span className="username text-commentIcon font-bold">
                    {comment.user?.nickname}
                  </span>
                  <img
                    src={comment.user?.level}
                    alt={comment.user?.level}
                    className="h-6 w-auto ml-2"
                  />
                </div>
                <div style={{ marginLeft: "46px", marginTop: "-8px" }}>
                  <div className={`comment-text text-gray-300 mb-1 ${comment.status === 0 ? 'italic' : ''}`}>
                    {comment.content}
                  </div>
                  <div className="comment-actions flex items-center justify-start gap-4 mt-2">
                    <span className="time text-gray-500 text-sm">
                      {
                        new Date(comment.create_time * 1000)
                          ?.toISOString()
                          ?.split("T")[0]
                      }
                    </span>
                    <div>
                      {comment.status !== 0 && (
                        <span
                          className="time text-commentIcon text-sm mr-4"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          回复
                        </span>
                      )}
                      {user && user.id && comment.user_id === user.id && (
                        <span
                          className="time text-commentIcon text-sm"
                          onClick={() => handleDelete(comment.id, false)}
                        >
                          删除
                        </span>
                      )}
                    </div>
                    {comment.status !== 0 && (
                      <img
                        src={OptionIcon}
                        onClick={() => {
                          setOpenPopup(true);
                          setCurrentSelected(comment);
                        }}
                        alt=""
                        className="w-9 h-5 rounded-sm mr-2 mt-0.5"
                      />
                    )}
                  </div>
                </div>
                {/* Replies */}
                {comment.replies &&
                  comment.replies?.list &&
                  comment.replies?.list.length > 0 && (
                    <>
                      <div className="reply-section mt-2 pl-10">
                        {comment.replies.list.map((reply: Reply) => (
                          <div key={reply.id} className="reply">
                            <div className="profile flex items-center justify-items-center mb-2">
                              <img
                                src={reply.user?.avatar || ProfileImg}
                                alt={reply.user?.nickname}
                                className="w-8 h-8 rounded-full mr-2 mt-3"
                              />
                              <span className="username text-commentIcon font-bold">
                                {reply.user?.nickname}
                              </span>
                              <img
                                src={reply.user?.level}
                                alt={reply.user?.level}
                                className="h-6 w-auto ml-2"
                              />
                            </div>
                            <div
                              style={{ marginLeft: "46px", marginTop: "-8px" }}
                            >
                              <div className={`comment-text text-gray-300 mb-1 ${comment.status === 0 ? 'italic' : ''}`}>
                                {reply.content}
                              </div>
                              <div className="comment-actions flex items-center justify-start gap-4 mt-2">
                                <span className="time text-gray-500 text-sm">
                                  {
                                    new Date(reply.create_time * 1000)
                                      ?.toISOString()
                                      ?.split("T")[0]
                                  }
                                </span>
                                <div>
                                  {reply.status !== 0 && (
                                    <span
                                      className="time text-commentIcon text-sm mr-4"
                                      onClick={() => setReplyingTo(comment.id)}
                                    >
                                      回复
                                    </span>
                                  )}
                                  {user &&
                                    user.id &&
                                    reply.user.id === user.id && (
                                      <span
                                        className="time text-commentIcon text-sm"
                                        onClick={() =>
                                          handleDelete(reply.id, true)
                                        }
                                      >
                                        删除
                                      </span>
                                    )}
                                </div>
                                {comment.status !== 0 && (
                                  <img
                                    src={OptionIcon}
                                    onClick={() => {
                                      setOpenPopup(true);
                                      setCurrentSelected(comment);
                                    }}
                                    alt=""
                                    className="w-9 h-5 rounded-sm mr-2 mt-0.5"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {comment.replies?.hasMore &&
                        (!isLoading ? (
                          <div
                            onClick={() => loadReplies(comment)}
                            className="flex self-stretch justify-start items-center flex-row gap-2"
                            style={{ marginLeft: 46, marginTop: 15 }}
                          >
                            <div
                              className="bg-[rgba(255,255,255,0.1)] w-[28px] h-px"
                              style={{ width: "28px" }}
                            ></div>
                            <div className="flex justify-start items-center flex-row gap-1">
                              <span className="text-[rgba(255,255,255,0.6)] text-sm font-['PingFang_SC']">
                                展开 条回复
                              </span>
                              <div
                                className="flex justify-center items-center flex-row pt-[2.999999523162842px] pb-[3px] pr-[3px] pl-[2.999999523162842px] w-[18px] h-[18px]"
                                style={{ width: "18px" }}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.79381 8.16363L2.29151 4.05146C2.26667 4.02225 2.25243 3.98831 2.25028 3.95326C2.24814 3.91821 2.25818 3.88336 2.27934 3.85243C2.3005 3.82149 2.33198 3.79563 2.37044 3.77759C2.40889 3.75955 2.45287 3.75002 2.4977 3.75L9.5023 3.75C9.54713 3.75002 9.59111 3.75955 9.62956 3.77759C9.66802 3.79563 9.6995 3.82149 9.72066 3.85243C9.74182 3.88336 9.75186 3.91821 9.74972 3.95326C9.74757 3.98831 9.73333 4.02225 9.70849 4.05146L6.20619 8.16363C6.18356 8.1902 6.1529 8.21198 6.11693 8.22705C6.08096 8.24212 6.0408 8.25 6 8.25C5.9592 8.25 5.91904 8.24212 5.88307 8.22705C5.8471 8.21198 5.81644 8.1902 5.79381 8.16363Z"
                                    fill="white"
                                    fillOpacity="0.6"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-white flex w-[300px] justify-center mt-4 pb-4 items-center text-center">
                            <Loader />
                          </div>
                        ))}
                    </>
                  )}
              </div>
            ))}
          </InfiniteScroll>
        ) : isLoading ? (
          <div className="text-white flex justify-center pb-4 items-center text-center mt-52">
            <Loader />
          </div>
        ) : (
          <div
            className="flex justify-center items-center text-center comment-btn"
            style={{ height: lowerDivHeight, width: "100%" }}
          >
            <img src={NoData} alt="nodata" width={120} />
          </div>
        )}
      </div>
      {/* Create new comment or reply */}
      {isLoggedIn ? (
        <div className="create-comment bg-commentInput p-2 flex items-center justify-center rounded-lg w-full  comment-btn">
          <img
            src={user?.avatar || ProfileImg}
            alt="User Avatar"
            className={`w-8 h-8 rounded-full mr-1`}
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              console.log("e.key is=>", e.key);
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent default submit behavior
                setNewComment((prev) => prev + "\n"); // Add a new line
                setNumberOfRow((prev) => prev + 1); // Increment rows
              } else if (e.key === "Backspace") {
                // Calculate the number of newlines in the comment
                const newNumberOfRows =
                  (newComment.match(/\n/g) || []).length + 1;

                // Update the number of rows dynamically
                setNumberOfRow(newNumberOfRows > 1 ? newNumberOfRows : 1);
              }
            }}
            className="flex-grow bg-source text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={"确认过眼神，你是发言人！"}
            rows={numberOfRow} // Dynamically adjust the rows
          />

          {newComment && (
            <button
              onClick={handleCreateCommentOrReply}
              className="bg-playerNavigator text-white py-2 px-4 ml-3 rounded-md focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} />
              ) : (
                <span>发送</span>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="create-comment mt-6 flex items-center justify-center rounded-lg w-full comment-btn">
          <button
            onClick={() => dispatch(setAuthModel(true))}
            className="text-white w-full px-4 py-3 mx-2 rounded-md"
            style={{ background: "#f54000" }}
          >
            登录后发布评论
          </button>
        </div>
      )}

      {/* Popup */}
      {openPopup && (
        <Popup
          setOpenPopup={setOpenPopup}
          setOpenReportPopup={setOpenReportPopup}
          currentSelected={currentSelected}
        />
      )}
      {openReportPopup && (
        <ReportPopup
          setOpenPopup={setOpenPopup}
          setOpenReportPopup={setOpenReportPopup}
        />
      )}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-80 flex justify-center items-center mt-20">
          <div className="bg-[#242428] confirm w-full rounded-2xl mx-10 text-center shadow-lg">
            <h2 className="p-5">您确定要删除吗?</h2>
            <div className="flex justify-between">
              <button
                className="text-white w-[50%] p-3 border-t-[1px] border-r-[1px] border-gray-500"
                onClick={handleCancel}
              >
                取消
              </button>
              <button
                className="text-[#f54100] w-[50%] p-3 border-t-[1px] border-gray-500"
                onClick={handleConfirm}
              >
                删除全部
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentComponent;
