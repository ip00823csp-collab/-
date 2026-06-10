"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Companion } from "@/components/Companion";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [inputName, setInputName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [bgClass, setBgClass] = useState("gradient-sunrise");

  useEffect(() => {
    // 读取用户信息
    const stored = localStorage.getItem("xinqing_user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.name);
    } else {
      setShowOnboarding(true);
    }

    // 根据时间设置问候语和背景
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      setGreeting("早上好呀");
      setBgClass("gradient-sunrise");
    } else if (hour >= 11 && hour < 14) {
      setGreeting("中午好呀");
      setBgClass("gradient-warm");
    } else if (hour >= 14 && hour < 18) {
      setGreeting("下午好呀");
      setBgClass("gradient-warm");
    } else if (hour >= 18 && hour < 21) {
      setGreeting("晚上好呀");
      setBgClass("gradient-sunset");
    } else {
      setGreeting("夜深了");
      setBgClass("gradient-night");
    }
  }, []);

  const handleOnboarding = () => {
    if (inputName.trim()) {
      const user = { name: inputName.trim(), fontSize: "normal", emergencyContact: "" };
      localStorage.setItem("xinqing_user", JSON.stringify(user));
      setUserName(inputName.trim());
      setShowOnboarding(false);
    }
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen gradient-warm flex flex-col items-center justify-center px-8 animate-fade-in">
        <div className="text-center mb-10">
          <Companion size="large" />
          <h1 className="text-elder-2xl font-bold text-stone-800 mt-6">
            欢迎来到心晴
          </h1>
          <p className="text-elder text-stone-600 mt-3">
            我是小暖，以后由我来陪伴您 💛
          </p>
        </div>

        <div className="w-full max-w-sm">
          <label className="block text-elder text-stone-700 mb-3 text-center">
            请告诉我，该怎么称呼您呢？
          </label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleOnboarding()}
            placeholder="输入您的名字"
            className="w-full px-6 py-4 text-elder text-center rounded-3xl border-2 border-orange-200 bg-white/80 focus:border-orange-400 focus:outline-none transition-colors"
            autoFocus
          />
          <button
            onClick={handleOnboarding}
            disabled={!inputName.trim()}
            className="w-full mt-6 py-4 bg-orange-400 text-white text-elder-lg font-bold rounded-3xl shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100"
          >
            开始旅程 ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col animate-fade-in`}>
      {/* 顶部问候区 */}
      <div className="safe-top px-6 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Companion size="small" />
            <div>
              <p className="text-elder-lg font-bold text-stone-800">
                {greeting}，{userName}
              </p>
              <p className="text-base text-stone-500">小暖在这里陪着您</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/settings")}
            className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center active:scale-90 transition-all"
            aria-label="设置"
          >
            <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 主功能区 */}
      <div className="flex-1 px-5 py-6 overflow-y-auto">
        {/* 今日心情 */}
        <button
          onClick={() => router.push("/mood")}
          className="w-full mb-5 p-6 bg-white/80 rounded-4xl shadow-lg active:scale-[0.98] transition-all text-left animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">😊</div>
            <div>
              <h2 className="text-elder-lg font-bold text-stone-800">今天心情怎么样？</h2>
              <p className="text-base text-stone-500 mt-1">和小暖说说您的感受吧</p>
            </div>
            <svg className="w-6 h-6 text-stone-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* 功能网格 */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/chat")}
            className="feature-card bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-100 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="text-5xl mb-3">💬</div>
            <span className="text-elder font-bold text-stone-700">和小暖聊天</span>
            <span className="text-sm text-stone-500 mt-1">说说心里话</span>
          </button>

          <button
            onClick={() => router.push("/music")}
            className="feature-card bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-100 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="text-5xl mb-3">🎵</div>
            <span className="text-elder font-bold text-stone-700">听一听</span>
            <span className="text-sm text-stone-500 mt-1">舒缓的音乐</span>
          </button>

          <button
            onClick={() => router.push("/breathing")}
            className="feature-card bg-gradient-to-br from-green-50 to-green-100 border border-green-100 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="text-5xl mb-3">🌿</div>
            <span className="text-elder font-bold text-stone-700">呼吸放松</span>
            <span className="text-sm text-stone-500 mt-1">深呼吸练习</span>
          </button>

          <button
            onClick={() => router.push("/memories")}
            className="feature-card bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-100 animate-slide-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="text-5xl mb-3">📷</div>
            <span className="text-elder font-bold text-stone-700">美好回忆</span>
            <span className="text-sm text-stone-500 mt-1">翻看照片</span>
          </button>
        </div>

        {/* 暖心语句 */}
        <div className="mt-6 p-5 bg-white/50 rounded-3xl text-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <WarmQuote />
        </div>
      </div>

      {/* 底部紧急呼叫 */}
      <div className="safe-bottom px-5 pb-3">
        <EmergencyButton />
      </div>
    </div>
  );
}

function WarmQuote() {
  const quotes = [
    "每一天都是新的开始，您值得被温柔对待 🌸",
    "您的笑容，是世界上最美的风景 💛",
    "慢慢来，不着急，小暖一直在这里陪着您 🌿",
    "您走过的每一步，都是了不起的故事 ✨",
    "今天也是美好的一天，因为有您在 💐",
    "无论晴雨，您的心里都值得一片晴天 ☀️",
    "您的坚强和勇敢，一直都在温暖着身边的人 🌻",
    "生活有苦有甜，您只需要负责微笑就好 🍀",
  ];

  const today = new Date().getDate();
  const quote = quotes[today % quotes.length];

  return (
    <div>
      <p className="text-base text-stone-400 mb-1">✨ 今日心语 ✨</p>
      <p className="text-elder text-stone-600 font-medium">{quote}</p>
    </div>
  );
}

function EmergencyButton() {
  const [contact, setContact] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("xinqing_user");
    if (stored) {
      const user = JSON.parse(stored);
      setContact(user.emergencyContact || "");
    }
  }, []);

  const handleEmergency = () => {
    if (contact) {
      window.location.href = `tel:${contact}`;
    } else {
      alert("请先在设置中添加紧急联系人号码");
      window.location.href = "/settings";
    }
  };

  return (
    <button
      onClick={handleEmergency}
      className="w-full py-4 bg-red-50 border-2 border-red-200 rounded-3xl flex items-center justify-center gap-3 active:scale-95 transition-all"
    >
      <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      <span className="text-elder font-bold text-red-600">
        {contact ? "紧急呼叫家人" : "设置紧急联系人"}
      </span>
    </button>
  );
}
