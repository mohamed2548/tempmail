/**
 * Dark Industrial Design - Home Page
 * Main page with email generation, custom username, aliases, inbox, and message viewing
 * Color: Charcoal black + Amber accent
 * Typography: Space Grotesk (display) + IBM Plex Sans Arabic (body) + JetBrains Mono (code)
 */
import { useTempMail } from '@/hooks/useTempMail';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmailDisplay from '@/components/EmailDisplay';
import MessageList from '@/components/MessageList';
import MessageView from '@/components/MessageView';
import HowItWorks from '@/components/HowItWorks';
import AliasList from '@/components/AliasList';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const {
    email,
    domain,
    messages,
    selectedMessage,
    isLoading,
    isCreating,
    isFetchingMessages,
    error,
    aliases,
    activeAliasId,
    generateNewEmail,
    createCustomEmail,
    fetchMessageDetails,
    clearSelectedMessage,
    deleteMessage,
    switchToAlias,
    removeAlias,
  } = useTempMail();

  // Show error as toast when email is already active
  const prevErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (error && email && error !== prevErrorRef.current) {
      toast.error(error);
    }
    prevErrorRef.current = error;
  }, [error, email]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background noise-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-sm text-muted-foreground">جاري تجهيز البريد المؤقت...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && !email) {
    return (
      <div className="min-h-screen bg-background noise-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-destructive/30 bg-card p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">حدث خطأ</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Button
            onClick={generateNewEmail}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono text-xs uppercase tracking-wider"
          >
            إعادة المحاولة
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise-bg flex flex-col">
      <Header />

      {/* Hero Section */}
      <div
        className="relative border-b border-border overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663392107353/RAwE89A4Czx9WKKJj2ihLV/hero-bg-EhAVZv7JeRw6ZaZJn7QoAA.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative container py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            {/* Left: Text */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663392107353/RAwE89A4Czx9WKKJj2ihLV/email-icon-X8ur3YVSXaqD7sveKbqvLs.webp"
                    alt="TempMail"
                    className="w-14 h-14 object-contain"
                  />
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                      بريد إلكتروني مؤقت
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      احمِ خصوصيتك - اختر اسمك أو ولّد عناوين غير محدودة
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Stats */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center border border-border/50 p-4 bg-card/30 backdrop-blur-sm">
                <div className="text-2xl font-display font-bold text-primary text-amber-glow">
                  {aliases.length}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1">عناوين نشطة</div>
              </div>
              <div className="text-center border border-border/50 p-4 bg-card/30 backdrop-blur-sm">
                <div className="text-2xl font-display font-bold text-primary text-amber-glow">5s</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1">تحديث تلقائي</div>
              </div>
              <div className="text-center border border-border/50 p-4 bg-card/30 backdrop-blur-sm">
                <div className="text-2xl font-display font-bold text-primary text-amber-glow">&infin;</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1">عناوين متاحة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-6 sm:py-8">
          {/* Email Display with Custom Input */}
          <EmailDisplay
            email={email}
            domain={domain}
            isCreating={isCreating}
            onGenerateNew={generateNewEmail}
            onCreateCustom={createCustomEmail}
          />

          {/* Aliases List */}
          <AliasList
            aliases={aliases}
            activeAliasId={activeAliasId}
            onSwitch={switchToAlias}
            onRemove={removeAlias}
          />

          {/* Inbox / Message View */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <MessageView
                  key="message-view"
                  message={selectedMessage}
                  onBack={clearSelectedMessage}
                />
              ) : (
                <motion.div
                  key="message-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <MessageList
                    messages={messages}
                    selectedId={null}
                    onSelect={fetchMessageDetails}
                    onDelete={deleteMessage}
                    isFetching={isFetchingMessages}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* How It Works */}
          {!selectedMessage && <HowItWorks />}
        </div>
      </main>

      {/* Features Section */}
      {!selectedMessage && (
        <section className="border-t border-border">
          <div className="container py-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-4 bg-primary" />
              <span className="text-xs font-mono text-primary tracking-widest uppercase">
                المميزات
              </span>
            </div>

            <div
              className="relative border border-border overflow-hidden"
              style={{
                backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663392107353/RAwE89A4Czx9WKKJj2ihLV/inbox-illustration-jpcajKnD5yqKx2QkUSHzTi.webp)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-background/90" />
              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-border">
                {[
                  { title: 'اسم مخصص', desc: 'اختر اسم المستخدم الذي تريده لبريدك المؤقت' },
                  { title: 'عناوين غير محدودة', desc: 'أنشئ عدداً غير محدود من العناوين وتنقل بينها' },
                  { title: 'رسائل حقيقية', desc: 'استقبل رسائل تحقق وتأكيد من أي موقع' },
                  { title: 'خصوصية تامة', desc: 'البريد مؤقت ويُحذف تلقائياً لحماية خصوصيتك' },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6"
                  >
                    <div className="text-[32px] font-display font-bold text-primary/10 leading-none mb-2">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
