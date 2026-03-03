/**
 * Dark Industrial Design - Email Display Component
 * Shows the generated email with copy, refresh, and custom username input
 */
import { Copy, RefreshCw, Check, Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface EmailDisplayProps {
  email: string;
  domain: string;
  isCreating: boolean;
  onGenerateNew: () => void;
  onCreateCustom: (username: string) => Promise<string | null>;
}

export default function EmailDisplay({ email, domain, isCreating, onGenerateNew, onCreateCustom }: EmailDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [customError, setCustomError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success('تم نسخ البريد الإلكتروني');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      toast.success('تم نسخ البريد الإلكتروني');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCustomCreate = async () => {
    if (!customUsername.trim()) {
      setCustomError('أدخل اسم المستخدم');
      return;
    }

    const username = customUsername.trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(username)) {
      setCustomError('أحرف إنجليزية صغيرة وأرقام فقط');
      return;
    }

    setCustomError('');
    const result = await onCreateCustom(username);
    if (result) {
      setShowCustomInput(false);
      setCustomUsername('');
      toast.success(`تم إنشاء البريد: ${result}`);
    } else {
      // Error is shown via the global error state, but also show toast
      toast.error('فشل في إنشاء البريد - جرب اسماً مختلفاً أو انتظر قليلاً');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomCreate();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomUsername('');
      setCustomError('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative"
    >
      {/* Section Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 bg-primary" />
        <span className="text-xs font-mono text-primary tracking-widest uppercase">
          بريدك المؤقت
        </span>
      </div>

      {/* Email Box */}
      <div className="relative border-2 border-primary/30 bg-[oklch(0.13_0.005_260)] p-0 amber-glow">
        {/* Top accent line */}
        <div className="h-0.5 bg-gradient-to-l from-primary via-primary/50 to-transparent" />

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Email Address */}
            <div className="flex-1 w-full overflow-hidden">
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin" />
                  <span className="text-muted-foreground font-mono text-sm">جاري إنشاء البريد...</span>
                </div>
              ) : (
                <p
                  className="font-mono text-lg sm:text-xl md:text-2xl text-foreground tracking-wide break-all select-all cursor-text"
                  dir="ltr"
                >
                  {email}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Button
                onClick={handleCopy}
                disabled={!email || isCreating}
                className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 rounded-none h-10 px-4 font-mono text-xs uppercase tracking-wider transition-all duration-150"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 ml-1.5" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 ml-1.5" />
                    نسخ
                  </>
                )}
              </Button>

              <Button
                onClick={onGenerateNew}
                disabled={isCreating}
                variant="outline"
                className="border-2 border-primary/30 bg-transparent text-primary hover:bg-primary/10 rounded-none h-10 px-4 font-mono text-xs uppercase tracking-wider transition-all duration-150"
              >
                <RefreshCw className={`w-4 h-4 ml-1.5 ${isCreating ? 'animate-spin' : ''}`} />
                عشوائي
              </Button>

              <Button
                onClick={() => {
                  setShowCustomInput(!showCustomInput);
                  setCustomError('');
                  setTimeout(() => inputRef.current?.focus(), 100);
                }}
                disabled={isCreating}
                variant="outline"
                className="border-2 border-primary/30 bg-transparent text-primary hover:bg-primary/10 rounded-none h-10 px-4 font-mono text-xs uppercase tracking-wider transition-all duration-150"
              >
                <Pencil className="w-4 h-4 ml-1.5" />
                مخصص
              </Button>
            </div>
          </div>

          {/* Custom Username Input */}
          <AnimatePresence>
            {showCustomInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Pencil className="w-3.5 h-3.5 text-primary/60" />
                    <span className="text-xs font-mono text-muted-foreground">اختر اسم المستخدم الخاص بك</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2" dir="ltr">
                    <div className="flex-1 flex items-center border-2 border-border bg-[oklch(0.10_0.005_260)] focus-within:border-primary/50 transition-colors">
                      <input
                        ref={inputRef}
                        type="text"
                        value={customUsername}
                        onChange={(e) => {
                          setCustomUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''));
                          setCustomError('');
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="username"
                        className="flex-1 bg-transparent px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/30 outline-none"
                        disabled={isCreating}
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <span className="px-3 py-2.5 text-sm font-mono text-muted-foreground border-l border-border bg-[oklch(0.12_0.005_260)]">
                        @{domain}
                      </span>
                    </div>

                    <Button
                      onClick={handleCustomCreate}
                      disabled={isCreating || !customUsername.trim()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 rounded-none h-[42px] px-5 font-mono text-xs uppercase tracking-wider transition-all duration-150"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Create
                    </Button>
                  </div>

                  {customError && (
                    <p className="text-xs text-destructive font-mono mt-2">{customError}</p>
                  )}

                  <p className="text-[10px] text-muted-foreground/50 font-mono mt-2" dir="rtl">
                    يمكنك استخدام أحرف إنجليزية صغيرة وأرقام ونقاط وشرطات
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom info */}
        <div className="border-t border-primary/10 px-4 sm:px-6 py-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span>يتم التحديث تلقائياً كل 5 ثوانٍ</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
            نشط
          </span>
        </div>
      </div>
    </motion.div>
  );
}
