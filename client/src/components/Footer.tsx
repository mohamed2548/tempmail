/**
 * Dark Industrial Design - Footer Component
 */
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-2 border-border bg-[oklch(0.10_0.005_260)]">
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground/50">
            <span>TEMPMAIL &copy; {new Date().getFullYear()}</span>
            <span className="hidden sm:inline">|</span>
            <span>بريد إلكتروني مؤقت مجاني</span>
          </div>
          <a
            href="https://mail.tm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/40 hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Powered by mail.tm API
          </a>
        </div>
      </div>
    </footer>
  );
}
