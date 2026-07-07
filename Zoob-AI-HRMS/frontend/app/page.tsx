"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Target, Zap, Users, Calendar, Clock, CreditCard, ShieldCheck, Sparkles, Network, ChevronRight, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500 selection:text-white bg-slate-50 relative scroll-smooth">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="Zoob AI Solutions Logo" 
                fill 
                className="object-contain p-1"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                Zoob AI
                <span className="hidden sm:inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-indigo-600 border border-indigo-100">
                  SOLUTIONS
                </span>
              </h1>
            </div>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              <Link href="#about" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full">About Us</Link>
              <Link href="#hrms" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full">HRMS Platform</Link>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="group relative inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center w-full pt-32">
        {/* Hero Section */}
        <section className="relative w-full pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 text-center min-h-[80vh] flex flex-col justify-center">
          <div className="relative z-10 text-center max-w-5xl mx-auto">
            <div className="animate-[fade-in-down_1s_ease-out]">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/50 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-indigo-700 mb-8 shadow-sm cursor-default hover:bg-indigo-50 transition-colors">
                <Sparkles className="h-4 w-4 text-indigo-500" /> Defining the future of Enterprise AI
              </div>
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl lg:text-[5rem] pb-4 leading-[1.1] animate-[fade-in-up_1s_ease-out_0.2s_both]">
              Accelerate your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 relative inline-block">
                AI Transformation
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-200/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h1>
            
            <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed font-medium animate-[fade-in-up_1s_ease-out_0.4s_both]">
              We empower organizations to harness the latest advancements in Artificial Intelligence to transform their digital infrastructure, business processes, and decision-making capabilities.
            </p>
            
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row animate-[fade-in-up_1s_ease-out_0.6s_both]">
              <Link 
                href="#about" 
                className="group inline-flex justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:shadow-2xl hover:shadow-indigo-600/30 hover:-translate-y-1 active:translate-y-0"
              >
                Discover Our Impact <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/login" 
                className="group inline-flex justify-center items-center gap-2 rounded-2xl bg-white border border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md hover:-translate-y-1 active:translate-y-0"
              >
                Access HRMS Portal <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* About & Mission Section */}
        <section id="about" className="w-full py-12 px-4 sm:px-6 lg:px-8 relative bg-white border-y border-slate-100 scroll-mt-20">
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-start">
              
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase mb-6 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                  <Network className="h-4 w-4" /> Who we are
                </div>
                
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-8 leading-[1.15]">
                  Driving <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">sustainable growth</span> through innovation.
                </h2>
                
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
                  <p>
                    We specialize in helping enterprises accelerate their AI adoption journey through <span className="font-bold text-slate-900 bg-slate-100 px-1 rounded">intelligent automation</span>, <span className="font-bold text-slate-900 bg-slate-100 px-1 rounded">computer vision</span>, <span className="font-bold text-slate-900 bg-slate-100 px-1 rounded">generative AI</span>, and <span className="font-bold text-slate-900 bg-slate-100 px-1 rounded">data-driven solutions</span>.
                  </p>
                  <p>
                    Our mission is to make AI accessible, practical, and impactful for businesses of all sizes. We focus on delivering real-world AI solutions that solve complex business challenges, create measurable value, and drive sustainable growth. 
                  </p>
                  <Link href="/register" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors group mt-4">
                    Join our team <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 grid gap-6 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-cyan-50 rounded-3xl -rotate-3 scale-105 -z-10 border border-slate-100"></div>
                
                <div className="rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
                      <Target className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    To accelerate the AI transformation of organizations worldwide by making advanced AI technologies practical, affordable, and deeply accessible to everyone.
                  </p>
                </div>
                
                <div className="rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all hover:-translate-y-1 translate-x-0 lg:translate-x-8">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 border border-cyan-100 text-cyan-600 shadow-sm">
                      <Zap className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    To develop and deploy innovative AI solutions that exponentially enhance productivity, improve decision-making, and enable operational excellence at scale.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HRMS Platform Section */}
        <section id="hrms" className="w-full py-12 px-4 sm:px-6 lg:px-8 relative scroll-mt-20">
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase mb-6 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <Bot className="h-4 w-4" /> Internal Solutions
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">Zoob AI HRMS</h2>
              <p className="text-xl text-slate-600 font-medium">
                A state-of-the-art Human Resource Management System designed to empower our workforce, streamline operations, and deliver incredible experiences.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Users />, title: "Employee Lifecycle", desc: "Manage onboarding, profiles, secure document storage, and roles effortlessly.", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
                { icon: <Clock />, title: "Attendance Tracking", desc: "Real-time daily check-ins, check-outs, and presence monitoring for all staff.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                { icon: <Calendar />, title: "Leave Management", desc: "Submit, track, and approve leave requests efficiently with instant status updates.", color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
                { icon: <CreditCard />, title: "Payroll Intelligence", desc: "Automated payroll calculation based on attendance and approved leave data.", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" }
              ].map((feature, i) => (
                <div key={i} className={`rounded-3xl bg-white border ${feature.border} p-8 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-2 group cursor-pointer`}>
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-24 rounded-[2.5rem] bg-slate-900 p-10 sm:p-16 lg:p-20 text-center lg:text-left lg:flex lg:items-center lg:justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="max-w-2xl flex items-start gap-8 relative z-10">
                <div className="hidden sm:flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-xl">
                  <ShieldCheck className="h-10 w-10 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">Secure & Intelligent <br/>HR Operations</h3>
                  <p className="text-slate-300 text-lg font-medium leading-relaxed">Access the Zoob AI internal HRMS to securely manage your profile, log attendance seamlessly, and view your payroll records with zero hassle.</p>
                </div>
              </div>
              <div className="mt-10 lg:mt-0 flex shrink-0 justify-center lg:justify-end relative z-10">
                <Link 
                  href="/login" 
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-slate-900 transition-all hover:bg-slate-50 hover:scale-105 shadow-xl active:scale-95"
                >
                  Open HRMS App <ChevronRight className="h-5 w-5 text-indigo-600 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="w-full bg-slate-950 text-slate-300 py-16 sm:py-24 border-t border-slate-900 relative overflow-hidden mt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6 group inline-flex">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white p-1">
                  <Image src="/logo.png" alt="Zoob AI Logo" fill className="object-contain p-1" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">Zoob AI</span>
              </Link>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-8">
                Empowering organizations to harness the latest advancements in Artificial Intelligence for transformative digital infrastructure.
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all text-slate-400 font-bold text-sm">X</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all text-slate-400 font-bold text-sm">Git</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all text-slate-400 font-bold text-sm">In</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link href="/login" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">HRMS Platform</Link></li>
                <li><Link href="/login" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Features</Link></li>
                <li><Link href="/login" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Security</Link></li>
                <li><Link href="/login" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Enterprise</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link href="#about" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">About Us</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Careers</Link></li>
                <li><Link href="/login" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Blog</Link></li>
                <li><a href="mailto:contact@zoob.ai" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Stay Updated</h4>
              <p className="text-slate-400 text-sm mb-4">Subscribe to our newsletter for the latest AI insights.</p>
              <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to Zoob AI insights!"); (e.target as HTMLFormElement).reset(); }}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input type="email" required placeholder="Enter your email" className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 font-medium">
              © {new Date().getFullYear()} Zoob AI Solutions Pvt Ltd. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/login" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">Privacy Policy</Link>
              <Link href="/login" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">Terms of Service</Link>
              <Link href="/login" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}