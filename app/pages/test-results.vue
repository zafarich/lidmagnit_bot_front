<template>
  <div class="min-h-screen bg-brand-bg md:bg-gray-50 text-gray-800">
    <div class="max-w-md mx-auto bg-white min-h-screen shadow-sm pt-6 px-5 pb-10">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <button
          @click="router.push('/')"
          class="p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-gray-900">Test natijalari</h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- No Results -->
      <div v-else-if="!testAnswers || testAnswers.length === 0" class="text-center py-20">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          📝
        </div>
        <p class="text-gray-500">Test natijalari topilmadi</p>
        <NuxtLink
          to="/onboarding/test-info"
          class="inline-block mt-4 px-6 py-3 bg-brand-primary text-white rounded-xl font-medium"
        >
          Test topshirish
        </NuxtLink>
      </div>

      <!-- Results -->
      <div v-else>
        <!-- Summary Card -->
        <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm mb-1">Natijangiz</p>
              <p class="text-3xl font-bold">{{ correctCount }} / {{ testAnswers.length }}</p>
              <p class="text-blue-100 text-sm mt-1">{{ percentage }}% to'g'ri</p>
            </div>
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold">{{ gradeLevel }}</span>
            </div>
          </div>
        </div>

        <!-- Questions List -->
        <div class="space-y-3">
          <div
            v-for="(answer, index) in testAnswers"
            :key="answer.questionId"
            class="rounded-xl border-2 overflow-hidden transition-all"
            :class="answer.isCorrect ? 'border-green-200' : 'border-red-200'"
          >
            <!-- Question Header -->
            <button
              @click="toggleQuestion(index)"
              class="w-full px-4 py-3 flex items-center gap-3 text-left"
              :class="answer.isCorrect ? 'bg-green-50' : 'bg-red-50'"
            >
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                :class="answer.isCorrect ? 'bg-green-500' : 'bg-red-500'"
              >
                <svg v-if="answer.isCorrect" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span class="flex-1 font-medium text-gray-800 text-sm">
                {{ index + 1 }}-savol
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-gray-400 transition-transform"
                :class="{ 'rotate-180': expandedQuestions[index] }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Question Details (expandable) -->
            <div v-if="expandedQuestions[index]" class="px-4 py-3 border-t bg-white">
              <p class="text-sm text-gray-700 mb-3 whitespace-pre-line">{{ getQuestion(answer.questionId)?.question }}</p>

              <div class="space-y-2">
                <div
                  v-for="(option, optIndex) in getQuestion(answer.questionId)?.options"
                  :key="optIndex"
                  class="flex items-start gap-2 px-3 py-2 rounded-lg text-sm"
                  :class="getOptionClass(answer, optIndex)"
                >
                  <span class="font-medium flex-shrink-0 mt-0.5">{{ String.fromCharCode(65 + optIndex) }})</span>
                  <span>{{ option }}</span>
                  <svg
                    v-if="optIndex === answer.correct"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 text-green-600 flex-shrink-0 ml-auto mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import quizData from '../data/quiz.json';

definePageMeta({
  layout: "default",
});

const router = useRouter();
const userData = inject("userData", ref(null));

const loading = ref(false);
const expandedQuestions = ref({});

const testAnswers = computed(() => userData.value?.testAnswers || []);
const gradeLevel = computed(() => userData.value?.grade?.level || '');
const correctCount = computed(() => testAnswers.value.filter(a => a.isCorrect).length);
const percentage = computed(() => {
  if (testAnswers.value.length === 0) return 0;
  return Math.round((correctCount.value / testAnswers.value.length) * 100);
});

// Flatten quiz questions for lookup
const allQuestions = computed(() => {
  const questions = [];
  quizData.sections.forEach((section) => {
    section.questions.forEach((q) => {
      questions.push(q);
    });
  });
  return questions;
});

const getQuestion = (questionId) => {
  return allQuestions.value.find(q => q.id === questionId);
};

const toggleQuestion = (index) => {
  expandedQuestions.value[index] = !expandedQuestions.value[index];
};

const getOptionClass = (answer, optIndex) => {
  if (optIndex === answer.correct) {
    return 'bg-green-50 text-green-800';
  }
  if (optIndex === answer.selected && !answer.isCorrect) {
    return 'bg-red-50 text-red-800';
  }
  return 'text-gray-600';
};
</script>
