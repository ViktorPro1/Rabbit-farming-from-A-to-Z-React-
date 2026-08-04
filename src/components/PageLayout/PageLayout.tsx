import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import ShareButton from "../ShareButton/ShareButton";
import "./PageLayout.css";

interface RelatedLink {
  to: string;
  icon?: string;
  label: string;
}

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  shareTitle: string;
  relatedLinks?: RelatedLink[];
  relatedTitle?: string;
  className?: string;
  children: ReactNode;
}

export default function PageLayout({
  title,
  subtitle,
  shareTitle,
  relatedLinks,
  relatedTitle = "Читайте також",
  className,
  children,
}: PageLayoutProps) {
  return (
    <main className={`page-layout ${className ?? ""}`}>
      <div className="page-layout-header">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="page-layout-wrap">
        {children}

        {relatedLinks && relatedLinks.length > 0 && (
          <div className="page-layout-related">
            <h3 className="page-layout-related-title">{relatedTitle}</h3>
            <div className="page-layout-related-grid">
              {relatedLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="page-layout-related-link"
                >
                  {link.icon && `${link.icon} `}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="page-layout-back">
          <Link to="/" className="page-layout-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title={shareTitle} />
        </div>
      </div>
    </main>
  );
}
