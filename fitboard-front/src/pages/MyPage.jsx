import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./MyPage.css";
import Swal from "sweetalert2";

function MyPage() {
  const navigate = useNavigate();
  const API_BASE_URL = api.defaults.baseURL || "http://localhost:8081";
  const activitySectionRef = useRef(null);

  const [myInfo, setMyInfo] = useState(null);
  const [boards, setBoards] = useState([]);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("boards");

  const [isEditMode, setIsEditMode] = useState(false);
  const [editNickname, setEditNickname] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordEditOpen, setIsPasswordEditOpen] = useState(false);

const resetPasswordForm = () => {
  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");
};

  const fetchData = useCallback(async (isMounted = () => true) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      const meResponse = await api.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!isMounted()) {
        return;
      }

      setMyInfo(meResponse.data);
      setEditNickname(meResponse.data.nickname);

      const boardResponse = await api.get("/api/boards");
      if (!isMounted()) {
        return;
      }

      setBoards(boardResponse.data.content || []);
      
      const commentResponse = await api.get("/api/comments/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!isMounted()) {
        return;
      }

      setComments(commentResponse.data);
    } catch (error) {
      console.error(error);
      if (isMounted()) {
        setMessage("마이페이지 정보를 불러오는 중 오류가 발생했습니다.");
      }
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      await fetchData(() => isMounted);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const myBoards = useMemo(() => {
    if (!myInfo) return [];
    return boards.filter((board) => board.userId === myInfo.id);
  }, [boards, myInfo]);

  const provider = String(myInfo?.provider || "").toUpperCase();
  const hasKakaoLoginId = String(myInfo?.loginId || "").startsWith("kakao_");
  const isKakaoUser = hasKakaoLoginId || (!myInfo?.loginId && provider === "KAKAO");
  const canChangePassword = Boolean(myInfo) && !isKakaoUser;
  const profileInitial = String(myInfo?.nickname || myInfo?.loginId || "F")
    .trim()
    .slice(0, 1)
    .toUpperCase();
  const latestBoard = myBoards[0];
  const latestComment = comments[0];
  const totalViews = myBoards.reduce(
    (sum, board) => sum + Number(board.viewCount || 0),
    0
  );

  const getPreviewText = (content, limit = 90) => {
    const text = String(content || "").trim();

    if (text.length <= limit) {
      return text;
    }

    return `${text.slice(0, limit)}...`;
  };

  const formatCount = (value) => Number(value || 0).toLocaleString("ko-KR");

  const moveToActivity = (tabName) => {
    setActiveTab(tabName);
    activitySectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleUpdateMyInfo = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!editNickname.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "입력 확인",
        text: "닉네임을 입력해주십시오.",
        confirmButtonColor: "#12805d",
      });
      return;
    }

    await api.put(
      "/api/users/me",
      { nickname: editNickname },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setIsEditMode(false);
    await fetchData();

    await Swal.fire({
      icon: "success",
      title: "수정 완료",
      text: "닉네임이 수정되었습니다.",
      confirmButtonColor: "#12805d",
    });
  } catch (error) {
    console.error(error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "내 정보 수정 중 오류가 발생했습니다.";

    await Swal.fire({
      icon: "error",
      title: "수정 실패",
      text: errorMessage,
      confirmButtonColor: "#ef4444",
    });
  }
};

  const handleUpdatePassword = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      await Swal.fire({
        icon: "warning",
        title: "입력 확인",
        text: "모든 비밀번호 항목을 입력해주십시오.",
        confirmButtonColor: "#12805d",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "비밀번호 불일치",
        text: "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      await Swal.fire({
        icon: "error",
        title: "비밀번호 형식 오류",
        text: "비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 모두 포함해야 합니다.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }
    if (currentPassword === newPassword) {
  await Swal.fire({
    icon: "error",
    title: "변경 실패",
    text: "새 비밀번호는 현재 비밀번호와 다르게 입력해주십시오.",
    confirmButtonColor: "#ef4444",
  });
  return;
}

    await api.put(
      "/api/users/me/password",
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    await Swal.fire({
  icon: "success",
  title: "변경 완료",
  text: "비밀번호가 변경되었습니다. 다시 로그인해주십시오.",
  confirmButtonColor: "#12805d",
});

localStorage.removeItem("accessToken");
navigate("/login");
  } catch (error) {
    console.error(error);

    const errorMessage =
      error.response?.data?.message ||
      "비밀번호 변경 중 오류가 발생했습니다.";

    await Swal.fire({
      icon: "error",
      title: "변경 실패",
      text: errorMessage,
      confirmButtonColor: "#ef4444",
    });
  }
};

const handleDeleteMyAccount = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    navigate("/login");
    return;
  }

  let requestData = {};

  if (isKakaoUser) {
    const result = await Swal.fire({
      icon: "warning",
      title: "회원 탈퇴",
      text: "카카오 계정으로 로그인한 회원입니다. 탈퇴하면 작성한 게시글은 삭제되고, 일부 댓글은 '탈퇴한 회원'으로 표시됩니다. 정말 탈퇴하시겠습니까?",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) {
      return;
    }
  } else {
    const { value: password } = await Swal.fire({
      icon: "warning",
      title: "회원 탈퇴",
      text: "비밀번호를 입력하면 탈퇴가 진행됩니다.",
      input: "password",
      inputPlaceholder: "현재 비밀번호 입력",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소",
      inputValidator: (value) => {
        if (!value) {
          return "비밀번호를 입력해주십시오.";
        }
      },
    });

    if (!password) {
      return;
    }

    requestData = {
      password,
    };
  }

  try {
    const response = await api.delete("/api/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: requestData,
    });

    localStorage.removeItem("accessToken");

    await Swal.fire({
      icon: "success",
      title: "탈퇴 완료",
      text: response.data?.message || "회원 탈퇴가 완료되었습니다.",
      confirmButtonColor: "#12805d",
    });

    navigate("/login");
  } catch (error) {
    console.error(error);

    const errorMessage =
      error.response?.data?.message || "회원 탈퇴 중 오류가 발생했습니다.";

    await Swal.fire({
      icon: "error",
      title: "탈퇴 실패",
      text: errorMessage,
      confirmButtonColor: "#ef4444",
    });
  }
};

  return (
    <div className="mypage">
      <Header myInfo={myInfo} />

      <main className="mypage-main">
        <section className="mypage-hero">
          <div className="mypage-hero-content">
            <span className="mypage-kicker">MY FITBOARD</span>
            <h2 className="mypage-title">
              {myInfo ? `${myInfo.nickname}님의 활동 기록` : "마이페이지"}
            </h2>
            <p className="mypage-hero-desc">
              작성한 글과 댓글을 한곳에서 확인하고, 계정 정보를 관리하세요.
            </p>
          </div>

          <button
            className="mypage-primary-action"
            onClick={() => navigate("/boards/new")}
          >
            새 글 쓰기
          </button>
        </section>

        {message && <p className="mypage-message">{message}</p>}

        <section className="mypage-overview">
          <article className="mypage-profile-card">
            <div className="mypage-profile-top">
              <div className="mypage-profile-head">
                <div className="mypage-avatar">{profileInitial}</div>
                <div>
                  <span className="mypage-kicker">프로필</span>
                  <h3 className="mypage-profile-name">
                    {myInfo?.nickname || "불러오는 중"}
                  </h3>
                </div>
              </div>

              <div className="mypage-profile-action-column">
                {!isEditMode ? (
                  <button
                    className="mypage-edit-button"
                    onClick={() => setIsEditMode(true)}
                  >
                    닉네임 변경
                  </button>
                ) : (
                  <div className="mypage-edit-action-group">
                    <button
                      className="mypage-save-button"
                      onClick={handleUpdateMyInfo}
                    >
                      저장
                    </button>
                    <button
                      className="mypage-cancel-button"
                      onClick={() => {
                        setIsEditMode(false);
                        setEditNickname(myInfo?.nickname || "");
                      }}
                    >
                      취소
                    </button>
                  </div>
                )}

                {canChangePassword && (
                  <>
                    {!isPasswordEditOpen ? (
                      <button
                        className="mypage-password-toggle-button"
                        onClick={() => {
                          setIsPasswordEditOpen(true);
                        }}
                      >
                        비밀번호 변경
                      </button>
                    ) : (
                      <button
                        className="mypage-password-close-button"
                        onClick={() => {
                          setIsPasswordEditOpen(false);
                          resetPasswordForm();
                        }}
                      >
                        비밀번호 변경 취소
                      </button>
                    )}
                  </>
                )}
                <button
                  className="mypage-delete-button"
                  onClick={handleDeleteMyAccount}
                >
                  회원 탈퇴
                </button>
              </div>
            </div>

            {myInfo ? (
              <div className="mypage-profile-info">
                <div className="mypage-info-row">
                  <span>아이디</span>
                  <strong>{myInfo.loginId}</strong>
                </div>
                <div className="mypage-info-row">
                  <span>이메일</span>
                  <strong>{myInfo.email}</strong>
                </div>

                {!isEditMode ? (
                  <div className="mypage-info-row">
                    <span>닉네임</span>
                    <strong>{myInfo.nickname}</strong>
                  </div>
                ) : (
                  <div className="mypage-edit-field">
                    <label className="mypage-edit-label">닉네임</label>
                    <input
                      className="mypage-edit-input"
                      type="text"
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="mypage-loading">내 정보를 불러오는 중입니다.</p>
            )}

            {canChangePassword && isPasswordEditOpen && (
              <div className="mypage-password-inline-area">
                <div className="mypage-password-form">
                  <div className="mypage-edit-field">
                    <label className="mypage-edit-label">현재 비밀번호</label>
                    <input
                      className="mypage-edit-input"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="mypage-edit-field">
                    <label className="mypage-edit-label">새 비밀번호</label>
                    <input
                      className="mypage-edit-input"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="mypage-edit-field">
                    <label className="mypage-edit-label">새 비밀번호 확인</label>
                    <input
                      className="mypage-edit-input"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <button
                    className="mypage-password-button"
                    onClick={handleUpdatePassword}
                  >
                    저장
                  </button>
                </div>
              </div>
            )}
          </article>

          <div className="mypage-stat-grid">
            <button
              type="button"
              className="mypage-stat-card mypage-stat-button"
              onClick={() => moveToActivity("boards")}
            >
              <span>작성한 글</span>
              <strong>{formatCount(myBoards.length)}</strong>
              <small>내 게시글 보기</small>
            </button>
            <button
              type="button"
              className="mypage-stat-card mypage-stat-button"
              onClick={() => moveToActivity("comments")}
            >
              <span>작성한 댓글</span>
              <strong>{formatCount(comments.length)}</strong>
              <small>내 댓글 보기</small>
            </button>
            <article className="mypage-stat-card">
              <span>누적 조회수</span>
              <strong>{formatCount(totalViews)}</strong>
              <small>내 글 전체 기준</small>
            </article>
          </div>
        </section>

        <section className="mypage-highlight-grid">
          <article className="mypage-highlight-card">
            <span className="mypage-kicker">최근 게시글</span>
            {latestBoard ? (
              <button
                className="mypage-highlight-link"
                onClick={() => navigate(`/boards/${latestBoard.id}`)}
              >
                {latestBoard.title}
              </button>
            ) : (
              <p>아직 작성한 게시글이 없습니다.</p>
            )}
          </article>

          <article className="mypage-highlight-card">
            <span className="mypage-kicker">최근 댓글</span>
            {latestComment ? (
              <button
                className="mypage-highlight-link"
                onClick={() => navigate(`/boards/${latestComment.boardId}`)}
              >
                {getPreviewText(latestComment.content, 54)}
              </button>
            ) : (
              <p>아직 작성한 댓글이 없습니다.</p>
            )}
          </article>
        </section>

        <section className="mypage-board-section" ref={activitySectionRef}>
          <div className="mypage-board-top">
            <div>
              <span className="mypage-kicker">활동 내역</span>
              <h3 className="mypage-board-title">내가 남긴 이야기</h3>
            </div>
          </div>

          <div className="mypage-tab-group">
            <button
              className={activeTab === "boards" ? "mypage-tab active" : "mypage-tab"}
              onClick={() => setActiveTab("boards")}
            >
              내가 쓴 글 ({myBoards.length})
            </button>
            <button
              className={activeTab === "comments" ? "mypage-tab active" : "mypage-tab"}
              onClick={() => setActiveTab("comments")}
            >
              내가 쓴 댓글 ({comments.length})
            </button>
          </div>

          {activeTab === "boards" && (
            <>
              {myBoards.length === 0 ? (
                <div className="mypage-empty">아직 작성한 게시글이 없습니다.</div>
              ) : (
                <div className="mypage-board-list">
                  {myBoards.map((board) => (
                    <article
                      key={board.id}
                      className="mypage-board-card"
                      onClick={() => navigate(`/boards/${board.id}`)}
                    >
                      <div className="mypage-board-card-top">
                        <span className="mypage-category">{board.category}</span>
                        <span className="mypage-date">
                          {String(board.createdAt).replace("T", " ").slice(0, 16)}
                        </span>
                      </div>

                      <h4 className="mypage-board-card-title">{board.title}</h4>
                      {String(board.imageUrl || "").trim() && (
                        <div className="mypage-board-thumbnail">
                          <img
                            src={`${API_BASE_URL}${String(
                              board.imageUrl
                            ).trim()}`}
                            alt="게시글 첨부 이미지"
                          />
                        </div>
                      )}
                      <p className="mypage-board-card-content">
                        {getPreviewText(board.content)}
                      </p>

                      <div className="mypage-board-meta">
                        <span>조회수 {board.viewCount}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "comments" && (
            <>
              {comments.length === 0 ? (
                <div className="mypage-empty">아직 작성한 댓글이 없습니다.</div>
              ) : (
                <div className="mypage-comment-list">
                  {comments.map((comment) => (
                    <article
                      key={comment.id}
                      className="mypage-comment-card"
                      onClick={() => navigate(`/boards/${comment.boardId}`)}
                    >
                      <div className="mypage-comment-top">
                        <span className="mypage-comment-board">
                          {comment.boardTitle}
                        </span>
                        <span className="mypage-date">
                          {String(comment.createdAt).replace("T", " ").slice(0, 16)}
                        </span>
                      </div>

                      <p className="mypage-comment-content">{comment.content}</p>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default MyPage;
