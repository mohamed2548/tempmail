/**
 * Dark Industrial Design - Alias List Component
 * Shows all created email aliases with switch and delete actions
 */
import { Mail, X, ChevronLeft, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AliasAccount } from '@/hooks/useTempMail';

interface AliasListProps {
  aliases: AliasAccount[];
  activeAliasId: string;
  onSwitch: (id: string) => void;
  onRemove: (id: string) => void;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
}

export default function AliasList({ aliases, activeAliasId, onSwitch, onRemove }: AliasListProps) {
  if (aliases.length <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative mt-4"
    >
      {/* Section Label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary" />
          <span className="text-xs font-mono text-primary tracking-widest uppercase">
            العناوين المُنشأة
          </span>
          <span className="bg-primary/10 text-primary text-[10px] font-mono px-1.5 py-0.5 border border-primary/20">
            {aliases.length}
          </span>
        </div>
      </div>

      {/* Aliases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <AnimatePresence mode="popLayout">
          {aliases.map((alias, index) => {
            const isActive = alias.id === activeAliasId;
            return (
              <motion.div
                key={alias.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, delay: index * 0.03 }}
                onClick={() => !isActive && onSwitch(alias.id)}
                className={`
                  group relative border bg-[oklch(0.13_0.005_260)] p-3 transition-all duration-150 cursor-pointer
                  ${isActive
                    ? 'border-primary/40 amber-glow'
                    : 'border-border hover:border-primary/20'
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 right-0 left-0 h-0.5 bg-primary" />
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <div className={`
                      w-7 h-7 flex items-center justify-center shrink-0
                      ${isActive ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground/50'}
                    `}>
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-mono text-xs text-foreground truncate" dir="ltr">
                        {alias.email}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-mono text-muted-foreground/50">
                          {formatTime(alias.createdAt)}
                        </span>
                        {alias.messageCount > 0 && (
                          <span className="flex items-center gap-0.5 text-[9px] font-mono text-primary/60">
                            <Hash className="w-2.5 h-2.5" />
                            {alias.messageCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status / Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isActive && (
                      <span className="flex items-center gap-1 text-[9px] font-mono text-primary">
                        <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
                        نشط
                      </span>
                    )}
                    {!isActive && (
                      <span className="hidden group-hover:flex items-center text-[9px] font-mono text-muted-foreground">
                        <ChevronLeft className="w-3 h-3" />
                        تبديل
                      </span>
                    )}
                    {aliases.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(alias.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground/30 hover:text-destructive"
                        title="حذف"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
