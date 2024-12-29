import styles from "./EmailSuccess.module.css";

const EmailSuccess = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#fff"
            width="50px"
            height="50px"
          >
            <circle cx="12" cy="12" r="10" fill="#fc4c00" />
            <path fill="none" stroke="#fff" strokeWidth="2" d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h1 className={styles.title}>Xác Thực Email Thành Công!</h1>
        <p className={styles.message}>
          Email được xác thực thành công, bạn có thể đăng nhập được rồi!
        </p>
        <button
          className={styles.button}
          onClick={() => (window.location.href = "/login")}
        >
          Đăng Nhập
        </button>
      </div>
    </div>
  );
};

export default EmailSuccess;
