<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Progress -->
      <div class="mb-8">
        <div class="flex items-center justify-between text-sm mb-2">
          <span class="font-medium text-brand-primary">2/3</span>
          <span class="text-brand-dark/50">Dars rejasi</span>
        </div>
        <div class="h-2 bg-white rounded-full overflow-hidden">
          <div class="h-full w-2/3 bg-brand-primary rounded-full transition-all duration-500" />
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h1 class="text-2xl font-bold text-brand-dark mb-2">
          Qachon tayyorlanasiz?
        </h1>
        <p class="text-brand-dark/60 mb-8">
          Kunning qaysi paytida dars qilish uchun qulay vaqt tanlang
        </p>

        <!-- Period Selection -->
        <div class="space-y-3 mb-6">
          <button
            v-for="period in periods"
            :key="period.id"
            @click="selectPeriod(period.id)"
            :class="[
              'w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4',
              selectedPeriod === period.id
                ? 'border-brand-primary bg-brand-soft'
                : 'border-transparent bg-brand-bg hover:bg-brand-bg/80'
            ]"
          >
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-2xl', period.bgColor]">
              {{ period.icon }}
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-brand-dark">{{ period.label }}</h3>
              <p class="text-sm text-brand-dark/50">{{ period.timeRange }}</p>
            </div>
            <div
              :class="[
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                selectedPeriod === period.id ? 'border-brand-primary bg-brand-primary' : 'border-brand-dark/20'
              ]"
            >
              <svg v-if="selectedPeriod === period.id" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </button>
        </div>

        <!-- Hour Selection (Collapsible) -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="selectedPeriod" class="overflow-hidden">
            <p class="text-sm font-medium text-brand-dark mb-3">
              Soatni tanlang:
            </p>
            <div class="grid grid-cols-3 gap-2 mb-6">
              <button
                v-for="hour in availableHours"
                :key="hour"
                @click="selectHour(hour)"
                :class="[
                  'py-3 px-2 rounded-xl text-sm font-medium transition-all',
                  selectedHour === hour
                    ? 'bg-brand-primary text-white'
                    : 'bg-brand-bg text-brand-dark hover:bg-brand-primary/10'
                ]"
              >
                {{ formatHour(hour) }}
              </button>
            </div>
          </div>
        </transition>

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <button
          @click="submitSchedule"
          :disabled="!selectedPeriod || selectedHour === null || loading"
          class="w-full py-4 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'Saqlanmoqda...' : 'Davom etish' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
});

const router = useRouter();
const telegramUser = useTelegramUser();
const config = useRuntimeConfig();
const userData = inject('userData', ref(null));

const periods = [
  {
    id: 'morning',
    label: 'Ertalab',
    timeRange: '05:00 - 12:00',
    icon: '🌅',
    bgColor: 'bg-orange-100',
    hours: [5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'afternoon',
    label: 'Kunduzi',
    timeRange: '12:00 - 17:00',
    icon: '☀️',
    bgColor: 'bg-yellow-100',
    hours: [12, 13, 14, 15, 16],
  },
  {
    id: 'evening',
    label: 'Kechqurun',
    timeRange: '17:00 - 23:00',
    icon: '🌙',
    bgColor: 'bg-indigo-100',
    hours: [17, 18, 19, 20, 21, 22],
  },
];

const selectedPeriod = ref(null);
const selectedHour = ref(null);
const error = ref('');
const loading = ref(false);

const availableHours = computed(() => {
  const period = periods.find(p => p.id === selectedPeriod.value);
  return period ? period.hours : [];
});

const selectPeriod = (periodId) => {
  selectedPeriod.value = periodId;
  selectedHour.value = null;
  error.value = '';
};

const selectHour = (hour) => {
  selectedHour.value = hour;
  error.value = '';
};

const formatHour = (hour) => {
  return `${hour.toString().padStart(2, '0')}:00`;
};

const submitSchedule = async () => {
  if (!selectedPeriod.value || selectedHour.value === null) {
    error.value = 'Iltimos, vaqtni tanlang';
    return;
  }
  
  if (!telegramUser.value?.id) {
    error.value = 'Telegram ID topilmadi';
    return;
  }
  
  loading.value = true;
  
  try {
    const response = await $fetch(`${config.public.apiBase}/api/users/onboarding/schedule`, {
      method: 'POST',
      body: {
        telegramId: telegramUser.value.id,
        period: selectedPeriod.value,
        hour: selectedHour.value,
      },
    });
    
    if (response.success) {
      // Update userData with full data from server response
      const { success, message, ...userDataFromServer } = response;
      userData.value = userDataFromServer;
      console.log('[Schedule] Updated userData:', userData.value);
      
      await nextTick();
      router.push('/onboarding/test-info');
    }
  } catch (err) {
    error.value = err?.data?.error || 'Xatolik yuz berdi. Qayta urinib ko\'ring.';
  } finally {
    loading.value = false;
  }
};
</script>
