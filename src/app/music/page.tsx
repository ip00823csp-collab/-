"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SoundOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bgGradient: string;
  src: string;
}

const sounds: SoundOption[] = [
  {
    id: "rain",
    name: "雨声",
    emoji: "🌧️",
    description: "淅淅沥沥的小雨",
    bgGradient: "from-blue-50 to-blue-100",
    src: "/audio/rain.mp3",
  },
  {
    id: "bird",
    name: "鸟鸣",
    emoji: "🐦",
    description: "清晨的鸟叫声",
    bgGradient: "from-green-50 to-green-100",
    src: "/audio/birds.mp3",
  },
  {
    id: "stream",
    name: "溪流",
    emoji: "🏞️",
    description: "潺潺的流水声",
    bgGradient: "from-cyan-50 to-cyan-100",
    src: "/audio/ocean.mp3",
  },
  {
    id: "night",
    name: "夜晚",
    emoji: "🌙",
    description: "安静的夏夜",
    bgGradient: "from-indigo-50 to-indigo-100",
    src: "/audio/night.mp3",
  },
  {
    id: "wind",
    name: "微风",
    emoji: "🍃",
    description: "轻柔的风声",
    bgGradient: "from-emerald-50 to-emerald-100",
    src: "/audio/wind.mp3",
  },
  {
    id: "fireplace",
    name: "炉火",
    emoji: "🔥",
    description: "温暖的壁炉",
    bgGradient: "from-orange-50 to-red-100",
    src: "/audio/fireplace.mp3",
  },
];

export default function MusicPage() {
  const router = useRouter();
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [loading, setLoading] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAll = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }
    setPlaying(null);
    setLoading(null);
  }, []);

  const playSound = useCallback((sound: SoundOption) => {
    if (playing === sound.id) {
      stopAll();
      return;
    }

    stopAll();
    setPlaying(sound.id);
    setLoading(sound.id);

    const audio = new Audio(sound.src);
    audio.loop = true;
    audio.volume = volume;

    audio.addEventListener("canplay", () => {
      setLoading(null);
      audio.play().catch(() => setLoading(null));
    });

    audio.addEventListener("error", () => {
      setLoading(null);
    });

    audioRef.current = audio;
  }, [playing, volume, stopAll]);

  // 更新音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 清理
  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 flex flex-col animate-fade-in">
      {/* 顶部导航 */}
      <div className="safe-top px-4 pt-4 flex items-center">
        <button
          onClick={() => {
            stopAll();
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
          🎵 听一听
        </h1>
      </div>

      <div className="flex-1 px-5 py-6">
        <p className="text-elder text-stone-600 text-center mb-6">
          选一个喜欢的声音，闭上眼睛，放松一下吧
        </p>

        {/* 声音列表 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {sounds.map((sound) => {
            const isPlaying = playing === sound.id;
            const isLoading = loading === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => playSound(sound)}
                className={`feature-card bg-gradient-to-br ${sound.bgGradient} border-2 transition-all ${
                  isPlaying
                    ? "border-orange-300 shadow-xl scale-[1.03] ring-2 ring-orange-200"
                    : "border-transparent"
                }`}
              >
                <span className="text-5xl mb-2">{sound.emoji}</span>
                <span className="text-elder-lg font-bold text-stone-700">{sound.name}</span>
                <span className="text-sm text-stone-500">{sound.description}</span>
                {isLoading && (
                  <div className="flex gap-1 mt-2">
                    <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-orange-500">加载中</span>
                  </div>
                )}
                {isPlaying && !isLoading && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-orange-400 rounded-full animate-bounce"
                        style={{
                          height: `${8 + i * 4}px`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 音量控制 */}
        {playing && (
          <div className="bg-white/70 rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-3 bg-orange-100 rounded-full appearance-none cursor-pointer accent-orange-400"
                style={{
                  background: `linear-gradient(to right, #fb923c ${volume * 100}%, #fed7aa ${volume * 100}%)`,
                }}
              />
              <span className="text-2xl">🔊</span>
            </div>

            <button
              onClick={stopAll}
              className="w-full mt-4 py-3 bg-orange-100 text-orange-700 text-elder font-bold rounded-2xl active:scale-95 transition-all"
            >
              停止播放
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
