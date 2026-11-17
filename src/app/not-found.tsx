import Link from "next/link";

export default function NotFound() {
  return (
    <section className="cs-hero">
      <div className="container">
        <span className="eyebrow">404</span>
        <h1 className="cs-title">
          Lost the <span className="serif">flow</span>.
        </h1>
        <p className="cs-tagline">This page doesn&apos;t exist, but the work does.</p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: 32 }}>
          Back home
        </Link>
      </div>
    </section>
  );
}
