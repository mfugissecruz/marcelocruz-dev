import { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import Script from "next/script";

export default function HackerConstruction() {
  const [logs, setLogs] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showDonateButton, setShowDonateButton] = useState(false);
  const terminalRef = useRef(null);
  const hasRunRef = useRef(false);

  const initialSequence = [
    { type: "system", text: "> Initializing deployment system...", delay: 100 },
    { type: "success", text: "✓ System initialized", delay: 300 },
    { type: "system", text: "> npm install awesomeness...", delay: 500 },
    { type: "loading", text: "⠋ Installing packages...", delay: 700 },
    {
      type: "success",
      text: "✓ Awesomeness installed (42 packages)",
      delay: 900,
    },
    { type: "system", text: "> Building production version...", delay: 1100 },
    { type: "startProgress", text: "", delay: 1300 },
    { type: "error", text: "✗ ERROR: Coffee not found!", delay: 2800 },
    {
      type: "warning",
      text: "⚠ Build process requires caffeine to continue",
      delay: 3000,
    },
    { type: "error", text: "✗ Developer.energy = 0%", delay: 3200 },
    {
      type: "info",
      text: "💡 Solution: Check below for coffee donation",
      delay: 3400,
    },
  ];

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    let currentIndex = 0;

    const runSequence = () => {
      if (currentIndex < initialSequence.length) {
        const item = initialSequence[currentIndex];

        setTimeout(() => {
          if (item.type === "startProgress") {
            startProgress();
          } else {
            setLogs((prev) => [...prev, item]);
          }
          currentIndex++;
          runSequence();
        }, item.delay);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setShowDonateButton(true);
        }, 500);
      }
    };

    runSequence();
  }, []);

  const startProgress = () => {
    setLogs((prev) => [...prev, { type: "progress", text: "Building... 0%" }]);

    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15;

      if (prog >= 99) {
        setProgress(99);
        setLogs((prev) => {
          const newLogs = [...prev];
          for (let i = newLogs.length - 1; i >= 0; i--) {
            if (newLogs[i].type === "progress") {
              newLogs[i] = {
                type: "progress",
                text: "Building... 99% (stuck...)",
              };
              break;
            }
          }
          return newLogs;
        });
        clearInterval(interval);
      } else if (prog < 99) {
        setProgress(prog);
        setLogs((prev) => {
          const newLogs = [...prev];
          for (let i = newLogs.length - 1; i >= 0; i--) {
            if (newLogs[i].type === "progress") {
              newLogs[i] = {
                type: "progress",
                text: `Building... ${Math.floor(prog)}%`,
              };
              break;
            }
          }
          return newLogs;
        });
      }
    }, 200);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      case "system":
        return "text-cyan-400";
      case "loading":
        return "text-purple-400";
      case "progress":
        return "text-yellow-400";
      default:
        return "text-gray-300";
    }
  };

  return (
    <>
      {/* Script do Stripe */}
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-black flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="bg-gray-800 rounded-t-lg px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2 border-b border-gray-700">
            <div className="flex gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center gap-2 ml-2 sm:ml-4 flex-1">
              <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              <span className="text-gray-300 text-xs sm:text-sm font-mono hidden sm:inline">
                marcelocruz.dev
              </span>
              <span className="text-gray-300 text-xs font-mono sm:hidden">
                marcelocruz.dev
              </span>
            </div>
          </div>

          {/* Terminal */}
          <div
            ref={terminalRef}
            className="bg-gray-900 rounded-b-lg p-3 sm:p-6 h-[40vh] sm:h-[420px] overflow-y-auto font-mono text-xs sm:text-sm"
          >
            {/* Logs */}
            {logs.map((log, index) => (
              <div key={index} className={`mb-1 ${getLogColor(log.type)}`}>
                {log.type === "progress" ? (
                  <div>
                    <div className="mb-1">{log.text}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] sm:text-xs">
                        {Math.floor(progress)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  log.text
                )}
              </div>
            ))}

            {/* Cursor quando está digitando */}
            {isTyping && <span className="text-white animate-pulse">▋</span>}
          </div>

          {/* Botão de doação Stripe */}
          {showDonateButton && (
            <div className="mt-3 sm:mt-4 text-center px-2 animate-fade-in">
              <div className="mt-3 space-y-1">
                <p className="text-yellow-400 text-sm sm:text-base font-semibold">
                  ☕ Deploy travado por falta de cafeína!
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  <a
                    href="https://marcelocruz.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 transition-colors underline"
                  >
                    marcelocruz.dev
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        <style>{`
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
