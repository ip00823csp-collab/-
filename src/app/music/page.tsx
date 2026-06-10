"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SoundOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bgGradient: string;
  // Web Audio API 配置
  frequencies: number[];
  type: OscillatorType;
  interval: number; // ms between notes
}

const sounds: SoundOption[] = [
  {
    id: "rain",
    name: "雨声",
    emoji: "🌧️",
    description: "淅淅沥沥的小雨",
    bgGradient: "from-blue-50 to-blue-100",
    frequencies: [0], // 白噪音
    type: "sine",
    interval: 100,
  },
  {
    id: "bird",
    name: "鸟鸣",
    emoji: "🐦",
    description: "清晨的鸟叫声",
    bgGradient: "from-green-50 to-green-100",
    frequencies: [800, 1000, 1200, 900, 1100, 850, 1050],
    type: "sine",
    interval: 600,
  },
  {
    id: "stream",
    name: "溪流",
    emoji: "🏞️",
    description: "潺潺的流水声",
    bgGradient: "from-cyan-50 to-cyan-100",
    frequencies: [200, 250, 300, 280, 220, 260],
    type: "sine",
    interval: 200,
  },
  {
    id: "night",
    name: "夜晚",
    emoji: "🌙",
    description: "安静的夏夜",
    bgGradient: "from-indigo-50 to-indigo-100",
    frequencies: [400, 420, 380, 410, 390, 430],
    type: "sine",
    interval: 800,
  },
  {
    id: "wind",
    name: "微风",
    emoji: "🍃",
    description: "轻柔的风声",
    bgGradient: "from-emerald-50 to-emerald-100",
    frequencies: [0],
    type: "triangle",
    interval: 150,
  },
  {
    id: "piano",
    name: "琴声",
    emoji: "🎹",
    description: "轻柔的钢琴音",
    bgGradient: "from-purple-50 to-purple-100",
    frequencies: [262, 294, 330, 349, 392, 440, 349, 330, 294, 262],
    type: "sine",
    interval: 1000,
  },
];

export default function MusicPage() {
  const router = useRouter();
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const stopAll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (noiseNodeRef.current) {
      try { noiseNodeRef.current.stop(); } catch {}
      noiseNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setPlaying(null);
  }, []);

  const playWhiteNoise = (ctx: AudioContext, gain: GainNode, type: OscillatorType) => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // 生成柔和的噪音
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // 低通滤波效果
      output[i] = (lastOut + (white * 0.02)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain);
    source.start();
    noiseNodeRef.current = source;
  };

  const playTone = (ctx: AudioContext, gain: GainNode, freq: number, type: OscillatorType, duration: number) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // 柔和的包络
    noteGain.gain.setValueAtTime(0, ctx.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

    osc.connect(noteGain);
    noteGain.connect(gain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  };

  const playSound = (sound: SoundOption) => {
    if (playing === sound.id) {
      stopAll();
      return;
    }

    stopAll();
    setPlaying(sound.id);

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    if (sound.frequencies[0] === 0) {
      // 白噪音类
      playWhiteNoise(ctx, masterGain, sound.type);
    } else {
      // 音调类
      let noteIndex = 0;
      const playNote = () => {
        if (!audioContextRef.current) return;
        const freq = sound.frequencies[noteIndex % sound.frequencies.length];
        playTone(ctx, masterGain, freq, sound.type, sound.interval * 0.8);
        noteIndex++;
      };

      playNote();
      intervalRef.current = setInterval(playNote, sound.interval);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    }
  }, [volume]);

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
                {isPlaying && (
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
