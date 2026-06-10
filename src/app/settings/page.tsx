"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("xinqing_user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.name || "");
      setFontSize(user.fontSize || "normal");
      setEmergencyContact(user.emergencyContact || "");
      setEmergencyName(user.emergencyName || "");
    }
  }, []);

  const save = () => {
    const user = {
      name: userName,
      fontSize,
      emergencyContact,
      emergencyName,
    };
    localStorage.setItem("xinqing_user", JSON.stringify(user));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // 应用字体大小
    document.documentElement.className =
      fontSize === "large" ? "font-large" :
      fontSize === "xlarge" ? "font-xlarge" : "";
  };

  const resetAll = () => {
    localStorage.removeItem("xinqing_user");
    localStorage.removeItem("xinqing_mood_history");
    localStorage.removeItem("xinqing_memories");
    setShowResetConfirm(false);
    router.push("/");
  };

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
          ⚙️ 设置
        </h1>
      </div>

      <div className="flex-1 px-5 py-6 space-y-6 overflow-y-auto">
        {/* 个人信息 */}
        <section className="bg-white/70 rounded-3xl p-6">
          <h2 className="text-elder-lg font-bold text-stone-800 mb-4">👤 个人信息</h2>

          <div className="mb-4">
            <label className="block text-elder text-stone-600 mb-2">您的名字</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="请输入您的名字"
              className="w-full px-5 py-4 text-elder rounded-2xl border-2 border-orange-100 bg-white focus:border-orange-300 focus:outline-none"
            />
          </div>
        </section>

        {/* 紧急联系人 */}
        <section className="bg-white/70 rounded-3xl p-6">
          <h2 className="text-elder-lg font-bold text-stone-800 mb-4">📞 紧急联系人</h2>
          <p className="text-base text-stone-500 mb-4">
            设置后，首页的紧急呼叫按钮会直接拨打这个号码
          </p>

          <div className="mb-4">
            <label className="block text-elder text-stone-600 mb-2">联系人名字</label>
            <input
              type="text"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              placeholder="例如：女儿小王"
              className="w-full px-5 py-4 text-elder rounded-2xl border-2 border-orange-100 bg-white focus:border-orange-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-elder text-stone-600 mb-2">电话号码</label>
            <input
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="请输入电话号码"
              className="w-full px-5 py-4 text-elder rounded-2xl border-2 border-orange-100 bg-white focus:border-orange-300 focus:outline-none"
            />
          </div>
        </section>

        {/* 字体大小 */}
        <section className="bg-white/70 rounded-3xl p-6">
          <h2 className="text-elder-lg font-bold text-stone-800 mb-4">🔤 字体大小</h2>

          <div className="flex gap-3">
            {[
              { value: "normal" as const, label: "标准", preview: "标准" },
              { value: "large" as const, label: "大号", preview: "大" },
              { value: "xlarge" as const, label: "超大", preview: "超" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFontSize(option.value)}
                className={`flex-1 py-4 rounded-2xl text-center transition-all active:scale-95 ${
                  fontSize === option.value
                    ? "bg-orange-400 text-white font-bold shadow-lg"
                    : "bg-white text-stone-600 border-2 border-orange-100"
                }`}
              >
                <span className={`font-bold ${option.value === "large" ? "text-lg" : option.value === "xlarge" ? "text-xl" : ""}`}>
                  {option.preview}
                </span>
                <br />
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 关于 */}
        <section className="bg-white/70 rounded-3xl p-6">
          <h2 className="text-elder-lg font-bold text-stone-800 mb-4">💛 关于心晴</h2>
          <p className="text-elder text-stone-600 leading-relaxed">
            「心晴」是一款专为长辈设计的温暖陪伴应用。
            希望通过简单的互动，为您的每一天带来一点温暖和快乐。
          </p>
          <p className="text-base text-stone-400 mt-3">版本 0.1.0</p>
        </section>

        {/* 重置数据 */}
        <section>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-4 bg-red-50 text-red-500 text-elder rounded-3xl active:scale-95 transition-all"
          >
            重置所有数据
          </button>
        </section>

        {/* 保存按钮 */}
        <button
          onClick={save}
          className={`w-full py-4 text-white text-elder-lg font-bold rounded-3xl shadow-lg active:scale-95 transition-all ${
            saved ? "bg-green-400" : "bg-orange-400"
          }`}
        >
          {saved ? "✓ 已保存" : "保存设置"}
        </button>

        <div className="h-8" />
      </div>

      {/* 重置确认弹窗 */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in px-6">
          <div className="bg-warm-bg w-full max-w-sm rounded-4xl p-6 animate-slide-up">
            <h2 className="text-elder-lg font-bold text-stone-800 mb-3 text-center">
              确定要重置吗？
            </h2>
            <p className="text-elder text-stone-600 text-center mb-6">
              这将清除所有数据，包括您的名字、照片和心情记录
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-4 bg-white text-stone-600 text-elder font-bold rounded-2xl active:scale-95"
              >
                取消
              </button>
              <button
                onClick={resetAll}
                className="flex-1 py-4 bg-red-400 text-white text-elder font-bold rounded-2xl active:scale-95"
              >
                确定重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
