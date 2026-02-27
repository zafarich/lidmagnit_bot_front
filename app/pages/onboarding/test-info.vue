<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Progress -->
      <div class="mb-8">
        <div class="flex items-center justify-between text-sm mb-2">
          <span class="font-medium text-brand-primary">3/3</span>
          <span class="text-brand-dark/50">Bilim testi</span>
        </div>
        <div class="h-2 bg-white rounded-full overflow-hidden">
          <div
            class="h-full w-full bg-brand-primary rounded-full transition-all duration-500"
          />
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <!-- Illustration -->
        <div
          class="w-24 h-24 bg-brand-soft rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-12 h-12 text-brand-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-brand-dark mb-3">
          Darajangizni bilish uchun qisqa testdan o'ting
        </h1>
        <p class="text-brand-dark/60 mb-8 leading-relaxed">
          Bu test orqali sizning bilim darajangizni aniqlab, shu darajaga mos
          darslarni tavsiya qilamiz. Test 10-15 daqiqa davom etadi.
        </p>

        <!-- Features -->
        <div class="flex justify-center gap-4 mb-8 text-sm text-brand-dark/70">
          <div class="flex items-center gap-1.5">
            <svg
              class="w-4 h-4 text-brand-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>15 ta savol</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg
              class="w-4 h-4 text-brand-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>10-15 daqiqa</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg
              class="w-4 h-4 text-brand-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Shaxsiy natija</span>
          </div>
        </div>

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <button
          @click="startTest"
          :disabled="loading"
          class="w-full py-4 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <svg
            v-if="loading"
            class="animate-spin w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{ loading ? "Yuklanmoqda..." : "Testni boshlash" }}</span>
          <svg
            v-if="!loading"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        <button
          @click="skipTest"
          :disabled="loading"
          class="w-full mt-3 py-3 text-brand-dark/50 text-sm hover:text-brand-dark transition-colors"
        >
          Keyinroq o'taman
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

const router = useRouter();
const route = useRoute();
const telegramUser = useTelegramUser();
const config = useRuntimeConfig();
const userData = inject("userData", ref(null));
const {resetQuiz} = useQuiz();

const error = ref("");
const loading = ref(false);

const startTest = async () => {
  // Reset quiz state before starting
  resetQuiz();

  // Dev mode without API
  if (process.dev) {
    console.log("[Dev] Starting test...");
    router.push("/onboarding/test");
    return;
  }

  if (!telegramUser.value?.id) {
    error.value = "Telegram ID topilmadi";
    return;
  }

  loading.value = true;

  try {
    await $fetch(`${config.public.apiBase}/api/users/onboarding/test-start`, {
      method: "POST",
      body: {
        telegramId: telegramUser.value.id,
      },
    });

    // Manually update userData to reflect test started
    if (userData.value) {
      userData.value.onboarding = {
        ...userData.value.onboarding,
        currentStep: "test",
        testStarted: true,
      };
    }
    
    router.push("/onboarding/test");
  } catch (err) {
    error.value =
      err?.data?.error || "Xatolik yuz berdi. Qayta urinib ko'ring.";
    loading.value = false;
  }
};

const skipTest = async () => {
  // Dev mode - simulate API response and update userData
  if (process.dev) {
    console.log("[Dev] Skipping test, updating userData...");
    
    // Simulate backend response - mark onboarding as completed
    userData.value = {
      ...userData.value,
      onboarding: {
        ...(userData.value?.onboarding || {}),
        currentStep: "completed",
        isCompleted: true,
      },
    };
    
    console.log("[Dev] Updated userData:", userData.value);
    await nextTick();
    await router.push("/");
    return;
  }

  if (!telegramUser.value?.id) {
    console.error("[Prod] No telegram user ID");
    return;
  }

  loading.value = true;

  try {
    console.log("[Prod] Calling test-skip API for telegramId:", telegramUser.value.id);
    
    // Call API to skip test - returns FULL user data
    const response = await $fetch(`${config.public.apiBase}/api/users/onboarding/test-skip`, {
      method: "POST",
      body: {
        telegramId: telegramUser.value.id,
      },
    });

    console.log("[Prod] test-skip API response:", response);

    // Update userData with FULL data from server response
    if (response.success) {
      // Replace entire userData with server response (excluding success/message)
      const { success, message, ...userDataFromServer } = response;
      userData.value = userDataFromServer;
      console.log("[Prod] Updated userData with full server data:", userData.value);
    } else {
      console.warn("[Prod] API returned success: false");
    }
    
    // Wait for Vue reactivity
    await nextTick();
    
    // Navigate to home page
    await router.push("/");
  } catch (err) {
    console.error("[Prod] test-skip API error:", err);
    error.value = err?.data?.error || "Xatolik yuz berdi. Qayta urinib ko'ring.";
    loading.value = false;
  }
};
</script>
