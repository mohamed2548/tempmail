/**
 * Dark Industrial Design - How It Works Component
 * Step-by-step guide with industrial numbered steps
 */
import { Copy, Globe, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    icon: Copy,
    title: 'انسخ البريد',
    desc: 'انسخ عنوان البريد المؤقت الذي تم إنشاؤه تلقائياً',
  },
  {
    num: '02',
    icon: Globe,
    title: 'استخدمه للتسجيل',
    desc: 'استخدم البريد للتسجيل في أي موقع مثل ChatGPT وغيره',
  },
  {
    num: '03',
    icon: Inbox,
    title: 'استقبل الرسائل',
    desc: 'ستظهر رسائل التحقق والتأكيد هنا تلقائياً خلال ثوانٍ',
  },
];

export default function HowItWorks() {
  return (
    <div className="relative mt-8">
      {/* Section Label */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-4 bg-primary" />
        <span className="text-xs font-mono text-primary tracking-widest uppercase">
          كيف يعمل
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
            className="relative border border-border bg-[oklch(0.13_0.005_260)] p-5 group hover:border-primary/30 transition-all duration-200"
          >
            {/* Number */}
            <span className="absolute top-3 left-3 text-[40px] font-display font-bold text-primary/[0.07] leading-none select-none">
              {step.num}
            </span>

            <div className="relative z-10">
              <div className="w-9 h-9 border border-primary/20 flex items-center justify-center mb-3 group-hover:border-primary/40 transition-colors">
                <step.icon className="w-4 h-4 text-primary/70" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
