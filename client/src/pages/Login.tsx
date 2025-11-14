import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, ArrowRight, AlertCircle, ScanFace, Fingerprint, QrCode } from "lucide-react";
import { useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { LoginAnimation } from "@/components/LoginAnimation";
import taabiLogo from "@assets/download_1763097036090.jpeg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "face" | "fingerprint" | "qr">("password");
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleLogin = () => {
    if (username && password) {
      setLoginMethod("password");
      setShowAnimation(true);
      setTimeout(() => {
        login(username);
        setLocation("/");
      }, 2000);
    } else {
      setError("Please enter both username and password");
    }
  };

  const handleBiometricLogin = (method: "face" | "fingerprint" | "qr") => {
    setLoginMethod(method);
    setShowAnimation(true);
    setTimeout(() => {
      login(`${method.charAt(0).toUpperCase() + method.slice(1)} Scan User`);
      setLocation("/");
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && username && password) {
      handleLogin();
    }
  };

  return (
    <>
      <LoginAnimation isVisible={showAnimation} loginMethod={loginMethod} />
      <div className="min-h-screen bg-gradient-to-br from-taabi-blue via-taabi-blue/90 to-taabi-blue/80 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
        <div className="text-center text-white">
          <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden p-2">
            <img src={taabiLogo} alt="Taabi Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Taabi Drive+</h1>
          <p className="text-white/80 text-lg">Your intelligent driving companion</p>
          <p className="text-white/60 text-sm mt-2">Powered by taabi.ai</p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to continue your journey</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="pl-11"
                  data-testid="input-username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="pl-11"
                  data-testid="input-password"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-taabi-blue hover:bg-taabi-blue/90" 
              size="lg"
              onClick={handleLogin}
              disabled={!username || !password || showAnimation}
              data-testid="button-login"
            >
              Login
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => handleBiometricLogin("face")}
                disabled={showAnimation}
                className="flex-col h-auto py-4 gap-2"
                data-testid="button-face-scan"
              >
                <ScanFace className="w-6 h-6" />
                <span className="text-xs">Face</span>
              </Button>

              <Button 
                variant="outline"
                size="lg"
                onClick={() => handleBiometricLogin("fingerprint")}
                disabled={showAnimation}
                className="flex-col h-auto py-4 gap-2"
                data-testid="button-fingerprint-scan"
              >
                <Fingerprint className="w-6 h-6" />
                <span className="text-xs">Fingerprint</span>
              </Button>

              <Button 
                variant="outline"
                size="lg"
                onClick={() => handleBiometricLogin("qr")}
                disabled={showAnimation}
                className="flex-col h-auto py-4 gap-2"
                data-testid="button-qr-scan"
              >
                <QrCode className="w-6 h-6" />
                <span className="text-xs">QR Code</span>
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms & Privacy Policy
          </div>
        </Card>

        <div className="text-center text-white/60 text-sm">
          <p>Powered by Taabi Fleet Solutions</p>
          <p className="text-white/40 mt-1">AI-driven logistics by taabi.ai</p>
        </div>
        </div>
      </div>
    </>
  );
}
