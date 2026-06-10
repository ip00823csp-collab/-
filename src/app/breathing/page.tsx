"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Phase = "idle" | "inhale" | "hold" | "exhale" | "done";

const phaseConfig: Record<Phase, { text: string; duration: number; scale: string; color: string }> = {
  idle: { text: "准备好了吗？", duration: 0, scale: "scale-50", color: "text-stone-600" },
  inhale: { text: "慢慢吸气...", duration: 4000, scale: "scale-100", color: "text-blue-600" },
  hold: { text: "轻轻屏住...", duration: 4000, scale: "scale-100", color: "text-purple-600" },
  exhale: { text: "缓缓呼出...", duration: 6000, scale: "scale-50", color: "text-green-600" },
  done: { text: "做得真好！", duration: 0, scale: "scale-75", color: "text-orange-600" },
};

export default function BreathingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycles, setCycles] = useState(0);
  const [totalCycles, setTotalCycles] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const startExercise = () => {
    setIsActive(true);
    setCycles(0);
    runPhase("inhale", 0);
  };

  const runPhase = (newPhase: Phase, currentCycle: number) => {
    if (newPhase === "done") {
      setPhase("done");
      setIsActive(false);
      return;
    }

    setPhase(newPhase);
    const config = phaseConfig[newPhase];

    // 倒计时
    let remaining = Math.ceil(config.duration / 1000);
    setCountdown(remaining);
    countdownRef.current = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        setCountdown(remaining);
      }
    }, 1000);

    timerRef.current = setTimeout(() => {
      if (countdownRef.current) clearInterval(countdownRef.current);

      if (newPhase === "inhale") {
        runPhase("hold", currentCycle);
      } else if (newPhase === "hold") {
        runPhase("exhale", currentCycle);
      } else if (newPhase === "exhale") {
        const nextCycle = currentCycle + 1;
        setCycles(nextCycle);
        if (nextCycle >= totalCycles) {
          runPhase("done", nextCycle);
        } else {
          runPhase("inhale", nextCycle);
        }
      }
    }, config.duration);
  };

  const stopExercise = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setPhase("idle");
    setIsActive(false);
    setCountdown(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const currentConfig = phaseConfig[phase];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50 flex flex-col animate-fade-in">
      {/* 顶部导航 */}
      <div className="safe-top px-4 pt-4 flex items-center">
        <button
          onClick={() => {
            stopExercise();
            router.push("/");
          }}
          className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center active:scale-90 transition-all shadow-sm"
          aria-label="返回"
        >
          <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-elder-lg font-bold text-stone-800 pr-12">
          🌿 呼吸放松
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {phase === "idle" && (
          <div className="text-center animate-fade-in">
            <p className="text-elder-lg text-stone-700 mb-4">
              跟着小暖一起做深呼吸
            </p>
            <p className="text-elder text-stone-500 mb-2">
              吸气 → 屏住 → 呼气
            </p>
            <p className="text-base text-stone-400 mb-8">
              让身体慢慢放松下来
            </p>

            {/* 循环次数选择 */}
            <div className="flex justify-center gap-3 mb-8">
              {[3, 5, 7].map((n) => (
                <button
                  key={n}
                  onClick={() => setTotalCycles(n)}
                  className={`px-6 py-3 rounded-2xl text-elder font-bold transition-all ${
                    totalCycles === n
                      ? "bg-green-400 text-white shadow-lg"
                      : "bg-white/60 text-stone-600"
                  }`}
                >
                  {n}次
                </button>
              ))}
            </div>

            <button
              onClick={startExercise}
              className="px-12 py-5 bg-green-400 text-white text-elder-xl font-bold rounded-full shadow-xl active:scale-95 transition-all animate-pulse-warm"
            >
              开始 🌱
            </button>
          </div>
        )}

        {(phase === "inhale" || phase === "hold" || phase === "exhale") && (
          <div className="text-center animate-fade-in">
            {/* 呼吸圆圈 */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
              {/* 外层光晕 */}
              <div
                className={`absolute inset-0 breathe-circle transition-transform ease-in-out ${currentConfig.scale}`}
                style={{ transitionDuration: `${currentConfig.duration}ms` }}
              />
              {/* 中层光晕 */}
              <div
                className={`absolute w-48 h-48 rounded-full bg-green-100/50 transition-transform ease-in-out ${currentConfig.scale}`}
                style={{ transitionDuration: `${currentConfig.duration}ms` }}
              />
              {/* 内层核心 */}
              <div
                className={`absolute w-32 h-32 rounded-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center transition-transform ease-in-out ${currentConfig.scale}`}
                style={{ transitionDuration: `${currentConfig.duration}ms` }}
              >
                <span className="text-elder-2xl font-bold text-green-800">
                  {countdown > 0 ? countdown : ""}
                </span>
              </div>
            </div>

            {/* 指导文字 */}
            <p className={`text-elder-2xl font-bold ${currentConfig.color} mb-3`}>
              {currentConfig.text}
            </p>
            <p className="text-elder text-stone-500">
              第 {cycles + 1} / {totalCycles} 次
            </p>

            {/* 进度条 */}
            <div className="w-48 h-2 bg-green-100 rounded-full mx-auto mt-6 overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-500"
                style={{ width: `${((cycles) / totalCycles) * 100}%` }}
              />
            </div>

            {/* 停止按钮 */}
            <button
              onClick={stopExercise}
              className="mt-8 px-8 py-3 bg-white/80 text-stone-600 text-elder rounded-full active:scale-95 transition-all"
            >
              暂停
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center animate-fade-in">
            <div className="text-7xl mb-6">🌸</div>
            <p className="text-elder-2xl font-bold text-stone-800 mb-3">
              做得真棒！
            </p>
            <p className="text-elder text-stone-600 mb-2">
              您完成了 {totalCycles} 次深呼吸
            </p>
            <p className="text-elder text-stone-500 mb-8">
              感觉好一点了吗？小暖为您骄傲 💛
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={startExercise}
                className="px-10 py-4 bg-green-400 text-white text-elder-lg font-bold rounded-full shadow-lg active:scale-95 transition-all"
              >
                再来一次 🌱
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-10 py-4 bg-white/80 text-stone-600 text-elder rounded-full active:scale-95 transition-all"
              >
                回到首页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
