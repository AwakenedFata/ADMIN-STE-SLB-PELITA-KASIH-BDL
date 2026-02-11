'use client';

import { motion, AnimatePresence } from 'motion/react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';

export default function Modal({ isOpen, onClose, title, children, className }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full max-w-lg rounded-2xl bg-white shadow-2xl glass p-6 my-8 max-h-[calc(100vh-4rem)] overflow-y-auto",
              className
            )}
          >
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/80 backdrop-blur-sm -mx-6 px-6 py-2 -mt-6 pt-6 z-10">
              <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-slate-100 transition-colors text-slate-500 hover:text-red-500"
              >
                <HiX className="text-xl" />
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
