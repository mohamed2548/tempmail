/**
 * Dark Industrial Design - Message View Component
 * Full message display with HTML rendering
 */
import { ArrowRight, Clock, User, Paperclip, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface MessageFrom {
  address: string;
  name: string;
}

interface MessageFull {
  id: string;
  from: MessageFrom;
  to: MessageFrom[];
  subject: string;
  intro: string;
  text: string;
  html: string[];
  createdAt: string;
  seen: boolean;
  hasAttachments: boolean;
}

interface MessageViewProps {
  message: MessageFull;
  onBack: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessageView({ message, onBack }: MessageViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && message.html && message.html.length > 0) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        const htmlContent = message.html.join('');
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html dir="auto">
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'IBM Plex Sans Arabic', -apple-system, sans-serif;
                color: #e8e6e3;
                background: oklch(0.13 0.005 260);
                padding: 16px;
                margin: 0;
                font-size: 14px;
                line-height: 1.7;
                word-break: break-word;
              }
              a { color: #f59e0b; }
              img { max-width: 100%; height: auto; }
              table { max-width: 100%; }
              pre, code { 
                background: oklch(0.10 0.005 260); 
                padding: 2px 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 13px;
              }
              blockquote {
                border-right: 3px solid #f59e0b;
                padding-right: 12px;
                margin-right: 0;
                color: #999;
              }
            </style>
          </head>
          <body>${htmlContent}</body>
          </html>
        `);
        doc.close();

        // Auto-resize iframe
        const resizeObserver = new ResizeObserver(() => {
          if (iframeRef.current && doc.body) {
            iframeRef.current.style.height = doc.body.scrollHeight + 'px';
          }
        });
        if (doc.body) resizeObserver.observe(doc.body);
        setTimeout(() => {
          if (iframeRef.current && doc.body) {
            iframeRef.current.style.height = doc.body.scrollHeight + 'px';
          }
        }, 300);
      }
    }
  }, [message.html]);

  const hasHtml = message.html && message.html.length > 0 && message.html.some(h => h.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="relative"
    >
      {/* Section Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 bg-primary" />
        <span className="text-xs font-mono text-primary tracking-widest uppercase">
          تفاصيل الرسالة
        </span>
      </div>

      {/* Message Container */}
      <div className="border-2 border-border bg-[oklch(0.13_0.005_260)]">
        {/* Top accent */}
        <div className="h-0.5 bg-gradient-to-l from-primary via-primary/50 to-transparent" />

        {/* Header */}
        <div className="border-b border-border p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="border border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-primary/30 rounded-none h-8 px-3 font-mono text-xs"
            >
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
              رجوع
            </Button>
          </div>

          {/* Subject */}
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 leading-relaxed">
            {message.subject || '(بدون عنوان)'}
          </h2>

          {/* Meta */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-3.5 h-3.5 text-primary/60 shrink-0" />
              <span className="text-muted-foreground">من:</span>
              <span className="text-foreground font-mono text-xs" dir="ltr">
                {message.from.name ? `${message.from.name} <${message.from.address}>` : message.from.address}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-3.5 h-3.5 text-primary/60 shrink-0" />
              <span className="text-muted-foreground">التاريخ:</span>
              <span className="text-foreground text-xs">
                {formatDate(message.createdAt)}
              </span>
            </div>

            {message.hasAttachments && (
              <div className="flex items-center gap-2 text-sm">
                <Paperclip className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                <span className="text-primary text-xs">تحتوي على مرفقات</span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          {hasHtml ? (
            <iframe
              ref={iframeRef}
              className="w-full border-0 min-h-[200px]"
              sandbox="allow-same-origin"
              title="محتوى الرسالة"
            />
          ) : (
            <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-mono" dir="auto">
              {message.text || 'لا يوجد محتوى نصي'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground/50">
            ID: {message.id}
          </span>
          <a
            href="https://mail.tm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/40 hover:text-primary/60 transition-colors"
          >
            <ExternalLink className="w-2.5 h-2.5" />
            Powered by mail.tm
          </a>
        </div>
      </div>
    </motion.div>
  );
}
