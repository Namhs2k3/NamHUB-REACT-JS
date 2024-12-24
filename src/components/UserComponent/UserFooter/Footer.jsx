import styles from "./Footer.module.css";
import Logo from "../../Logo/Logo";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo và Slogan */}
        <div className={styles.brand}>
          <h1>
            <Logo />
          </h1>
          <p>Connecting People with Quality.</p>
        </div>

        {/* Nhóm liên kết chính */}
        <div className={styles.linksGroup}>
          <h2 className={styles.groupTitle}>Quick Links</h2>
          <ul className={styles.links}>
            <li>
              <a
                href="#about"
                title="Learn more about us"
                className={styles.link}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#services"
                title="Discover our services"
                className={styles.link}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#blog"
                title="Read our latest blog posts"
                className={styles.link}
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#contact"
                title="Get in touch with us"
                className={styles.link}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Nhóm liên kết mạng xã hội */}
        <div className={styles.linksGroup}>
          <h2 className={styles.groupTitle}>Follow Us</h2>
          <div className={styles.socials}>
            <a
              href="https://facebook.com"
              className={`${styles.icon} ${styles.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Visit our Facebook page"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              className={`${styles.icon} ${styles.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on Twitter"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              className={`${styles.icon} ${styles.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Check out our Instagram"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Phần bản quyền */}
      <div className={styles.bottom}>
        <p>
          &copy; {new Date().getFullYear()} PHAM NGOC NAM - 215052216 UEF. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
