import { Link } from 'react-router-dom'
import { ArrowRight, Mail, SendHorizonal, Check } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-white">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

            {/* Soft Red Brand Glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.04)_0%,transparent_75%)] pointer-events-none" />

            <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
                <div className="lg:flex lg:items-center lg:gap-12">
                    {/* Content Column (Left) */}
                    <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                        {/* New Feature Badge */}
                        <Link
                            to="/login"
                            className="rounded-full mx-auto flex w-fit items-center gap-2 border border-red-100 bg-red-50/50 p-1.5 pr-4.5 lg:ml-0 hover:bg-red-50 transition-colors">
                            <span className="bg-red-500 text-white rounded-full px-2.5 py-0.5 text-xs font-bold font-sans">New</span>
                            <span className="text-xs font-semibold text-red-600">Introduction Tailark Html</span>
                            <span className="bg-red-200 block h-3 w-px"></span>
                            <ArrowRight className="size-3 text-red-500" />
                        </Link>

                        {/* Title */}
                        <h1 className="mt-8 text-balance text-4xl font-bold md:text-5xl xl:text-6xl font-serif text-slate-900 leading-tight">
                            Production Ready Digital Marketing blocks
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="mt-6 text-slate-500 text-base leading-relaxed">
                            Error totam sit illum. Voluptas doloribus asperiores quaerat aperiam. Quidem harum omnis beatae ipsum soluta!
                        </p>

                        <div>
                            {/* Email Signup Form */}
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="mx-auto my-8 max-w-sm lg:my-10 lg:ml-0 lg:mr-auto">
                                <div className="bg-white relative grid grid-cols-[1fr_auto] items-center rounded-2xl border border-slate-200 p-1.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-400">
                                    <Mail className="text-slate-400 pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                                    <input
                                        placeholder="Your mail address"
                                        className="h-12 w-full bg-transparent pl-12 pr-4 text-sm text-slate-800 focus:outline-none placeholder-slate-400"
                                        type="email"
                                        required
                                    />

                                    <div>
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center h-10 px-5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 active:scale-98 shadow-sm transition-all"
                                            aria-label="submit"
                                        >
                                            <span className="hidden md:block">Get Started</span>
                                            <SendHorizonal
                                                className="relative mx-auto size-4.5 md:hidden"
                                                strokeWidth={2}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Features List */}
                            <ul className="space-y-3 text-left w-fit mx-auto lg:ml-0">
                                {[
                                    'Faster',
                                    'Modern',
                                    '100% Customizable'
                                ].map((feat) => (
                                    <li key={feat} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                                        <span className="size-5 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0">
                                            <Check className="size-3" strokeWidth={3} />
                                        </span>
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Illustration Image (Right/Overlay) */}
                <div className="absolute inset-y-0 right-0 left-auto w-full lg:w-1/2 pointer-events-none z-0 hidden lg:block">
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-10 w-48" />
                    <div className="relative h-full flex items-center justify-end p-6">
                        <img
                            className="hidden dark:block object-contain max-h-[85%] rounded-2xl shadow-2xl"
                            src="https://tailark.com/_next/image?url=%2Fmusic.png&w=3840&q=75"
                            alt="app illustration"
                            width={2796}
                            height={2008}
                        />
                        <img
                            className="dark:hidden object-contain max-h-[85%] rounded-2xl shadow-xl border border-slate-100"
                            src="https://tailark.com/_next/image?url=%2Fmusic-light.png&w=3840&q=75"
                            alt="app illustration"
                            width={2796}
                            height={2008}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
