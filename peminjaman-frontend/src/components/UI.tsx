import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Card({ children, className = '', hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return <div className={`glass rounded-2xl p-5 ${hover ? 'lift' : ''} ${className}`}>{children}</div>;
}

export function PageHeader({
  title, subtitle, actions,
}: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text"
        >
          {title}
        </motion.h1>
        {subtitle && <p className="text-purple-700/65 mt-1.5 text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function Button({
  variant = 'primary', children, className = '', ...rest
}: { variant?: 'primary' | 'ghost' | 'danger' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ripple';
  const styles = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    danger: 'bg-rose-500/10 border border-rose-300/60 text-rose-600 hover:bg-rose-500 hover:text-white hover:border-rose-500',
  }[variant];
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${styles} ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input w-full px-4 py-2.5 rounded-xl text-sm ${props.className || ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`input w-full px-4 py-2.5 rounded-xl text-sm ${props.className || ''}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`input w-full px-4 py-2.5 rounded-xl text-sm ${props.className || ''}`} />;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-bold text-purple-800/75 mb-1.5 block uppercase tracking-wide">{children}</label>;
}

export function Modal({
  open, onClose, title, children, size = 'md',
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'md' | 'lg' | 'xl' }) {
  const sizes = { md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-900/30 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className={`glass-strong rounded-3xl w-full ${sizes} max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-200/50">
              <h3 className="text-lg font-bold gradient-text">{title}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-pink-100 text-purple-600"><X size={18} /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Badge({ children, color = 'violet' }: { children: React.ReactNode; color?: 'violet' | 'green' | 'amber' | 'red' | 'blue' | 'gray' | 'pink' }) {
  const map = {
    violet: 'bg-violet-100 text-violet-700 border-violet-200',
    pink:   'bg-pink-100 text-pink-700 border-pink-200',
    green:  'bg-emerald-100 text-emerald-700 border-emerald-200',
    amber:  'bg-amber-100 text-amber-700 border-amber-200',
    red:    'bg-rose-100 text-rose-700 border-rose-200',
    blue:   'bg-sky-100 text-sky-700 border-sky-200',
    gray:   'bg-gray-100 text-gray-700 border-gray-200',
  }[color];
  return <span className={`badge ${map}`}>{children}</span>;
}

export function EmptyState({ title, desc, icon = '🌸' }: { title: string; desc?: string; icon?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-14 text-purple-600/60"
    >
      <div className="text-5xl mb-3 animate-float">{icon}</div>
      <div className="font-bold text-purple-800/80 text-base">{title}</div>
      {desc && <div className="text-sm mt-1 text-purple-700/55">{desc}</div>}
    </motion.div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

/* Simple Rich Text editor using contentEditable */
export function RichEditor({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  return (
    <div className="input rounded-xl overflow-hidden p-0">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-purple-200/40 bg-pink-50/40">
        {[
          { l: 'B', cmd: 'bold', cls: 'font-bold' },
          { l: 'I', cmd: 'italic', cls: 'italic' },
          { l: 'U', cmd: 'underline', cls: 'underline' },
          { l: 'H2', cmd: 'formatBlock', val: 'h2', cls: 'text-xs' },
          { l: '•', cmd: 'insertUnorderedList' },
          { l: '1.', cmd: 'insertOrderedList' },
        ].map((b, i) => (
          <button key={i} type="button" onClick={() => exec(b.cmd, b.val)}
            className={`w-8 h-7 rounded-md hover:bg-pink-100 text-xs text-purple-700 ${b.cls || ''}`}>
            {b.l}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        className="px-4 py-2.5 min-h-[120px] text-sm focus:outline-none [&_h2]:text-base [&_h2]:font-semibold [&_h2]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 empty:before:content-[attr(data-placeholder)] empty:before:text-purple-400/50"
      />
    </div>
  );
}

export function ImageUpload({
  value, onChange,
}: { value?: string; onChange: (v: string | undefined) => void }) {
  const handleFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(f);
  };
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed border-pink-300/60 bg-pink-50/40 flex items-center justify-center">
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-purple-400/60 text-xs">📷</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="btn-ghost px-3 py-2 rounded-xl text-xs cursor-pointer font-semibold">
          Pilih gambar
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange(undefined)} className="text-xs text-rose-500 hover:underline font-medium">
            Hapus
          </button>
        )}
      </div>
    </div>
  );
}

/* Animated stat card */
export function StatCard({ icon: Icon, label, value, trend, color = 'pink' }: { icon: any; label: string; value: string | number; trend?: string; color?: 'pink' | 'violet' | 'blue' | 'emerald' }) {
  const colorMap = {
    pink:    { bg: 'from-pink-400 to-rose-400',     soft: 'bg-pink-100 text-pink-600' },
    violet:  { bg: 'from-violet-400 to-purple-500', soft: 'bg-violet-100 text-violet-600' },
    blue:    { bg: 'from-sky-400 to-blue-500',      soft: 'bg-sky-100 text-sky-600' },
    emerald: { bg: 'from-emerald-400 to-teal-500',  soft: 'bg-emerald-100 text-emerald-600' },
  }[color];
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320 }}
      className="glass rounded-2xl p-5 lift overflow-hidden relative"
    >
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${colorMap.bg} opacity-15 blur-2xl`} />
      <div className="flex items-center justify-between mb-3 relative">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colorMap.soft}`}>
          <Icon size={20} />
        </div>
        {trend && <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
      <div className="text-xs text-purple-700/65 font-semibold mb-1 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-extrabold text-purple-900">{value}</div>
    </motion.div>
  );
}
