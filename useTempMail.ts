/**
 * Dark Industrial Design - Message List Component
 * Displays inbox messages with industrial styling
 */
import { Mail, MailOpen, Paperclip, Trash2, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageFrom {
  address: string;
  name: string;
}

interface MessagePreview {
  id: string;
  from: MessageFrom;
  subject: string;
  intro: string;
  createdAt: string;
  seen: boolean;
  hasAttachments: boolean;
}

interface MessageListProps {
  messages: MessagePreview[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isFetching: boolean;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  return date.toLocaleDateString('ar-SA');
}

export default function MessageList({ messages, selectedId, onSelect, onDelete, isFetching }: MessageListProps) {
  return (
    <div className="relative">
      {/* Section Label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary" />
          <span className="text-xs font-mono text-primary tracking-widest uppercase">
            صندوق الوارد
          </span>
          {messages.length > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-mono px-1.5 py-0.5 font-bold">
              {messages.length}
            </span>
          )}
        </div>
        {isFetching && (
          <div className="w-3 h-3 border border-primary border-t-transparent animate-spin" />
        )}
      </div>

      {/* Messages Container */}
      <div className="border-2 border-border bg-[oklch(0.13_0.005_260)] min-h-[300px] max-h-[500px] overflow-y-auto">
        {/* Top accent */}
        <div className="h-0.5 bg-gradient-to-l from-transparent via-primary/30 to-transparent" />

        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 px-4"
            >
              <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-sm font-mono text-center">
                لا توجد رسائل بعد
              </p>
              <p className="text-muted-foreground/50 text-xs font-mono text-center mt-1">
                سيتم عرض الرسائل الواردة هنا تلقائياً
              </p>
            </motion.div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => onSelect(msg.id)}
                className={`
                  group relative border-b border-border/50 cursor-pointer transition-all duration-150
                  ${selectedId === msg.id
                    ? 'bg-primary/5 border-r-2 border-r-primary'
                    : 'hover:bg-[oklch(0.16_0.005_260)]'
                  }
                  ${!msg.seen ? 'bg-primary/[0.03]' : ''}
                `}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`
                      mt-0.5 w-8 h-8 flex items-center justify-center shrink-0
                      ${!msg.seen ? 'text-primary' : 'text-muted-foreground/40'}
                    `}>
                      {msg.seen ? (
                        <MailOpen className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-sm truncate ${!msg.seen ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                          {msg.from.name || msg.from.address}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>

                      <p className={`text-sm truncate mb-1 ${!msg.seen ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {msg.subject || '(بدون عنوان)'}
                      </p>

                      <p className="text-xs text-muted-foreground/60 truncate">
                        {msg.intro || 'لا يوجد معاينة'}
                      </p>

                      {msg.hasAttachments && (
                        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-primary/60">
                          <Paperclip className="w-3 h-3" />
                          <span>مرفقات</span>
                        </div>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(msg.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 p-1.5 text-muted-foreground/40 hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
