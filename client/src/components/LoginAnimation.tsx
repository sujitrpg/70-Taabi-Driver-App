import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface LoginAnimationProps {
  isVisible: boolean;
  loginMethod: "password" | "face" | "fingerprint" | "qr";
}

export function LoginAnimation({ isVisible, loginMethod }: LoginAnimationProps) {
  const [stage, setStage] = useState<"scanning" | "verifying" | "success">("scanning");

  useEffect(() => {
    if (isVisible) {
      setStage("scanning");
      const timer1 = setTimeout(() => setStage("verifying"), 800);
      const timer2 = setTimeout(() => setStage("success"), 1400);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const getMethodIcon = () => {
    switch (loginMethod) {
      case "face":
        return (
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-4 border-taabi-blue rounded-full animate-ping opacity-20" />
            <div className="absolute inset-2 border-4 border-taabi-blue rounded-full animate-pulse" />
            <div className="absolute inset-4 border-4 border-lime-green rounded-full" 
              style={{ animation: "pulse 1s ease-in-out infinite" }} />
          </div>
        );
      case "fingerprint":
        return (
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={15 + i * 5}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-taabi-blue"
                  strokeDasharray={`${30 + i * 10} ${180 - i * 10}`}
                  style={{
                    animation: `spin ${2 + i * 0.2}s linear infinite`,
                    opacity: 0.3 + (8 - i) * 0.08,
                  }}
                />
              ))}
            </svg>
          </div>
        );
      case "qr":
        return (
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-4">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="bg-taabi-blue rounded-sm"
                  style={{
                    animation: `pulse ${0.5 + (i % 4) * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 border-4 border-lime-green" 
              style={{ animation: "scanLine 1.5s ease-in-out infinite" }} />
          </div>
        );
      default:
        return (
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-4 border-taabi-blue rounded-full animate-spin" 
              style={{ borderTopColor: "transparent" }} />
            <div className="absolute inset-4 border-4 border-lime-green rounded-full animate-spin" 
              style={{ borderTopColor: "transparent", animationDirection: "reverse", animationDuration: "0.8s" }} />
          </div>
        );
    }
  };

  const getMessage = () => {
    if (stage === "scanning") {
      switch (loginMethod) {
        case "face": return "Scanning Face...";
        case "fingerprint": return "Scanning Fingerprint...";
        case "qr": return "Scanning QR Code...";
        default: return "Authenticating...";
      }
    } else if (stage === "verifying") {
      return "Verifying Identity...";
    } else {
      return "Access Granted";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8">
        {stage === "success" ? (
          <div className="relative">
            <CheckCircle2 className="w-32 h-32 text-lime-green animate-in zoom-in-50" />
            <div className="absolute inset-0 border-4 border-lime-green rounded-full animate-ping" />
          </div>
        ) : (
          getMethodIcon()
        )}
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">{getMessage()}</h2>
          <div className="flex gap-1 justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-taabi-blue rounded-full"
                style={{
                  animation: "bounce 1s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {stage === "success" && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-lime-green rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: "ping 1s ease-out",
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
