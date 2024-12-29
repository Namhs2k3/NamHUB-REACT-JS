import { useEffect, useState } from "react";
import ReactStars from "react-stars";
import styles from "./ProductReview.module.css";
import {
  createReview,
  updateReview,
  deleteReview,
  getCustomerInfo,
} from "../../../../api";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { format } from "date-fns";

const ProductReview = ({
  productId,
  commentList,
  existingReview,
  setReload,
}) => {
  const [review, setReview] = useState({
    rating: 5,
    comment: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState(commentList);

  console.log(
    "productId:",
    productId,
    "commentList",
    commentList,
    "comments",
    comments,
    "existingReview",
    existingReview
  );
  useEffect(() => {
    setComments(commentList);
  }, [commentList]);

  const fetchUserData = async (id) => {
    let userData = {};
    try {
      const data = await getCustomerInfo(id);
      userData = data;
      return userData;
    } catch (error) {
      console.log("có lỗi xảy ra: ", error);
    }
    return userData;
  };

  const baseURL = import.meta.env.VITE_BACKEND_URL;
  const [userAvatars, setUserAvatars] = useState({});
  const [currentUserAvatar, setCurrentUserAvatar] = useState("");

  useEffect(() => {
    const loadUserAvatars = async () => {
      const avatars = {};
      for (const comment of commentList) {
        const data = await fetchUserData(comment.userId);
        avatars[comment.userId] =
          `${baseURL}${data.userImage}` ||
          "/src/assets/png-clipart-man-wearing-blue-shirt-illustration-computer-icons-avatar-user-login-avatar-blue-child.png";
      }
      setUserAvatars(avatars);

      const data = await fetchUserData(existingReview.userId);
      setCurrentUserAvatar(`${baseURL}${data.userImage}`);
    };
    loadUserAvatars();
  }, [commentList, baseURL, existingReview]);

  console.log(userAvatars);
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (existingReview.isCurrentUserComment) {
        await updateReview({
          commentId: existingReview.ratingId,
          rating: review.rating,
          comment: review.comment,
        });
        setReload((prev) => !prev);
      } else {
        await createReview({
          productId,
          rating: review.rating,
          comment: review.comment,
        });
        setReload((prev) => !prev);
      }

      toast.success("Đã đánh giá sản phẩm");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) return;

    try {
      await deleteReview(reviewId);
      setComments((prev) =>
        prev.filter((comment) => comment.ratingId !== reviewId)
      );
      setReload((prev) => !prev);
      toast.success("Đã xóa đánh giá!");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.title}>Đánh Giá Sản Phẩm</h2>
      <div className={styles.reviewForm}>
        <ReactStars
          count={5}
          half={false}
          value={review.rating}
          onChange={(newRating) =>
            setReview((prev) => ({ ...prev, rating: newRating }))
          }
          size={30}
          color2="#ff9600"
        />
        <textarea
          className={styles.commentBox}
          placeholder="Viết đánh giá của bạn..."
          value={review.comment}
          onChange={(e) =>
            setReview((prev) => ({ ...prev, comment: e.target.value }))
          }
          required
          disabled={isSubmitting}
        ></textarea>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {existingReview.isCurrentUserComment
            ? "Cập Nhật Bình Luận"
            : "Gửi Bình Luận"}
        </button>
      </div>

      <div className={styles.commentsSection}>
        <h3 className={styles.titleCmt}>Bình luận</h3>
        {existingReview.isCurrentUserComment ? (
          <div key={existingReview.ratingId} className={styles.commentItem}>
            <img
              src={currentUserAvatar}
              alt={`${existingReview.userName}'s avatar`}
              className={styles.avatar}
            />
            <div className={styles.commentContent}>
              <div className="d-flex gap-3 align-items-center">
                <strong>{existingReview.fullName}</strong>
                <em className="text-secondary">
                  {format(existingReview.updatedAt, "dd/MM/yyyy HH:mm")}
                </em>
              </div>
              <ReactStars
                count={5}
                value={existingReview.rating}
                size={20}
                edit={false}
                color2="#ff9600"
              />
              <p>{existingReview.comment}</p>
              {existingReview.isCurrentUserComment ? (
                <button
                  onClick={() => handleDelete(existingReview.ratingId)}
                  className={styles.deleteButton}
                >
                  Xóa Bình Luận
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
        {comments.map((comment) => (
          <div key={comment.ratingId} className={styles.commentItem}>
            <img
              src={
                userAvatars[comment.userId] ||
                "/src/assets/png-clipart-man-wearing-blue-shirt-illustration-computer-icons-avatar-user-login-avatar-blue-child.png"
              }
              alt={`${comment.userName}'s avatar`}
              className={styles.avatar}
            />
            <div className={styles.commentContent}>
              <div className="d-flex gap-3 align-items-center">
                <strong>{comment.fullName}</strong>
                <em className="text-secondary">
                  {format(comment.updatedAt, "dd/MM/yyyy HH:mm")}
                </em>
              </div>
              <ReactStars
                count={5}
                value={comment.rating}
                size={20}
                edit={false}
                color2="#ff9600"
              />
              <p>{comment.comment}</p>
              {comment.isCurrentUserComment ? (
                <button
                  onClick={() => handleDelete(comment.ratingId)}
                  className={styles.deleteButton}
                >
                  Xóa Bình Luận
                </button>
              ) : null}
            </div>
          </div>
        ))}
        {comments.length === 0 &&
          typeof existingReview === "object" &&
          Object.keys(existingReview).length === 0 && (
            <p>Không có bình luận nào</p>
          )}
      </div>
    </div>
  );
};

ProductReview.propTypes = {
  productId: PropTypes.string,
  commentList: PropTypes.array,
  existingReview: PropTypes.object,
  setReload: PropTypes.func,
};
export default ProductReview;
