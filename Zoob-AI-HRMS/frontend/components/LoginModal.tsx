"use client";

import Link from "next/link";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-slate-900 p-8 rounded-2xl w-[420px] text-white">

        <h2 className="text-3xl font-bold text-cyan-400 text-center mb-8">
          Login Portal
        </h2>

        <div className="space-y-4">

          <Link href="/employee/login">
            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg">
              👨‍💼 Employee Login
            </button>
          </Link>

          <Link href="/hr/login">
            <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg">
              👩‍💼 HR Login
            </button>
          </Link>

          <Link href="/admin/login">
            <button className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-lg">
              🛡️ Admin Login
            </button>
          </Link>

        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full border border-gray-600 py-3 rounded-lg hover:bg-gray-700"
        >
          Close
        </button>

      </div>
    </div>
  );
}