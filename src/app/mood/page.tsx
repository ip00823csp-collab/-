"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Companion } from "@/components/Companion";

type Mood = "great" | "good" | "okay" | "sad" | "angry";

interface MoodInfo {
  emoji: string;
  label: string;
  color: string;
  bgClass: string;
}

const moods: Record<Mood, MoodInfo> = {
  great: { emoji: "😄", label: "很开心", color: "text-green-600", bgClass: "bg-green-50 border-green-200" },
  good: { emoji: "😊", label: "还不错", color: "text-blue-600", bgClass: "bg-blue-50 border-blue-200" },
  okay: { emoji: "😐", label: "一般般", color: "text-amber-600", bgClass: "bg-amber-50 border-amber-200" },
  sad: { emoji: "😢", label: "有些难过", color: "text-purple-600", bgClass: "bg-purple-50 border-purple-200" },
  angry: { emoji: "😤", label: "有点烦", color: "text-red-600", bgClass: "bg-red-50 border-red-200" },
};

const moodResponses: Record<Mood, { companionMood: "happy" | "comforting" | "encouraging"; text: string; suggestions: { text: string; action: string }[] }> = {
  great: {
    companionMood: "happy",
    text: "太好啦！看到您开心，小暖也觉得心里暖暖的！🌟 开心的时候，连阳光都更灿烂了呢！",
    suggestions: [
      { text: "和小暖分享开心的事", action: "/chat" },
      { text: "听一首欢快的歌", action: "/music" },
    ],
  },
  good: {
    companionMood: "happy",
    text: "还不错呀，这就很好了！平平淡淡的日子，也是稳稳的幸福呢 💛",
    suggestions: [
      { text: "和小暖聊聊天", action: "/chat" },
      { text: "做几个深呼吸", action: "/breathing" },
    ],
  },
  okay: {
    companionMood: "comforting",
    text: "嗯，一般般也没关系的。有时候日子就是这样，平平的。小暖在这里陪着您，要不要一起做点什么？🌿",
    suggestions: [
      { text: "听听舒缓的音乐", action: "/music" },
      { text: "和小暖说说心里话", action: "/chat" },
      { text: "做几个深呼吸放松一下", action: "/breathing" },
    ],
  },
  sad: {
    companionMood: "comforting",
    text: "嗯...小暖知道您现在不太开心。没关系的，难过的时候不用勉强自己笑。小暖就在这里，陪着您。您想说说是什么事吗？💛",
    suggestions: [
      { text: "和小暖说说心里话", action: "/chat" },
      { text: "听一段温暖的声音", action: "/music" },
      { text: "做几个深呼吸缓缓", action: "/breathing" },
      { text: "看看美好的回忆", action: "/memories" },
    ],
  },
  angry: {
    companionMood: "comforting",
    text: "嗯，小暖理解您。有些事情确实让人烦。先不急，咱们慢慢来。深呼吸一下，让小暖陪您把这股气顺一顺？🌸",
    suggestions: [
      { text: "做几个深呼吸缓缓", action: "/breathing" },
      { text: "和小暖吐槽一下", action: "/chat" },
      { text: "听听大自然的声音", action: "/music" },
    ],
  },
};

export default function MoodPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [userName, setUserName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("xinqing_user");
    if (stored) {
      setUserName(JSON.parse(stored).name);
    }
  }, []);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setSaved(false);
  };

  const handleConfirm = () => {
    if (!selectedMood) return;

    // 记录心情
    const history = JSON.parse(localStorage.getItem("xinqing_mood_history") || "[]");
    history.push({
      mood: selectedMood,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("xinqing_mood_history", JSON.stringify(history));
    setSaved(true);

    setTimeout(() => {
      const response = moodResponses[selectedMood];
      if (response.suggestions.length > 0) {
        router.push(response.suggestions[0].action);
      }
    }, 2000);
  };

  const response = selectedMood ? moodResponses[selectedMood] : null;

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col animate-fade-in">
      {/* 顶部导航 */}
      <div className="safe-top px-4 pt-4 flex items-center">
        <button
          onClick={() => router.push("/")}
          className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center active:scale-90 transition-all shadow-sm"
          aria-label="返回"
        >
          <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-elder-lg font-bold text-stone-800 pr-12">
          今天心情怎么样？
        </h1>
      </div>

      <div className="flex-1 px-6 py-6 flex flex-col">
        {/* 小暖问候 */}
        <div className="flex items-start gap-3 mb-8">
          <Companion size="small" mood={selectedMood ? response?.companionMood : "happy"} />
          <div className="flex-1 bg-white/80 rounded-3xl rounded-bl-lg px-5 py-4 shadow-sm">
            <p className="text-elder text-stone-700">
              {userName ? `${userName}，` : ""}选一个最接近您现在心情的表情吧，不用想太多～
            </p>
          </div>
        </div>

        {/* 心情选择 */}
        <div className="flex flex-col gap-3 mb-8">
          {(Object.keys(moods) as Mood[]).map((mood) => {
            const info = moods[mood];
            const isSelected = selectedMood === mood;
            return (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${
                  isSelected
                    ? `${info.bgClass} scale-[1.02] shadow-md`
                    : "bg-white/60 border-transparent hover:bg-white/80"
                } active:scale-[0.98]`}
              >
                <span className="text-4xl">{info.emoji}</span>
                <span className={`text-elder-lg font-bold ${isSelected ? info.color : "text-stone-700"}`}>
                  {info.label}
                </span>
                {isSelected && (
                  <svg className="w-7 h-7 ml-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* 小暖的回应 */}
        {selectedMood && response && (
          <div className="flex items-start gap-3 mb-6 animate-slide-up">
            <Companion size="small" mood={response.companionMood} />
            <div className="flex-1 bg-white rounded-3xl rounded-bl-lg px-5 py-4 shadow-sm">
              <p className="text-elder text-stone-700 leading-relaxed">{response.text}</p>
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* 确认按钮 */}
        {selectedMood && (
          <div className="animate-slide-up">
            <button
              onClick={handleConfirm}
              disabled={saved}
              className="w-full py-4 bg-orange-400 text-white text-elder-lg font-bold rounded-3xl shadow-lg active:scale-95 transition-all disabled:opacity-60"
            >
              {saved ? "已记录，小暖带您去放松 💛" : "告诉小暖"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
