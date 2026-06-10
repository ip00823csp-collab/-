"use client";

interface CompanionProps {
  size?: "small" | "medium" | "large";
  mood?: "happy" | "comforting" | "encouraging" | "sleepy";
  animate?: boolean;
}

export function Companion({ size = "medium", mood = "happy", animate = true }: CompanionProps) {
  const sizeMap = {
    small: { container: "w-12 h-12", face: "text-xs", glow: "w-16 h-16" },
    medium: { container: "w-20 h-20", face: "text-sm", glow: "w-28 h-28" },
    large: { container: "w-32 h-32", face: "text-base", glow: "w-40 h-40" },
  };

  const moodFaces = {
    happy: "◠‿◠",
    comforting: "◕‿◕",
    encouraging: "✧◡✧",
    sleepy: "–‿–",
  };

  const s = sizeMap[size];

  return (
    <div className="relative flex items-center justify-center">
      {/* 温暖光晕 */}
      <div
        className={`absolute ${s.glow} rounded-full bg-orange-200/30 ${animate ? "animate-breathe" : ""}`}
      />

      {/* 主体 */}
      <div
        className={`${s.container} rounded-full bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center shadow-lg ${animate ? "animate-float" : ""} relative z-10`}
      >
        {/* 小暖的脸 */}
        <div className="flex flex-col items-center">
          <span className={`${s.face} font-bold text-white/90 tracking-wider select-none`}>
            {moodFaces[mood]}
          </span>
          {size === "large" && (
            <div className="flex gap-4 mt-1">
              <div className="w-3 h-2 bg-orange-200/40 rounded-full" />
              <div className="w-3 h-2 bg-orange-200/40 rounded-full" />
            </div>
          )}
        </div>

        {/* 小腮红 */}
        {size !== "small" && (
          <>
            <div className="absolute bottom-[30%] left-[15%] w-[18%] h-[10%] bg-pink-300/30 rounded-full" />
            <div className="absolute bottom-[30%] right-[15%] w-[18%] h-[10%] bg-pink-300/30 rounded-full" />
          </>
        )}
      </div>
    </div>
  );
}
