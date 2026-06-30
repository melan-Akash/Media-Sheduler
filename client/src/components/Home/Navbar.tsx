import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
    const [menuState, setMenuState] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <nav
                data-state={menuState ? 'active' : 'inactive'}
                className="group w-full">
                <div className="m-auto max-w-6xl px-6">
                    <div className="flex flex-wrap items-center justify-between gap-6 py-3.5 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                to="/"
                                onClick={() => {
                                    setMenuState(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-slate-700">
                                {menuState ? (
                                    <X className="size-6 transition-transform duration-200" />
                                ) : (
                                    <Menu className="size-6 transition-transform duration-200" />
                                )}
                            </button>
                        </div>

                        {/* Navigation Links & Buttons */}
                        <div className={`
                            w-full lg:w-auto lg:flex lg:items-center lg:gap-6
                            ${menuState ? 'block' : 'hidden'} 
                            mt-4 lg:mt-0 bg-white lg:bg-transparent p-6 lg:p-0 
                            rounded-2xl border border-slate-100 lg:border-none 
                            shadow-xl shadow-slate-200/50 lg:shadow-none
                        `}>
                            <div className="lg:pr-4">
                                <ul className="space-y-5 text-base font-medium lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.href}
                                                onClick={() => setMenuState(false)}
                                                className="text-slate-600 hover:text-red-500 block duration-150">
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTAs */}
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:border-slate-100 lg:pl-6 mt-6 lg:mt-0">
                                <Link
                                    to="/login"
                                    onClick={() => setMenuState(false)}
                                    className="flex items-center justify-center h-9 px-4 rounded-full text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                                    Login
                                </Link>

                                <Link
                                    to="/login"
                                    onClick={() => setMenuState(false)}
                                    className="flex items-center justify-center h-9 px-4 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 shadow-xs hover:shadow-md transition-all">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = () => {
    return (
        <div className="flex items-center gap-2.5">
            <svg
                viewBox="0 10 62 62"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 shrink-0">
                <path
                    d="M47.06 10H14.94C6.689 10 0 16.689 0 24.94v32.12C0 65.311 6.689 72 14.94 72h32.12C55.311 72 62 65.311 62 57.06V24.94C62 16.689 55.311 10 47.06 10"
                    fill="#EF4444"
                />
                <path
                    d="M33 57c8.836 0 16-7.163 16-16s-7.164-16-16-16 0 7.163 0 16-8.837 16 0 16"
                    fill="#fff"
                />
                <circle cx="21" cy="41" r="7" fill="#fff" />
            </svg>
            <span className="text-lg font-bold text-slate-850 tracking-tight font-sans">
                Media Scheduler
            </span>
        </div>
    )
}
