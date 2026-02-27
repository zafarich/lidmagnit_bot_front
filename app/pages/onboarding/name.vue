<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Progress -->
      <div class="mb-8">
        <div class="flex items-center justify-between text-sm mb-2">
          <span class="font-medium text-brand-primary">1/3</span>
          <span class="text-brand-dark/50">Shaxsiy ma'lumotlar</span>
        </div>
        <div class="h-2 bg-white rounded-full overflow-hidden">
          <div class="h-full w-1/3 bg-brand-primary rounded-full transition-all duration-500" />
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h1 class="text-2xl font-bold text-brand-dark mb-2">
          Ismingiz nima?
        </h1>
        <p class="text-brand-dark/60 mb-8">
          Sizga murojaat qilishimiz uchun ismingizni kiriting
        </p>

        <form @submit.prevent="submitName" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-brand-dark mb-2">
              Ism
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="Masalan: Aziz"
              class="w-full px-4 py-4 bg-brand-bg border-2 border-transparent rounded-xl text-brand-dark placeholder-brand-dark/30 focus:border-brand-primary focus:outline-none transition-colors"
              maxlength="50"
            />
            <p v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="!name.trim() || loading"
            class="w-full py-4 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Saqlanmoqda...' : 'Davom etish' }}</span>
          </button>
        </form>
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

const name = ref('');
const error = ref('');
const loading = ref(false);

// Dev mode: pre-fill with mock name
onMounted(() => {
  if (process.dev && telegramUser.value?.first_name) {
    name.value = telegramUser.value.first_name;
  }
});

const submitName = async () => {
  const trimmedName = name.value.trim();
  
  if (trimmedName.length < 2) {
    error.value = 'Ism kamida 2 ta harfdan iborat bo\'lishi kerak';
    return;
  }
  
  if (!telegramUser.value?.id) {
    error.value = 'Telegram ID topilmadi';
    return;
  }
  
  loading.value = true;
  
  try {
    const response = await $fetch(`${config.public.apiBase}/api/users/onboarding/name`, {
      method: 'POST',
      body: {
        telegramId: telegramUser.value.id,
        studentName: trimmedName,
      },
    });
    
    if (response.success) {
      // Update userData with full data from server response
      const { success, message, ...userDataFromServer } = response;
      userData.value = userDataFromServer;
      console.log('[Name] Updated userData:', userData.value);
      
      await nextTick();
      router.push('/onboarding/schedule');
    }
  } catch (err) {
    error.value = err?.data?.error || 'Xatolik yuz berdi. Qayta urinib ko\'ring.';
  } finally {
    loading.value = false;
  }
};
</script>
