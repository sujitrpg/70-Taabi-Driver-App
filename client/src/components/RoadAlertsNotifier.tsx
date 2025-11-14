import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { RoadAlert } from "@shared/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RoadAlertsNotifier() {
  const [showAlert, setShowAlert] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  const { data: alerts } = useQuery<RoadAlert[]>({
    queryKey: ["/api/road-alerts"],
    refetchInterval: 180000, // Refetch every 3 minutes
  });

  useEffect(() => {
    if (!alerts || alerts.length === 0) {
      setShowAlert(false);
      return;
    }

    // Show a random alert every 3 minutes
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * alerts.length);
      setCurrentAlertIndex(randomIndex);
      setShowAlert(true);
    }, 180000); // 3 minutes

    // Show first alert immediately
    setTimeout(() => {
      setCurrentAlertIndex(0);
      setShowAlert(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [alerts]);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  if (!showAlert || !alerts || alerts.length === 0) {
    return null;
  }

  const currentAlert = alerts[currentAlertIndex];
  if (!currentAlert) return null;

  const severityColors = {
    low: "bg-yellow-500/90 border-yellow-600 text-white dark:bg-yellow-600/90",
    medium: "bg-orange-500/90 border-orange-600 text-white dark:bg-orange-600/90",
    high: "bg-red-500/90 border-red-600 text-white dark:bg-red-600/90",
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top" data-testid="road-alert-banner">
      <Alert className={`${severityColors[currentAlert.severity as keyof typeof severityColors] || severityColors.medium} border-2 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
            <div className="flex-1 min-w-0">
              <AlertTitle className="font-bold text-base mb-1 text-white" data-testid="alert-title">
                {currentAlert.title}
              </AlertTitle>
              <AlertDescription className="text-sm text-white/95">
                {currentAlert.description}
              </AlertDescription>
              <p className="text-xs mt-2 text-white/80">
                Location: {currentAlert.location}
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="flex-shrink-0 h-6 w-6 text-white hover:bg-white/20"
            onClick={() => setShowAlert(false)}
            data-testid="button-close-alert"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}
