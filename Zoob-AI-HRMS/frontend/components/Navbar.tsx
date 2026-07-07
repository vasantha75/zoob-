"use client";

type NavbarProps = {
  onLoginClick: () => void;
};

export default function Navbar({ onLoginClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-950/90 backdrop-blur-md text-white z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        <h1 className="text-3xl font-bold text-cyan-400">
          Zoob AI
        </h1>

        <ul className="hidden md:flex gap-8 font-medium">
          <li><a href="#">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#platform">Platform</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <button
          onClick={onLoginClick}
          className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg transition"
        >
          Login
        </button>

      </div>
    </nav>
  );
}