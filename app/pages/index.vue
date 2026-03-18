<template>
  <div class="min-h-screen bg-brand-bg md:bg-gray-50 text-gray-800">
    <div
      class="max-w-md mx-auto bg-white min-h-screen shadow-sm pt-8 px-5 pb-10"
    >
      <!-- Greeting and Grade -->
      <div class="mb-10">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">
          Salom, <span class="capitalize">{{ userName }}</span>
          <span class="text-xl">👋</span>
        </h1>
        <div v-if="hasGrade" class="flex items-center gap-2 mt-3">
          <span class="text-gray-500 font-medium"
            >Sizning hozirgi natijangiz:</span
          >
          <span
            class="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-lg"
          >
            {{ userGrade }}
          </span>
        </div>
      </div>

      <!-- Trial Test Block (No Grade Yet) -->
      <div
        v-if="!hasGrade"
        class="bg-brand-soft border border-brand-primary/20 rounded-2xl p-6 mb-8 text-center shadow-sm"
      >
        <div
          class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm border border-brand-primary/10"
        >
          🎯
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">
          Darajangizni aniqlang
        </h3>
        <p class="text-gray-600 text-sm mb-5">
          Darslarni boshlash uchun o'z bilim darajangizni bilish maqsadida qisqa
          sinov testidan o'ting.
        </p>
        <NuxtLink
          to="/onboarding/test-info"
          class="inline-block w-full py-3.5 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-primary/90 transition-colors"
        >
          Sinov test topshirish
        </NuxtLink>
      </div>

      <!-- Progress Section -->
      <div
        v-if="hasGrade"
        class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
      >
        <div class="relative">
          <!-- Labels Top -->
          <div class="flex justify-between pb-3">
            <span
              v-for="(grade, index) in grades"
              :key="'label-' + index"
              class="w-6 text-center text-[13px] font-black tracking-wide"
              :class="
                currentGradeIndex >= index ? 'text-blue-600' : 'text-gray-300'
              "
            >
              {{ grade }}
            </span>
          </div>

          <!-- Bar & Nodes -->
          <div class="relative h-6 flex items-center">
            <!-- Background track -->
            <div
              class="absolute left-[12px] right-[12px] h-2.5 bg-gray-100 rounded-full overflow-hidden"
            >
              <!-- Active track -->
              <div
                class="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                :style="{width: progressPercentage + '%'}"
              ></div>
            </div>

            <!-- Nodes -->
            <div class="absolute w-full flex justify-between">
              <div
                v-for="(grade, index) in grades"
                :key="'node-' + index"
                class="relative w-6 h-6 rounded-full border-[4px] border-white shadow-sm transition-colors duration-500 z-10"
                :class="
                  currentGradeIndex >= index ? 'bg-blue-600' : 'bg-gray-200'
                "
              ></div>
            </div>
          </div>

          <!-- Date Bottom -->
          <div class="relative mt-3 flex justify-end">
            <span class="text-xs font-bold text-gray-400 mr-[2px]"
              >25-aprel</span
            >
          </div>
        </div>
      </div>

      <!-- Motivation Block -->
      <div
        v-if="hasGrade"
        class="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30"
      >
        <!-- Decorative bg -->
        <div
          class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"
        ></div>
        <div
          class="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"
        ></div>

        <div class="relative z-10 flex gap-4 items-start">
          <div
            class="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl shadow-inner border border-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-1 mt-0.5 text-white leading-tight">
              Ajoyib natija!
            </h3>
            <p class="text-blue-50 text-sm leading-relaxed opacity-95">
              O'z ustingizda ishlashda davom eting. Maqsadingizga erishish uchun
              yana biroz harakat qilishingiz kerak!
            </p>
          </div>
        </div>
      </div>

      <!-- Retake Test Button -->
      <div v-if="hasGrade" class="mt-6">
        <NuxtLink
          to="/onboarding/test-info"
          class="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-brand-primary font-medium rounded-xl border-2 border-brand-primary/20 hover:bg-brand-soft transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          Testni qayta topshirish
        </NuxtLink>
      </div>

      <!-- Features Section -->
      <div class="mt-10 mb-6">
        <!-- <h2 class="text-xl font-bold text-gray-900 mb-5 px-1">
          Nima uchun aynan biz?
        </h2> -->

        <div class="grid gap-4">
          <div
            v-for="(feature, index) in features"
            :key="'feature-' + index"
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 items-start transition-transform hover:-translate-y-1 hover:shadow-md duration-300"
          >
            <div
              class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl bg-blue-50 text-blue-600"
            >
              {{ feature.icon }}
            </div>
            <div>
              <h3 class="font-bold text-gray-900 leading-tight mb-1.5">
                {{ feature.title }}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from "vue";

definePageMeta({
  layout: "default",
});

const userData = inject("userData", ref(null));
const grades = ["C", "C+", "B", "B+", "A", "A+"];

// Features list
const features = [
  {
    icon: "💸",
    title: "O'qish pulingizni 100% qaytarib oling!",
    description:
      "Eng katta o‘sishga erishgan 5 ta odamning pullari to‘liq qaytariladi. Biz bilimga intilgan eng kuchli o'quvchilarni shunday taqdirlaymiz.",
  },
  {
    icon: "👨‍🏫",
    title: "Ikkita kuchli ustozdan jonli darslar",
    description:
      "Nimaga ikkita ustoz? Chunki Alisher Hodiyev va Muxamatova Dilbarning har biri o‘zi eng kuchli bo‘lgan bo‘limlaridan dars beradi. Bu sifatli bilim kafolati!",
  },
  {
    icon: "📚",
    title: "Alisher Hodiyevdan MS kitobi",
    description:
      "Bu kitobni tayyorlash uchun bir qancha o'qituvchilarning mehnati ketgan. Kursimizda o'qiganlar uchun tekin beriladi.",
  },
  {
    icon: "👥",
    title: "Kichik guruhlarda kurator nazorati",
    description:
      "Chunki katta guruhlar bilan sizga e'tibor bera olmaymiz. Biz sizni kichik jamoalarga bo'lamiz va har biringizga alohida kurator biriktiramiz.",
  },
  {
    icon: "🤖",
    title: "Bot sizga darslarni eslatib turadi",
    description:
      "Tayyorlanishga vaqt yo'qmi? Bizning botimiz sizga bo'sh vaqtingizda darslarni eslatib turadi va darajangizga mos aniq yo'l xaritasi beradi.",
  },
  {
    icon: "🎯",
    title: "Natija bo'lmasa, keyingi kursga 50% chegirma",
    description:
      "Natija qila olmasangiz, keyingi qabul uchun 50% chegirmaga ega bo'lasiz. Biz sizni maqsadga yetmaguningizcha yarim yo'lda tashlab qo'ymaymiz.",
  },
  {
    icon: "📈",
    title: "Sizning darajangizga mos alohida darslar",
    description:
      "Darajangizni aniqlagan holda alohida yondashuv qilamiz. Hamma bir xil narsani o'rganmaydi, aynan sizga kerakli mavzularga urg'u beriladi.",
  },
  {
    icon: "📹",
    title: "Barcha darslar yozib olingan holda turadi",
    description:
      "Yozib olingan videodarslar sizga istalgan vaqtda mavzuni qayta ko'rish va mustahkamlash imkonini beradi.",
  },
];

// Get name from user data
const userName = computed(() => {
  return (
    userData?.value?.firstName ||
    userData?.value?.first_name ||
    userData?.value?.name ||
    "do'stim"
  );
});

// Get grade from user data
const userGrade = computed(() => {
  const level = userData?.value?.grade?.level;
  if (grades.includes(level)) return level;
  return "C";
});

const hasGrade = computed(() => {
  return !!userData?.value?.grade?.level;
});

// Calculate current step for progress bar (0 to 5)
const currentGradeIndex = computed(() => {
  return Math.max(0, grades.indexOf(userGrade.value));
});

// Translate step to percentage (0% to 100%)
const progressPercentage = computed(() => {
  return (currentGradeIndex.value / (grades.length - 1)) * 100;
});
</script>
