<template>
  <div class="min-h-screen bg-brand-bg">
    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="toast.show"
        class="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
        :class="
          toast.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-green-500 text-white'
        "
      >
        <svg
          v-if="toast.type === 'success'"
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
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span class="flex-1 text-sm font-medium">{{ toast.message }}</span>
        <button
          @click="toast.show = false"
          class="p-1 hover:bg-white/20 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Header with Progress -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between mb-3">
          <h1 class="text-lg font-bold text-brand-dark">
            {{ quiz.quiz_title }}
          </h1>
          <span class="text-sm font-medium text-brand-primary">
            {{ currentQuestionNumber }} / {{ totalQuestions }}
          </span>
        </div>
        <div class="h-2 bg-brand-bg rounded-full overflow-hidden">
          <div
            class="h-full bg-brand-primary rounded-full transition-all duration-300"
            :style="{width: `${progress}%`}"
          />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-3xl mx-auto px-4 py-6">
      <!-- Question Card -->
      <div
        v-if="currentQuestion && !isCompleted"
        class="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <!-- Section Context (if new section) -->
        <div
          v-if="isNewSection && currentSection"
          class="border-b border-gray-100"
        >
          <!-- Context Text -->
          <div
            v-if="currentQuestion.contextText"
            class="px-6 py-4 bg-gray-50/50"
          >
            <h3
              v-if="currentQuestion.contextTitle"
              class="font-semibold text-brand-dark mb-2"
            >
              {{ currentQuestion.contextTitle }}
            </h3>
            <div
              class="text-sm text-brand-dark/80 leading-relaxed whitespace-pre-line"
            >
              {{ currentQuestion.contextText }}
            </div>
          </div>
        </div>

        <!-- Question Header for non-first questions in section -->
        <div
          v-if="!isNewSection && currentQuestion.contextText"
          class="px-6 py-3 bg-brand-soft/30 border-b border-gray-100"
        >
          <button
            @click="openContextModal"
            class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-primary bg-brand-soft rounded-lg hover:bg-brand-primary hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Matnni ko'rish
          </button>
        </div>

        <!-- Question -->
        <div class="p-6">
          <h3
            class="text-lg font-medium text-brand-dark mb-6 whitespace-pre-line"
          >
            {{ currentQuestion.question }}
          </h3>

          <!-- Options -->
          <div class="space-y-3">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="selectAnswer(currentQuestion.id, index)"
              :class="[
                'w-full p-4 rounded-xl border-2 text-left transition-all',
                getAnswer(currentQuestion.id) === index
                  ? 'border-brand-primary bg-brand-soft'
                  : 'border-gray-100 bg-gray-50 hover:border-brand-primary/30 hover:bg-brand-soft/30',
              ]"
            >
              <div class="flex items-start gap-3">
                <div
                  :class="[
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                    getAnswer(currentQuestion.id) === index
                      ? 'border-brand-primary bg-brand-primary'
                      : 'border-gray-300',
                  ]"
                >
                  <span
                    :class="[
                      'text-xs font-medium',
                      getAnswer(currentQuestion.id) === index
                        ? 'text-white'
                        : 'text-gray-500',
                    ]"
                  >
                    {{ String.fromCharCode(65 + index) }}
                  </span>
                </div>
                <span class="text-brand-dark leading-relaxed">{{
                  option
                }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div
          class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between"
        >
          <button
            @click="goToPrevious"
            :disabled="currentQuestionIndex === 0"
            class="flex items-center gap-2 px-4 py-2 text-brand-dark/60 hover:text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Oldingi</span>
          </button>

          <button
            v-if="currentQuestionIndex < totalQuestions - 1"
            @click="goToNext"
            class="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
          >
            <span>Keyingi</span>
            <svg
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
            v-else
            @click="finishQuiz"
            :disabled="!hasAnswer(currentQuestion.id) || saving"
            class="flex items-center gap-2 px-6 py-2 bg-brand-success text-white rounded-lg hover:bg-brand-success/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="saving"
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
            <span>{{ saving ? "Saqlanmoqda..." : "Yakunlash" }}</span>
            <svg
              v-if="!saving"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Results -->
      <div
        v-else-if="isCompleted"
        class="bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        <div
          class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          :style="{backgroundColor: currentGrade.color + '20'}"
        >
          <span
            class="text-5xl font-bold"
            :style="{color: currentGrade.color}"
            >{{ currentGrade.grade }}</span
          >
        </div>

        <h2 class="text-2xl font-bold text-brand-dark mb-2">Tabriklaymiz!</h2>
        <p class="text-brand-dark/60 mb-2">Sizning darajangiz:</p>
        <p
          class="text-xl font-medium mb-8"
          :style="{color: currentGrade.color}"
        >
          {{ currentGrade.label }}
        </p>

        <div class="flex gap-3 justify-center">
          <button
            @click="restartQuiz"
            class="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition"
          >
            Qayta topshirish
          </button>
          <button
            @click="goHome"
            class="px-6 py-3 bg-brand-soft text-brand-primary rounded-lg hover:bg-brand-soft/80 transition"
          >
            Bosh sahifa
          </button>
        </div>
      </div>
    </div>

    <!-- Context Modal -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click="closeContextModal"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isModalOpen"
            class="w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            @click.stop
          >
            <!-- Modal Header -->
            <div
              class="flex items-center justify-between px-6 py-4 bg-brand-soft border-b border-gray-100"
            >
              <h2 class="text-lg font-semibold text-brand-dark">Matn</h2>
              <button
                @click="closeContextModal"
                class="p-2 text-brand-dark/50 hover:text-brand-dark hover:bg-white rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 overflow-y-auto max-h-[60vh]">
              <h3
                v-if="currentQuestion?.contextTitle"
                class="font-semibold text-brand-dark mb-4"
              >
                {{ currentQuestion.contextTitle }}
              </h3>
              <div
                class="text-base text-brand-dark/90 leading-relaxed whitespace-pre-line"
              >
                {{ currentQuestion?.contextText }}
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                @click="closeContextModal"
                class="w-full py-3 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-primary/90 transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

const router = useRouter();
const config = useRuntimeConfig();
const telegramUser = useTelegramUser();
const refreshUserData = inject("refreshUserData", () => {});

const {
  quiz,
  currentQuestion,
  currentQuestionIndex,
  currentQuestionNumber,
  totalQuestions,
  progress,
  isCompleted,
  currentSection,
  isNewSection,
  selectAnswer,
  goToNext,
  goToPrevious,
  completeQuiz,
  resetQuiz,
  hasAnswer,
  getAnswer,
} = useQuiz();

const {calculateGrade} = useGrade();

const currentGrade = ref(null);
const isModalOpen = ref(false);
const saving = ref(false);
const toast = ref({show: false, type: "success", message: ""});

const showToast = (type, message) => {
  toast.value = {show: true, type, message};
  setTimeout(() => {
    toast.value.show = false;
  }, 5000);
};

const openContextModal = () => {
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeContextModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "";
};

const finishQuiz = async () => {
  saving.value = true;

  try {
    // Calculate results
    const results = completeQuiz();
    const grade = calculateGrade(results.percentage);
    currentGrade.value = grade;

    console.log(
      "Test completed. Grade:",
      grade.grade,
      "Percentage:",
      results.percentage,
    );

    // Save grade to backend
    if (telegramUser.value?.id) {
      const apiUrl = `${config.public.apiBase}/api/users/grade`;
      console.log("Saving grade to:", apiUrl);

      try {
        const response = await $fetch(apiUrl, {
          method: "POST",
          body: {
            telegramId: telegramUser.value.id,
            grade: grade.grade,
            percentage: results.percentage,
          },
        });
        console.log("Grade saved successfully:", response);
        showToast("success", `Darajangiz saqlandi: ${grade.grade}`);

        // Refresh user data in layout
        await refreshUserData();

        // Redirect to home after a delay
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (apiError) {
        console.error("API Error:", apiError);
        showToast(
          "error",
          "Darajani saqlashda xatolik. Iltimos, qayta urinib ko'ring.",
        );
        // Continue anyway - show the result to user
      }
    } else {
      console.warn("No telegram user ID found, skipping backend save");
      showToast("error", "Foydalanuvchi ID topilmadi");
    }

    console.log("Grade saved:", grade.grade);
  } catch (error) {
    console.error("Error in finishQuiz:", error);
    showToast("error", "Xatolik yuz berdi");
  } finally {
    saving.value = false;
  }
};

const restartQuiz = () => {
  resetQuiz();
  currentGrade.value = null;
};

const goHome = async () => {
  await refreshUserData();
  router.push("/");
};

// Close modal on escape key
onMounted(() => {
  console.log("Test boshlandi!");
  console.log(`Jami savollar: ${totalQuestions.value}`);

  const handleEscape = (e) => {
    if (e.key === "Escape" && isModalOpen.value) {
      closeContextModal();
    }
  };

  document.addEventListener("keydown", handleEscape);

  onUnmounted(() => {
    document.removeEventListener("keydown", handleEscape);
    document.body.style.overflow = "";
  });
});
</script>
