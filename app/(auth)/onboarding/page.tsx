"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  OnboardingForm,
  OnboardingRecommendations,
} from "@/components/onboarding";
import { useOnboardingStatus } from "@/lib/hooks/useOnboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { status, loading } = useOnboardingStatus();

  // If already completed onboarding, redirect to home
  if (!loading && status?.completed) {
    router.push("/");
    return null;
  }

  const handleFormComplete = () => {
    setShowRecommendations(true);
  };

  const handleRecommendationsComplete = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      {!showRecommendations ? (
        <OnboardingForm onComplete={handleFormComplete} />
      ) : (
        <OnboardingRecommendations onContinue={handleRecommendationsComplete} />
      )}
    </>
  );
}
