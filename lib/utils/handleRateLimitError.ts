import toast from "react-hot-toast";

interface RateLimitErrorData {
  message?: string;
  retryAfterSeconds?: number;
  status?: number;
}

interface AxiosErrorResponse {
  response?: {
    status?: number;
    data?: RateLimitErrorData;
  };
}

const ERROR_MESSAGES: Record<string, string> = {
  translate:
    "Đã vượt quá giới hạn số lần gọi API dịch thuật. Vui lòng thử lại sau {seconds} giây.",
  embedding:
    "Đã vượt quá giới hạn số lần gọi API tạo embedding. Vui lòng thử lại sau {seconds} giây.",
  search:
    "Đã vượt quá giới hạn số lần gọi API tìm kiếm. Vui lòng thử lại sau {seconds} giây.",
  default:
    "Đã vượt quá giới hạn số lần gọi API Gemini. Vui lòng thử lại sau {seconds} giây.",
};

/**
 * Handle rate limit error (429) from Gemini API
 * Shows Vietnamese error message with countdown timer
 *
 * @param error - The axios error object
 * @param type - Type of operation: 'translate' | 'embedding' | 'search' | 'default'
 * @returns true if error was handled, false otherwise
 */
export function handleRateLimitError(
  error: unknown,
  type: keyof typeof ERROR_MESSAGES = "default"
): boolean {
  const axiosError = error as AxiosErrorResponse;
  const errorData = axiosError?.response?.data;
  const statusCode = axiosError?.response?.status || errorData?.status;

  // Check if this is a rate limit error
  if (statusCode !== 429) {
    return false;
  }

  const retryAfterSeconds = errorData?.retryAfterSeconds || 60;

  // Get localized error message
  let errorMessage = ERROR_MESSAGES[type] || ERROR_MESSAGES.default;
  errorMessage = errorMessage.replace(
    "{seconds}",
    retryAfterSeconds.toString()
  );

  // Show countdown toast
  let timeLeft = retryAfterSeconds;
  const countdownToast = toast.error(
    `⚠️ ${errorMessage}\n\n⏱️ Thời gian còn lại: ${timeLeft}s`,
    {
      duration: retryAfterSeconds * 1000,
      id: `rate-limit-${type}-${Date.now()}`,
    }
  );

  // Update countdown every second
  const countdownInterval = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      toast.dismiss(countdownToast);
      toast.success("✅ Bạn có thể thực hiện thao tác lại ngay bây giờ!", {
        duration: 5000,
      });
    } else {
      // Update toast message with new countdown
      toast.error(`⚠️ ${errorMessage}\n\n⏱️ Thời gian còn lại: ${timeLeft}s`, {
        id: countdownToast,
        duration: (timeLeft + 1) * 1000,
      });
    }
  }, 1000);

  return true;
}

/**
 * Get user-friendly Vietnamese error message from API error
 * @param error - The axios error object
 * @param defaultMessage - Default message if no specific message found
 * @returns Vietnamese error message
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string
): string {
  const axiosError = error as AxiosErrorResponse;
  const errorData = axiosError?.response?.data;

  // Return API error message if available, otherwise use default
  return errorData?.message || defaultMessage;
}

/**
 * Check if error is a rate limit error
 * @param error - The axios error object
 * @returns true if error is rate limit (429)
 */
export function isRateLimitError(error: unknown): boolean {
  const axiosError = error as AxiosErrorResponse;
  const errorData = axiosError?.response?.data;
  const statusCode = axiosError?.response?.status || errorData?.status;

  return statusCode === 429;
}
