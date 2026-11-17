import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Designed & built with care in {profile.location}</span>
      </div>
    </footer>
  );
}
