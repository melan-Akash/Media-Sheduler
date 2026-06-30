import { Link } from 'react-router-dom'
import { ArrowRight, Mail, SendHorizonal, Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'

import img1 from '../../assets/img-1.jpg'
import img2 from '../../assets/img-2.jpg'
import img3 from '../../assets/img-3.jpg'
import img4 from '../../assets/img-4.jpg'

const slides = [
    { id: 1, img: img1, title: 'Async Awakenings', author: 'Nina Netcode' },
    { id: 2, img: img2, title: 'The Art of Reusability', author: 'Lena Logic' },
    { id: 3, img: img3, title: 'Stateful Symphony', author: 'Beth Binary' },
    { id: 4, img: img4, title: 'Digital Harmony', author: 'Dev Dynamics' },
    { id: 5, img: img2, title: 'Creative Coding', author: 'Art Algorithm' },
]

export default function Hero() {
    const [activeIndex, setActiveIndex] = useState(0)

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
    }

    // Auto-play slider every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide()
        }, 4000)
        return () => clearInterval(interval)
    }, [activeIndex]) // Reset interval on manual slide change to prevent rapid double-slides

    return (
        <section className="relative overflow-hidden bg-white">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Soft Red Brand Glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.03)_0%,transparent_75%)] pointer-events-none" />

            <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Content Column (Left - 5 Cols) */}
                    <div className="relative z-10 lg:col-span-5 text-center lg:text-left">
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
                        <h1 className="mt-6 text-balance text-4xl font-bold md:text-5xl xl:text-6xl font-serif text-slate-900 leading-tight">
                            Production Ready Digital Marketing blocks
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="mt-6 text-slate-500 text-sm md:text-base leading-relaxed">
                            Error totam sit illum. Voluptas doloribus asperiores quaerat aperiam. Quidem harum omnis beatae ipsum soluta!
                        </p>

                        <div>
                            {/* Email Signup Form */}
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="mx-auto my-6 max-w-sm lg:my-8 lg:ml-0 lg:mr-auto">
                                <div className="bg-white relative grid grid-cols-[1fr_auto] items-center rounded-2xl border border-slate-200 p-1.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-400">
                                    <Mail className="text-slate-400 pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                                    <input
                                        placeholder="Your mail address"
                                        className="h-11 w-full bg-transparent pl-12 pr-4 text-sm text-slate-800 focus:outline-none placeholder-slate-400"
                                        type="email"
                                        required
                                    />

                                    <div>
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center h-9 px-4 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 active:scale-98 shadow-sm transition-all"
                                            aria-label="submit"
                                        >
                                            <span className="hidden md:block">Get Started</span>
                                            <SendHorizonal
                                                className="relative mx-auto size-4 md:hidden"
                                                strokeWidth={2}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Features List */}
                            <ul className="space-y-2.5 text-left w-fit mx-auto lg:ml-0">
                                {[
                                    'Faster',
                                    'Modern',
                                    '100% Customizable'
                                ].map((feat) => (
                                    <li key={feat} className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-slate-700">
                                        <span className="size-5 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0">
                                            <Check className="size-3" strokeWidth={3} />
                                        </span>
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Interactive Slider Column (Right - 7 Cols) */}
                    <div className="lg:col-span-7 relative flex flex-col items-center">
                        {/* Main Slider Box */}
                        <div className="relative w-full bg-white border border-slate-100 shadow-xl shadow-slate-100/80 rounded-3xl p-6 md:p-8">
                            
                            {/* Header: Actions */}
                            <div className="flex items-center justify-end mb-6">
                                <Link 
                                    to="/ai-composer" 
                                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Try AI Composer</span>
                                </Link>
                            </div>

                            {/* Left/Right Slider Buttons */}
                            <button 
                                onClick={prevSlide}
                                className="absolute left-2 md:left-4 top-[52%] -translate-y-1/2 z-20 size-8 md:size-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-all shadow-md"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="size-4 md:size-5" />
                            </button>

                            <button 
                                onClick={nextSlide}
                                className="absolute right-2 md:right-4 top-[52%] -translate-y-1/2 z-20 size-8 md:size-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-all shadow-md"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="size-4 md:size-5" />
                            </button>

                            {/* Cards Track */}
                            <div className="overflow-hidden w-full px-4 md:px-6 py-2">
                                <div 
                                    className="flex gap-5 transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${activeIndex * 270}px)` }}
                                >
                                    {slides.map((slide, idx) => {
                                        const isLeft = idx < activeIndex;
                                        return (
                                            <div 
                                                key={idx} 
                                                className={`w-[250px] shrink-0 bg-white border border-slate-100 rounded-2xl p-2.5 shadow-xs transition-all duration-350 ${
                                                    isLeft ? 'opacity-25 scale-95' : 'opacity-100 scale-100'
                                                }`}
                                            >
                                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50">
                                                    <img 
                                                        src={slide.img} 
                                                        alt={slide.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="pt-3.5 pb-1 px-1.5">
                                                    <h4 className="text-sm font-bold text-slate-850 truncate">{slide.title}</h4>
                                                    <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{slide.author}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Bottom Thumbnail Indicators */}
                            <div className="flex gap-2.5 justify-center mt-6">
                                {slides.map((slide, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setActiveIndex(idx)}
                                        className={`size-10 md:size-12 rounded-xl overflow-hidden border-2 transition-all ${
                                            activeIndex === idx 
                                                ? 'border-red-500 scale-108 ring-2 ring-red-50 shadow-md' 
                                                : 'border-transparent opacity-50 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={slide.img} alt="thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
