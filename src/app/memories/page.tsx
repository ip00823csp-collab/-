"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Memory {
  id: string;
  dataUrl: string;
  caption: string;
  date: string;
}

export default function MemoriesPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [viewingMemory, setViewingMemory] = useState<Memory | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newImageDataUrl, setNewImageDataUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("xinqing_user");
    if (stored) {
      setUserName(JSON.parse(stored).name);
    }

    const saved = localStorage.getItem("xinqing_memories");
    if (saved) {
      setMemories(JSON.parse(saved));
    }
  }, []);

  const saveMemories = (updated: Memory[]) => {
    setMemories(updated);
    localStorage.setItem("xinqing_memories", JSON.stringify(updated));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewImageDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addMemory = () => {
    if (!newImageDataUrl) return;

    const memory: Memory = {
      id: Date.now().toString(),
      dataUrl: newImageDataUrl,
      caption: newCaption || "美好的回忆",
      date: new Date().toLocaleDateString("zh-CN"),
    };

    saveMemories([memory, ...memories]);
    setNewImageDataUrl("");
    setNewCaption("");
    setShowAddForm(false);
  };

  const deleteMemory = (id: string) => {
    if (confirm("确定要删除这张照片吗？")) {
      saveMemories(memories.filter(m => m.id !== id));
      setViewingMemory(null);
    }
  };

  // 全屏查看照片
  if (viewingMemory) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col animate-fade-in">
        <div className="safe-top px-4 pt-4 flex items-center">
          <button
            onClick={() => setViewingMemory(null)}
            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-all"
            aria-label="返回"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <p className="text-elder text-white font-medium">{viewingMemory.caption}</p>
            <p className="text-sm text-white/60">{viewingMemory.date}</p>
          </div>
          <button
            onClick={() => deleteMemory(viewingMemory.id)}
            className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center active:scale-90 transition-all"
            aria-label="删除"
          >
            <svg className="w-6 h-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={viewingMemory.dataUrl}
            alt={viewingMemory.caption}
            className="max-w-full max-h-[80vh] rounded-2xl object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-orange-50 flex flex-col animate-fade-in">
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
          📷 美好回忆
        </h1>
      </div>

      <div className="flex-1 px-5 py-6">
        <p className="text-elder text-stone-600 text-center mb-6">
          {userName ? `${userName}，` : ""}这些是您珍贵的回忆 💛
        </p>

        {/* 添加照片按钮 */}
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mb-6 p-5 bg-white/60 rounded-3xl border-2 border-dashed border-orange-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <span className="text-3xl">➕</span>
          <span className="text-elder font-bold text-orange-600">添加新的回忆</span>
        </button>

        {/* 照片网格 */}
        {memories.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {memories.map((memory) => (
              <button
                key={memory.id}
                onClick={() => setViewingMemory(memory)}
                className="relative rounded-3xl overflow-hidden shadow-lg active:scale-95 transition-all aspect-square"
              >
                <img
                  src={memory.dataUrl}
                  alt={memory.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate">{memory.caption}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-elder text-stone-500">
              还没有照片呢
            </p>
            <p className="text-base text-stone-400 mt-1">
              添加一些美好的照片吧
            </p>
          </div>
        )}
      </div>

      {/* 添加照片弹窗 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 animate-fade-in">
          <div className="bg-warm-bg w-full max-w-lg rounded-t-4xl sm:rounded-4xl p-6 animate-slide-up">
            <h2 className="text-elder-lg font-bold text-stone-800 mb-4 text-center">
              添加新的回忆 📸
            </h2>

            {newImageDataUrl ? (
              <div className="mb-4">
                <img
                  src={newImageDataUrl}
                  alt="预览"
                  className="w-full h-48 object-cover rounded-2xl"
                />
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mb-4 p-8 bg-white/60 rounded-3xl border-2 border-dashed border-orange-200 flex flex-col items-center gap-2 active:scale-95 transition-all"
              >
                <span className="text-4xl">📷</span>
                <span className="text-elder text-orange-600">点击选择照片</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="给这张照片起个名字吧..."
              className="w-full px-5 py-4 text-elder rounded-2xl border-2 border-orange-100 bg-white focus:border-orange-300 focus:outline-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewImageDataUrl("");
                  setNewCaption("");
                }}
                className="flex-1 py-4 bg-white text-stone-600 text-elder font-bold rounded-2xl active:scale-95 transition-all"
              >
                取消
              </button>
              <button
                onClick={addMemory}
                disabled={!newImageDataUrl}
                className="flex-1 py-4 bg-orange-400 text-white text-elder font-bold rounded-2xl active:scale-95 transition-all disabled:opacity-40"
              >
                保存 💛
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
