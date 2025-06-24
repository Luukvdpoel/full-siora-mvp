"use client";
import { motion } from "framer-motion";

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <motion.svg
      className={`animate-spin h-6 w-6 text-indigo-500 ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </motion.svg>
  );
}
