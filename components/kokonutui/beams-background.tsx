"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedGradientBackgroundProps {
  className?: string
  children?: React.ReactNode
  intensity?: "subtle" | "medium" | "strong"
}

interface Beam {
  x: number
  y: number
  width: number
  length: number
  angle: number
  speed: number
  opacity: number
  hue: number
  pulse: number
  pulseSpeed: number
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle: angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  }
}

export default function BeamsBackground({ className, intensity = "strong" }: AnimatedGradientBackgroundProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0) // 1 for next, -1 for prev
  const pages = [
    {
      title: "你懂行业，有经验，有洞察",
      subtitle:
        "比如：\n\n你有丰富的求职经验以及留学经历，同时有自己对行业的认知和思考。\n\n你想做自媒体，做求职博主/留学博主/AI 博主，想建立个人 ip。\n\n但工作忙碌，这些宝贵的认知并没有让其他人看到。",
    },
    {
      title: "我爱思考，想学习，想求知",
      subtitle:
        "比如：\n\n我希望看到大家真实的思考，有趣的观点，甚至是所谓的暴论，来启发我的思考。\n\n但当今的互联网被情绪淹没，有观点的人不敢发声，劣质自媒体大肆卖课。\n\n我只能在垃圾堆里挖掘有价值的信息，如果能看到他人的思维模式，就更好了。",
    },
    {
      title: "KnowHow",
      subtitle: "说出来，就是价值",
      showImage: true,
    },
    {
      title: "创作",
      subtitle: "无感输入，整理思绪",
      description: "您有了绝妙的思考，立马语音记录下来。我们为您组织整理成个人知识库。",
      showPhones: true,
    },
    {
      title: "创作",
      subtitle: "自动分发，睡后收入",
      description:
        "我们会自动分发您知识库里的文章，推荐给感兴趣的用户。世界会看到您的思考，同时用户会为您的文章以及个人知识库付费。整个过程，完全不需要人来费心。",
    },
    {
      title: "学习",
      subtitle: "优质信息，真实思考",
      description:
        "您能看到每个亲身经历者，行业从业者，最真实的思考。想创业？看看创业者在做什么，想什么。你能学习到前辈的思维框架，看到最直观的知识图谱。",
      showLearning: true,
    },
    {
      title: "",
      subtitle: "最方便的知识库",
      description: "",
      showFinal: true,
    },
    {
      title: "KnowHow",
      subtitle: "说出来，就是价值",
      showTextOnly: true,
    },
  ]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const beamsRef = useRef<Beam[]>([])
  const animationFrameRef = useRef<number>(0)
  const MINIMUM_BEAMS = 20

  const opacityMap = {
    subtle: 0.7,
    medium: 0.85,
    strong: 1,
  }

  const nextPage = () => {
    setDirection(1)
    setCurrentPage((prev) => (prev + 1) % pages.length)
  }

  const prevPage = () => {
    setDirection(-1)
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)

      const totalBeams = MINIMUM_BEAMS * 1.5
      beamsRef.current = Array.from({ length: totalBeams }, () => createBeam(canvas.width, canvas.height))
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam

      const column = index % 3
      const spacing = canvas.width / 3

      beam.y = canvas.height + 100
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5
      beam.width = 100 + Math.random() * 100
      beam.speed = 0.5 + Math.random() * 0.4
      beam.hue = 120 + Math.random() * 60 // 绿色系
      beam.opacity = 0.2 + Math.random() * 0.1
      return beam
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save()
      ctx.translate(beam.x, beam.y)
      ctx.rotate((beam.angle * Math.PI) / 180)

      // Calculate pulsing opacity
      const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity]

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length)

      // Enhanced gradient with multiple color stops
      gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`)
      gradient.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`)
      gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`)
      gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`)
      gradient.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`)
      gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length)
      ctx.restore()
    }

    function animate() {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.filter = "blur(35px)"

      const totalBeams = beamsRef.current.length
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed
        beam.pulse += beam.pulseSpeed

        // Reset beam when it goes off screen
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams)
        }

        drawBeam(ctx, beam)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [intensity])

  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
        className,
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0" style={{ filter: "blur(15px)" }} />

      <motion.div
        className="absolute inset-0 bg-white/10"
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{
          backdropFilter: "blur(50px)",
        }}
      />

      <div className="relative z-10 flex h-screen w-full items-center justify-center">
        <motion.div
          key={currentPage}
          className="flex flex-col items-center justify-center gap-6 px-4 text-center"
          initial={{
            opacity: 0,
            x: direction > 0 ? 100 : direction < 0 ? -100 : 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          exit={{
            opacity: 0,
            x: direction > 0 ? -100 : direction < 0 ? 100 : 0,
            y: -20,
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {currentPage === 2 ? (
            <div className="flex flex-row items-center justify-center gap-12 px-8 text-center max-w-7xl mx-auto h-full py-8">
              <div className="flex-1 flex flex-col items-center justify-center px-10">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-800 tracking-tight leading-tight font-serif mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {pages[currentPage].title}
                </motion.h1>
                <motion.p
                  className="text-2xl md:text-3xl lg:text-4xl text-gray-600 font-light tracking-wide"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {pages[currentPage].subtitle}
                </motion.p>
              </div>
              <div className="flex-1 flex items-center justify-center opacity-100 shadow-none">
                <img
                  src="/knowhow-app.png"
                  alt="KnowHow App Interface"
                  className="w-full max-w-sm h-auto rounded-2xl shadow-2xl border border-white/20"
                />
              </div>
            </div>
          ) : currentPage === 3 ? (
            <div className="flex flex-col items-center justify-center gap-12 px-8 text-center max-w-7xl mx-auto h-full py-8">
              <div className="flex flex-col items-center justify-center text-center">
                <motion.h1
                  className="text-6xl lg:text-8xl font-light text-gray-800 tracking-tight leading-none mb-6 md:text-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {pages[currentPage].title}
                </motion.h1>
                <motion.h2
                  className="lg:text-4xl font-semibold text-gray-800 tracking-tight leading-tight mb-4 font-serif text-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {pages[currentPage].subtitle}
                </motion.h2>
                <motion.p
                  className="text-gray-600 leading-relaxed max-w-2xl font-extralight text-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {pages[currentPage].description}
                </motion.p>
              </div>
              <div className="flex items-center justify-center gap-6">
                <img
                  src="/phone-1.png"
                  alt="KnowHow Phone 1"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
                <img
                  src="/phone-2.png"
                  alt="KnowHow Phone 2"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
                <img
                  src="/phone-3.png"
                  alt="KnowHow Phone 3"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
                <img
                  src="/phone-4.png"
                  alt="KnowHow Phone 4"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
                <img
                  src="/phone-5.png"
                  alt="KnowHow Phone 5"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
              </div>
            </div>
          ) : currentPage === 4 ? (
            <div className="flex flex-col items-center justify-center gap-12 px-8 text-center max-w-7xl mx-auto h-full py-8">
              <div className="flex flex-col items-center justify-center text-center">
                <motion.h1
                  className="text-6xl lg:text-8xl font-light text-gray-800 tracking-tight leading-none mb-6 md:text-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {pages[currentPage].title}
                </motion.h1>
                <motion.h2
                  className="lg:text-4xl font-semibold text-gray-800 tracking-tight leading-tight mb-4 font-serif text-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {pages[currentPage].subtitle}
                </motion.h2>
                <motion.p
                  className="text-gray-600 leading-relaxed max-w-2xl font-extralight text-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {pages[currentPage].description}
                </motion.p>
              </div>
              <div className="flex items-center justify-center gap-8">
                <img
                  src="/distribution-1.png"
                  alt="Distribution Phone 1"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
                <img
                  src="/distribution-2.png"
                  alt="Distribution Phone 2"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
                <img
                  src="/distribution-3.png"
                  alt="Distribution Phone 3"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
              </div>
            </div>
          ) : currentPage === 5 ? (
            <div className="flex flex-col items-center justify-center gap-12 px-8 text-center max-w-7xl mx-auto h-full py-8">
              <div className="flex flex-col items-center justify-center text-center">
                <motion.h1
                  className="text-6xl lg:text-8xl font-light text-gray-800 tracking-tight leading-none mb-6 md:text-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {pages[currentPage].title}
                </motion.h1>
                <motion.h2
                  className="lg:text-4xl font-semibold text-gray-800 tracking-tight leading-tight mb-4 font-serif text-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {pages[currentPage].subtitle}
                </motion.h2>
                <motion.p
                  className="text-gray-600 leading-relaxed max-w-2xl font-extralight text-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {pages[currentPage].description}
                </motion.p>
              </div>
              <div className="flex items-center justify-center gap-8">
                <img
                  src="/learning-1.png"
                  alt="Learning Phone 1"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
                <img
                  src="/learning-2.png"
                  alt="Learning Phone 2"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
                <img
                  src="/learning-3.png"
                  alt="Learning Phone 3"
                  className="w-32 md:w-40 lg:w-48 h-auto rounded-2xl shadow-lg border border-white/20"
                />
              </div>
            </div>
          ) : currentPage === 6 ? (
            <div className="flex flex-col items-center justify-center gap-8 px-8 text-center max-w-7xl mx-auto h-full py-8">
              <motion.h1
                className="lg:text-4xl font-semibold text-gray-800 tracking-tight leading-tight font-serif mb-8 text-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {pages[currentPage].subtitle}
              </motion.h1>
              <div className="flex flex-row items-center justify-center gap-12 w-full">
                <div className="flex flex-col items-center justify-center gap-6">
                  <motion.h2
                    className="text-xl md:text-2xl text-gray-700 tracking-tight font-extralight mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    记录知识
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <img
                      src="/final-left.png"
                      alt="记录知识 - KnowHow主界面"
                      className="w-48 md:w-56 lg:w-64 h-auto rounded-2xl shadow-2xl border border-white/20"
                    />
                  </motion.div>
                </div>
                <div className="flex flex-col items-center justify-center gap-6">
                  <motion.h2
                    className="text-xl md:text-2xl text-gray-700 tracking-tight font-extralight mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    获取知识
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <img
                      src="/final-right.png"
                      alt="获取知识 - 社区推荐界面"
                      className="w-48 md:w-56 lg:w-64 h-auto rounded-2xl shadow-2xl border border-white/20"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          ) : currentPage === 7 ? (
            <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-800 tracking-tight leading-tight font-serif"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {pages[currentPage].title}
              </motion.h1>
              <motion.p
                className="text-2xl md:text-3xl lg:text-4xl text-gray-600 font-light tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {pages[currentPage].subtitle}
              </motion.p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-800 tracking-tight leading-tight font-serif"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {pages[currentPage].title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed whitespace-pre-line max-w-4xl font-extralight shadow-inner tracking-normal leading-7 border-0 rounded-2xl my-9 py-6 px-0 mx-0.5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {pages[currentPage].subtitle}
              </motion.p>
            </div>
          )}
        </motion.div>
      </div>
      {/* 左侧切换按钮 */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <motion.button
          onClick={prevPage}
          className="group relative overflow-hidden rounded-full bg-white/20 backdrop-blur-md border border-white/30 p-4 shadow-lg hover:bg-white/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </div>
      {/* 右侧切换按钮 */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20">
        <motion.button
          onClick={nextPage}
          className="group relative overflow-hidden rounded-full bg-white/20 backdrop-blur-md border border-white/30 p-4 shadow-lg hover:bg-white/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* 页面指示器 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentPage ? 1 : -1)
              setCurrentPage(index)
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentPage ? "bg-gray-700 w-8" : "bg-gray-400 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
