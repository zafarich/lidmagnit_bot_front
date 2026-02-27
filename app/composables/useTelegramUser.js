export const useTelegramUser = () => {
  const user = useState("telegramUser", () => null);

  onMounted(() => {
    // Development mode: mock user
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === undefined
    ) {
      user.value = {
        id: 907423583,
        first_name: "Test",
        last_name: "User",
        username: "testuser",
        language_code: "uz",
      };
      console.log("[Dev] Mock Telegram user:", user.value);
      return;
    }

    // Production: real Telegram Web App
    if (process.client && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      if (tg.initDataUnsafe?.user) {
        user.value = tg.initDataUnsafe.user;
      }
    }
  });

  return user;
};

export default useTelegramUser;
