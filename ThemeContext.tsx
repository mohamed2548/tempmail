/**
 * Dark Industrial Design - Header Component
 * Sharp edges, amber accent, industrial typography
 */
import { Mail, Shield, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative border-b-2 border-amber/30 bg-[oklch(0.10_0.005_260)]">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary/10 border-2 border-primary/40 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
              TEMP<span className="text-primary">MAIL</span>
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              بريد مؤقت آمن
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary/60" />
            <span>مشفّر</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary/60" />
            <span>فوري</span>
          </div>
        </div>
      </div>
    </header>
  );
}
