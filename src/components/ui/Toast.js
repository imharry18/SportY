// src/components/ui/Toast.jsx
'use client';
import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Disappears after 4 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = type === 'error' 
    ? 'border-red-500/50 bg-red-950/30 text-red-200' 
    : 'border-green-500/50 bg-green-950/30 text-green-200';

  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5 duration-300 ${styles} min-w-[320px]`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}