import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link href="/" className="wordmark">
          aitokencost<span>.dev</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <a href="#calculator">Calculator</a>
          <a href="#sources">Methodology</a>
        </nav>
      </div>
    </header>
  );
}
