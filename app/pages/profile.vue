<template>
  <div class="min-h-screen bg-brand-bg md:bg-gray-50 text-gray-800">
    <div
      class="max-w-md mx-auto bg-white min-h-[calc(100vh-80px)] shadow-sm pt-8 px-5 pb-10"
    >
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Profilingiz</h1>
        <p class="text-gray-500 text-sm">
          Shaxsiy ma'lumotlaringiz va jadvalingizni yangilang
        </p>
      </div>

      <div class="space-y-6">
        <!-- Name Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Ismingiz</label
          >
          <input
            v-model="form.firstName"
            type="text"
            class="w-full p-4 rounded-xl border-2 border-transparent bg-brand-bg transition-colors focus:border-brand-primary focus:bg-white outline-none"
            placeholder="Ismingizni kiriting"
          />
        </div>

        <!-- Phone Input (Disabled) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Telefon raqamingiz</label
          >
          <input
            v-model="form.phoneNumber"
            type="text"
            disabled
            class="w-full p-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
          />
        </div>

        <!-- Grade Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Darajangiz</label
          >
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="grade in grades"
              :key="grade"
              @click="form.grade = grade"
              :class="[
                'py-3 rounded-xl border-2 font-bold transition-all text-center',
                form.grade === grade
                  ? 'border-brand-primary bg-brand-soft text-brand-primary'
                  : 'border-transparent bg-brand-bg text-gray-500 hover:bg-brand-bg/80 hover:text-gray-700',
              ]"
            >
              {{ grade }}
            </button>
          </div>
        </div>

        <!-- Free Time Section -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Bo'sh vaqtingiz (Eslatma uchun)</label
          >

          <!-- Period Selector -->
          <div class="grid grid-cols-1 gap-3 mb-4">
            <button
              v-for="period in periods"
              :key="period.id"
              @click="
                form.period = period.id;
                form.hour = null;
              "
              :class="[
                'p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between',
                form.period === period.id
                  ? 'border-brand-primary bg-brand-soft'
                  : 'border-transparent bg-brand-bg hover:bg-brand-bg/80',
              ]"
            >
              <div class="flex items-center gap-3">
                <span class="text-xl">{{ period.icon }}</span>
                <span class="font-medium text-gray-900">{{
                  period.label
                }}</span>
              </div>
            </button>
          </div>

          <!-- Hour Selector -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="form.period" class="overflow-hidden mb-2">
              <p class="text-sm font-medium text-gray-600 mb-3">
                Soatni tanlang:
              </p>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="hour in availableHours"
                  :key="hour"
                  @click="form.hour = hour"
                  :class="[
                    'py-2 px-1 rounded-xl text-sm font-medium transition-all text-center',
                    form.hour === hour
                      ? 'bg-brand-primary text-white'
                      : 'bg-brand-soft text-brand-dark hover:bg-brand-primary/10',
                  ]"
                >
                  {{ formatHour(hour) }}
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Status Message -->
        <p
          v-if="message"
          :class="[
            isError ? 'text-red-500' : 'text-green-500',
            'text-sm text-center font-medium',
          ]"
        >
          {{ message }}
        </p>

        <!-- Submit Button -->
        <button
          @click="saveProfile"
          :disabled="loading || (form.period && form.hour === null)"
          class="w-full py-4 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 flex justify-center items-center gap-2"
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
          <span>{{ loading ? "Saqlanmoqda..." : "Saqlash" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

const config = useRuntimeConfig();
const telegramUser = useTelegramUser();
const userData = inject("userData", ref(null));
const refreshUserData = inject("refreshUserData", () => {});

const loading = ref(false);
const message = ref("");
const isError = ref(false);

const periods = [
  {
    id: "morning",
    label: "Ertalab (05:00 - 12:00)",
    icon: "🌅",
    hours: [5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: "afternoon",
    label: "Kunduzi (12:00 - 17:00)",
    icon: "☀️",
    hours: [12, 13, 14, 15, 16],
  },
  {
    id: "evening",
    label: "Kechqurun (17:00 - 23:00)",
    icon: "🌙",
    hours: [17, 18, 19, 20, 21, 22],
  },
];

const grades = ["C", "C+", "B", "B+", "A", "A+"];

const form = reactive({
  firstName: "",
  phoneNumber: "",
  grade: null,
  period: null,
  hour: null,
});

const availableHours = computed(() => {
  const period = periods.find((p) => p.id === form.period);
  return period ? period.hours : [];
});

const formatHour = (hour) => {
  return `${hour.toString().padStart(2, "0")}:00`;
};

// Initialize form matching existing user data
watch(
  userData,
  (newData) => {
    if (newData) {
      form.firstName =
        newData.firstName || newData.onboarding?.studentName || "";
      form.phoneNumber = newData.phoneNumber || "";
      form.grade = newData.grade?.level || null;

      const schedule = newData.onboarding?.studySchedule;
      if (schedule && schedule.period) {
        form.period = schedule.period;
        form.hour = schedule.hour;
      }
    }
  },
  {immediate: true, deep: true},
);

const saveProfile = async () => {
  message.value = "";

  if (!form.firstName.trim()) {
    isError.value = true;
    message.value = "Kechirasiz, ism kiritish majburiy.";
    return;
  }

  if (form.period && form.hour === null) {
    isError.value = true;
    message.value = "Iltimos, soatni tanlang.";
    return;
  }

  if (process.dev && !telegramUser.value?.id) {
    // Local testing mode
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      isError.value = false;
      message.value = "Saqlandi! (Sinov rejimi)";
    }, 1000);
    return;
  }

  if (!telegramUser.value?.id) {
    isError.value = true;
    message.value = "Telegram ID topilmadi";
    return;
  }

  loading.value = true;

  try {
    const payload = {
      firstName: form.firstName,
    };

    if (form.grade) {
      payload.grade = form.grade;
    }

    if (form.period && form.hour !== null) {
      payload.studySchedule = {
        period: form.period,
        hour: form.hour,
      };
    }

    const response = await $fetch(
      `${config.public.apiBase}/api/users/profile/${telegramUser.value.id}`,
      {
        method: "PUT",
        body: payload,
      },
    );

    if (response.success) {
      await refreshUserData();
      isError.value = false;
      message.value = "Muvaffaqiyatli saqlandi!";
      setTimeout(() => {
        message.value = "";
      }, 3000);
    }
  } catch (err) {
    isError.value = true;
    message.value =
      err?.data?.error || "Xatolik yuz berdi. Qayta urinib ko'ring.";
  } finally {
    loading.value = false;
  }
};
</script>
