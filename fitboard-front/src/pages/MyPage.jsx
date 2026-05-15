import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import "./MyPage.css";
import Swal from "sweetalert2";

function MyPage() {
  const navigate = useNavigate();

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

  const fetchData = async () => {
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
      setMyInfo(meResponse.data);
      setEditNickname(meResponse.data.nickname);

      const boardResponse = await api.get("/api/boards");
      setBoards(boardResponse.data);

      const commentResponse = await api.get("/api/comments/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setComments(commentResponse.data);
    } catch (error) {
      console.error(error);
      setMessage("마이페이지 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const myBoards = useMemo(() => {
    if (!myInfo) return [];
    return boards.filter((board) => board.userId === myInfo.id);
  }, [boards, myInfo]);

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
        confirmButtonColor: "#35c5f0",
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
      confirmButtonColor: "#35c5f0",
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
        confirmButtonColor: "#35c5f0",
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
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
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

    const response = await api.put(
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
      text: response.data?.message || "비밀번호가 변경되었습니다.",
      confirmButtonColor: "#35c5f0",
    });

    resetPasswordForm();
    setIsPasswordEditOpen(false);
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

  return (
    <div className="mypage">
      <Header myInfo={myInfo} />

      <main className="mypage-main">
        <section className="mypage-profile-card">
  <div className="mypage-profile-top">
    <h2 className="mypage-title">마이페이지</h2>

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
    </div>
  </div>

  {myInfo ? (
    <div className="mypage-profile-info">
      <p><strong>아이디</strong> {myInfo.loginId}</p>
      <p><strong>이메일</strong> {myInfo.email}</p>

      {!isEditMode ? (
        <p><strong>닉네임</strong> {myInfo.nickname}</p>
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
    <p>내 정보를 불러오는 중입니다.</p>
  )}

  {isPasswordEditOpen && (
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
</section>

        <section className="mypage-board-section">
          <div className="mypage-board-top">
            <h3 className="mypage-board-title">내 활동</h3>
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
                      <p className="mypage-board-card-content">{board.content}</p>

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
    </div>
  );
}

export default MyPage;