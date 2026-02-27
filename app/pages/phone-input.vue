<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-brand-dark mb-2">
          Telefon raqamingiz
        </h1>
        <p class="text-brand-dark/60 text-sm">
          Dasturni davom ettirish uchun telefon raqamingizni kiriting
        </p>
      </div>

      <!-- Phone Input Form -->
      <form @submit.prevent="submitPhone" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-brand-dark mb-2">
            Telefon raqam
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/50 font-medium">
              +998
            </span>
            <input
              v-model="phone"
              type="tel"
              placeholder="90 123 45 67"
              class="w-full pl-16 pr-4 py-4 bg-brand-bg border-2 border-transparent rounded-xl text-brand-dark placeholder-brand-dark/30 focus:border-brand-primary focus:outline-none transition-colors"
              maxlength="12"
              @input="formatPhone"
            />
          </div>
          <p v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="!isValid || loading"
          class="w-full py-4 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'Yuklanmoqda...' : 'Davom etish' }}</span>
        </button>
      </form>

      <!-- Dev Mode Skip Button -->
      <div v-if="isDev" class="mt-4 pt-4 border-t border-gray-100">
        <button
          @click="skipForDev"
          class="w-full py-3 text-brand-dark/50 text-sm hover:text-brand-primary transition-colors"
        >
          Development: Telefonsiz davom etish →
        </button>
      </div>

      <!-- Info -->
      <p class="mt-6 text-center text-xs text-brand-dark/40">
        Telefon raqamingiz xavfsiz saqlanadi va faqat identifikatsiya uchun ishlatiladi
      </p>
    </div>
  </div>
</template>

<script setup>
// Set layout
definePageMeta({
  layout: 'default',
});

const router = useRouter();
const telegramUser = useTelegramUser();
const config = useRuntimeConfig();
const refreshUserData = inject('refreshUserData', () => {});

const phone = ref('');
const error = ref('');
const loading = ref(false);

const isDev = computed(() => process.dev);

const isValid = computed(() => {
  const digits = phone.value.replace(/\D/g, '');
  return digits.length === 9;
});

const formatPhone = (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 9) value = value.slice(0, 9);
  
  if (value.length >= 2) {
    value = value.slice(0, 2) + ' ' + value.slice(2);
  }
  if (value.length >= 6) {
    value = value.slice(0, 6) + ' ' + value.slice(6);
  }
  if (value.length >= 9) {
    value = value.slice(0, 9) + ' ' + value.slice(9);
  }
  
  phone.value = value;
  error.value = '';
};

const submitPhone = async () => {
  if (!isValid.value) {
    error.value = 'To\'g\'ri telefon raqam kiriting';
    return;
  }
  
  if (!telegramUser.value?.id) {
    error.value = 'Telegram Web App dan foydalaning';
    return;
  }
  
  loading.value = true;
  
  try {
    const cleanPhone = '998' + phone.value.replace(/\D/g, '');
    
    const response = await $fetch(`${config.public.apiBase}/api/users/phone`, {
      method: 'POST',
      body: {
        telegramId: telegramUser.value.id,
        phoneNumber: cleanPhone,
      },
    });
    
    if (response.success) {
      // Refresh user data in layout
      await refreshUserData();
      router.push('/onboarding/name');
    }
  } catch (err) {
    error.value = err?.data?.error || 'Xatolik yuz berdi. Qayta urinib ko\'ring.';
  } finally {
    loading.value = false;
  }
};

// Development mode: skip phone input
const skipForDev = async () => {
  if (!telegramUser.value?.id) return;
  
  try {
    // Save mock phone for dev
    await $fetch(`${config.public.apiBase}/api/users/phone`, {
      method: 'POST',
      body: {
        telegramId: telegramUser.value.id,
        phoneNumber: '998901234567',
      },
    });
    
    await refreshUserData();
    router.push('/onboarding/name');
  } catch (err) {
    console.error('Dev skip error:', err);
    // Even if API fails, continue in dev
    router.push('/onboarding/name');
  }
};

// Check if already has phone
onMounted(async () => {
  if (!telegramUser.value?.id) return;
  
  try {
    const userData = await $fetch(`${config.public.apiBase}/api/users/me/${telegramUser.value.id}`);
    if (userData.phoneNumber) {
      const step = userData.onboarding?.currentStep;
      if (step === 'name') router.push('/onboarding/name');
      else if (step === 'schedule') router.push('/onboarding/schedule');
      else if (step === 'test-info') router.push('/onboarding/test-info');
      else if (step === 'test') router.push('/onboarding/test');
      else if (step === 'completed') router.push('/');
    }
  } catch (err) {
    console.error('Error checking user:', err);
  }
});
</script>
