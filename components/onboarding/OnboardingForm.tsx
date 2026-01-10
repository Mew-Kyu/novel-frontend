"use client";

import { useState, useEffect } from "react";
import { useSaveOnboardingPreferences } from "@/lib/hooks/useOnboarding";
import { GenreDto, OnboardingRequest } from "@/lib/generated-api/generated";
import { Button } from "@/components/ui/Button";
import apiClient from "@/lib/generated-api";

interface OnboardingFormProps {
  onComplete?: () => void;
}

export const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const [step, setStep] = useState(1);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const { savePreferences, loading } = useSaveOnboardingPreferences();

  const [formData, setFormData] = useState<OnboardingRequest>({
    preferredGenreIds: [],
    readingFrequency: "DAILY",
    preferredLength: "MEDIUM",
    completionPreference: "BALANCED",
    explorationPreference: "BALANCED",
  });

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await apiClient.genres.getAllGenres();
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const toggleGenre = (genreId: number) => {
    if (formData.preferredGenreIds?.includes(genreId)) {
      setFormData({
        ...formData,
        preferredGenreIds: formData.preferredGenreIds.filter(
          (id) => id !== genreId
        ),
      });
    } else {
      setFormData({
        ...formData,
        preferredGenreIds: [...(formData.preferredGenreIds || []), genreId],
      });
    }
  };

  const handleSubmit = async () => {
    const result = await savePreferences(formData);
    if (result && onComplete) {
      onComplete();
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              🎯 Tìm hiểu sở thích của bạn
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Giúp chúng tôi gợi ý những truyện phù hợp nhất với bạn
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bước {step} / 5
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((step / 5) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Reading Frequency */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Bạn đọc truyện bao lâu một lần?
              </h2>
              <div className="space-y-3">
                {[
                  {
                    value: "DAILY",
                    label: "⏰ Hàng ngày",
                    desc: "Tôi đọc mỗi ngày",
                  },
                  {
                    value: "WEEKLY",
                    label: "📅 Hàng tuần",
                    desc: "Tôi đọc vài lần mỗi tuần",
                  },
                  {
                    value: "MONTHLY",
                    label: "📆 Hàng tháng",
                    desc: "Tôi đọc thỉnh thoảng",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`block cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      formData.readingFrequency === option.value
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="readingFrequency"
                      value={option.value}
                      checked={formData.readingFrequency === option.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          readingFrequency: e.target
                            .value as OnboardingRequest["readingFrequency"],
                        })
                      }
                      className="hidden"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {option.desc}
                        </div>
                      </div>
                      {formData.readingFrequency === option.value && (
                        <div className="text-purple-500">✓</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Preferred Length */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Bạn thích truyện dài hay ngắn?
              </h2>
              <div className="space-y-3">
                {[
                  { value: "SHORT", label: "📘 Ngắn", desc: "1-50 chương" },
                  { value: "MEDIUM", label: "📗 Vừa", desc: "51-200 chương" },
                  { value: "LONG", label: "📙 Dài", desc: "Hơn 200 chương" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`block cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      formData.preferredLength === option.value
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredLength"
                      value={option.value}
                      checked={formData.preferredLength === option.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredLength: e.target
                            .value as OnboardingRequest["preferredLength"],
                        })
                      }
                      className="hidden"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {option.desc}
                        </div>
                      </div>
                      {formData.preferredLength === option.value && (
                        <div className="text-purple-500">✓</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Completion Preference */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Bạn thích hoàn thành truyện hay khám phá?
              </h2>
              <div className="space-y-3">
                {[
                  {
                    value: "COMPLETIONIST",
                    label: "✅ Hoàn thành",
                    desc: "Tôi thích đọc hết truyện",
                  },
                  {
                    value: "BALANCED",
                    label: "⚖️ Cân bằng",
                    desc: "Tùy tình hình",
                  },
                  {
                    value: "EXPLORER",
                    label: "🔍 Khám phá",
                    desc: "Tôi thích thử nhiều truyện mới",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`block cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      formData.completionPreference === option.value
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="completionPreference"
                      value={option.value}
                      checked={formData.completionPreference === option.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          completionPreference: e.target
                            .value as OnboardingRequest["completionPreference"],
                        })
                      }
                      className="hidden"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {option.desc}
                        </div>
                      </div>
                      {formData.completionPreference === option.value && (
                        <div className="text-purple-500">✓</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Exploration Preference */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Bạn có dễ dàng chấp nhận thể loại mới không?
              </h2>
              <div className="space-y-3">
                {[
                  {
                    value: "SAFE",
                    label: "🛡️ Thận trọng",
                    desc: "Tôi thích đọc thể loại quen thuộc",
                  },
                  {
                    value: "BALANCED",
                    label: "⚖️ Cân bằng",
                    desc: "Tôi sẵn sàng thử điều mới",
                  },
                  {
                    value: "ADVENTUROUS",
                    label: "🚀 Phiêu lưu",
                    desc: "Tôi thích khám phá mọi thể loại",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`block cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      formData.explorationPreference === option.value
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="explorationPreference"
                      value={option.value}
                      checked={formData.explorationPreference === option.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          explorationPreference: e.target
                            .value as OnboardingRequest["explorationPreference"],
                        })
                      }
                      className="hidden"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {option.desc}
                        </div>
                      </div>
                      {formData.explorationPreference === option.value && (
                        <div className="text-purple-500">✓</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Genre Selection */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Chọn các thể loại bạn yêu thích
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Chọn ít nhất 1 thể loại
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                {genres.map((genre) => (
                  <label
                    key={genre.id}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${
                      formData.preferredGenreIds?.includes(genre.id!)
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferredGenreIds?.includes(genre.id!)}
                      onChange={() => toggleGenre(genre.id!)}
                      className="hidden"
                    />
                    <div className="font-medium text-gray-900 dark:text-white">
                      {genre.name}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between gap-4">
            {step > 1 && (
              <Button
                onClick={prevStep}
                variant="secondary"
                className="flex-1"
                disabled={loading}
              >
                ← Quay lại
              </Button>
            )}
            {step < 5 ? (
              <Button
                onClick={nextStep}
                className="flex-1 ml-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Tiếp tục →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.preferredGenreIds ||
                  formData.preferredGenreIds.length === 0
                }
                className="flex-1 ml-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {loading ? "Đang lưu..." : "Hoàn tất 🎉"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};
