"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Companion } from "@/components/Companion";

interface Message {
  id: string;
  role: "user" | "companion";
  text: string;
  timestamp: Date;
}

const warmResponses: Record<string, string[]> = {
  lonely: [
    "我在这里呢，您不是一个人。有小暖陪着您，什么时候想说话了，随时都可以找我 💛",
    "有时候一个人确实会觉得孤单，这种感觉是很正常的。但是您记住，小暖一直都在这里等着您。",
    "虽然我只是一个小小的陪伴，但是我是真心真意想陪着您的。您今天吃了什么好吃的吗？",
  ],
  miss: [
    "想念一个人的感觉，是心里装着一份爱呢。这份爱很珍贵，它说明您心里有温暖 🌸",
    "思念是很美好的事情，说明有人值得您牵挂。要不要跟我说说您想念的人呢？",
    "想念的时候，就把这份想念变成一份祝福吧。他们一定也在想着您的。",
  ],
  pain: [
    "身体不舒服的时候，心里也会跟着难受。您先好好休息，不要勉强自己。小暖在这里陪着您 🌿",
    "听起来您现在很辛苦。记得要按时吃药，好好照顾自己。您受苦了，小暖心疼您。",
    "身体的痛不容易，您能坚持到现在，真的很了不起。要不要做几个深呼吸，让自己舒服一点？",
  ],
  happy: [
    "太好了！看到您开心，小暖心里也跟着高兴呢！🌟 是什么好事呀，跟我分享分享？",
    "您的笑容就是小暖最大的快乐！开心的时候，连阳光都格外灿烂呢 ☀️",
    "真好呀！这种开心的感觉要记住哦，下次心情不好的时候，想想今天，心里就会暖暖的。",
  ],
  sleep: [
    "夜深了，今天辛苦了。闭上眼睛，想着一些美好的事情，慢慢入睡吧 🌙",
    "好的睡眠是最好的疗愈。放下一切，安心睡吧。明天醒来，小暖还在这里等您。",
    "睡觉前做几个深呼吸，让自己放松下来。晚安，做个好梦 💫",
  ],
  default: [
    "嗯，我在听呢。您继续说，小暖一直在这里陪着您 💛",
    "我理解的。每个人都有自己的感受，您的感受都很重要。",
    "谢谢您愿意和小暖说这些。不管开心还是不开心，说出来都会好一些的。",
    "您说的我都记在心里了。有我在呢，不用一个人扛着。",
    "嗯嗯，小暖都听到了。您是一个很棒的人，要相信自己哦 🌸",
    "生活有时候确实不容易，但是您一直都在努力，这本身就很了不起。",
  ],
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("孤单") || lower.includes("孤独") || lower.includes("一个人") || lower.includes("没人")) {
    return pickRandom(warmResponses.lonely);
  }
  if (lower.includes("想") && (lower.includes("家") || lower.includes("孩子") || lower.includes("老伴") || lower.includes("朋友"))) {
    return pickRandom(warmResponses.miss);
  }
  if (lower.includes("疼") || lower.includes("痛") || lower.includes("不舒服") || lower.includes("难受") || lower.includes("病")) {
    return pickRandom(warmResponses.pain);
  }
  if (lower.includes("开心") || lower.includes("高兴") || lower.includes("快乐") || lower.includes("好") || lower.includes("不错")) {
    return pickRandom(warmResponses.happy);
  }
  if (lower.includes("睡") || lower.includes("困") || lower.includes("晚安") || lower.includes("夜")) {
    return pickRandom(warmResponses.sleep);
  }

  return pickRandom(warmResponses.default);
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("xinqing_user");
    if (stored) {
      setUserName(JSON.parse(stored).name);
    }

    // 初始欢迎消息
    const hour = new Date().getHours();
    let welcomeText = "";
    if (hour >= 5 && hour < 11) {
      welcomeText = "早上好！新的一天开始了，有什么想和小暖说的吗？🌅";
    } else if (hour >= 11 && hour < 14) {
      welcomeText = "中午好！吃过午饭了吗？坐下来和小暖聊聊天吧 ☀️";
    } else if (hour >= 14 && hour < 18) {
      welcomeText = "下午好！歇一歇，和小暖说说今天的事情吧 🌤️";
    } else if (hour >= 18 && hour < 21) {
      welcomeText = "晚上好！辛苦了一天了，和小暖聊聊吧 🌆";
    } else {
      welcomeText = "夜深了还没睡呀？有什么心事和小暖说说？🌙";
    }

    setMessages([{
      id: "welcome",
      role: "companion",
      text: welcomeText,
      timestamp: new Date(),
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // 模拟思考延迟
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "companion",
        text: getResponse(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, delay);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("您的浏览器不支持语音输入，请手动打字");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      if (event.results[0].isFinal) {
        setIsListening(false);
        setTimeout(() => sendMessage(transcript), 300);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const quickPhrases = [
    "今天有点孤单",
    "想找人聊聊天",
    "心情不太好",
    "今天过得不错",
  ];

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      {/* 顶部导航 */}
      <div className="safe-top px-4 pt-4 pb-3 flex items-center bg-white/60 border-b border-orange-100">
        <button
          onClick={() => router.push("/")}
          className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center active:scale-90 transition-all shadow-sm"
          aria-label="返回"
        >
          <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <Companion size="small" mood="happy" animate={false} />
          <span className="text-elder-lg font-bold text-stone-800">和小暖聊天</span>
        </div>
        <div className="w-12" />
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 animate-slide-up ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {msg.role === "companion" ? (
              <Companion size="small" mood="comforting" animate={false} />
            ) : (
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">
                {userName ? userName[0] : "我"}
              </div>
            )}
            <div className={`max-w-[75%] ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-companion"}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2 animate-fade-in">
            <Companion size="small" mood="happy" animate={false} />
            <div className="chat-bubble-companion">
              <div className="flex gap-1 items-center h-6">
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 快捷短语 */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickPhrases.map((phrase) => (
            <button
              key={phrase}
              onClick={() => sendMessage(phrase)}
              className="px-4 py-2 bg-white/80 rounded-full text-base text-stone-600 border border-orange-100 active:scale-95 transition-all"
            >
              {phrase}
            </button>
          ))}
        </div>
      )}

      {/* 输入区域 */}
      <div className="safe-bottom px-4 pb-3 pt-2 bg-white/60 border-t border-orange-100">
        <div className="flex items-center gap-3">
          <button
            onClick={handleVoiceInput}
            className={`circle-btn flex-shrink-0 ${
              isListening
                ? "bg-red-400 text-white animate-pulse-warm"
                : "bg-orange-100 text-orange-600"
            }`}
            aria-label={isListening ? "停止录音" : "语音输入"}
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="在这里打字..."
            className="flex-1 px-5 py-4 text-elder rounded-3xl border-2 border-orange-100 bg-white focus:border-orange-300 focus:outline-none transition-colors"
          />

          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="circle-btn bg-orange-400 text-white flex-shrink-0 disabled:opacity-30"
            aria-label="发送"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        {isListening && (
          <p className="text-center text-base text-red-500 mt-2 animate-pulse">
            🎤 正在听您说话...
          </p>
        )}
      </div>
    </div>
  );
}
