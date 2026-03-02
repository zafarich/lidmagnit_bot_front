<template>
  <div class="max-w-md mx-auto px-4 pt-6">
    <h1 class="text-xl font-bold text-brand-dark mb-6">Xabar jo'natish</h1>

    <!-- Form -->
    <div v-if="!result" class="space-y-5">
      <!-- Photo upload -->
      <div>
        <label class="block text-sm font-medium text-brand-dark/80 mb-2"
          >Rasm (ixtiyoriy)</label
        >
        <div
          v-if="photoPreview"
          class="relative mb-2 rounded-xl overflow-hidden"
        >
          <img
            :src="photoPreview"
            alt="Preview"
            class="w-full max-h-48 object-cover rounded-xl"
          />
          <button
            type="button"
            class="absolute top-2 right-2 bg-black/50 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm"
            @click="removePhoto"
          >
            &times;
          </button>
        </div>
        <label
          class="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 cursor-pointer hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{{ photoFile ? "Boshqa rasm tanlash" : "Rasm tanlash" }}</span>
          <input
            type="file"
            accept="image/*"
            class="hidden"
            @change="onPhotoSelect"
          />
        </label>
      </div>

      <!-- Message textarea -->
      <div>
        <label class="block text-sm font-medium text-brand-dark/80 mb-2"
          >Xabar matni (HTML)</label
        >
        <textarea
          v-model="message"
          rows="6"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all resize-none"
          placeholder="Xabar matnini kiriting..."
        ></textarea>
        <p class="text-xs text-gray-400 mt-1">
          Teglar:
          <code class="bg-gray-100 px-1 rounded">&lt;b&gt;</code>,
          <code class="bg-gray-100 px-1 rounded">&lt;i&gt;</code>,
          <code class="bg-gray-100 px-1 rounded">&lt;u&gt;</code>,
          <code class="bg-gray-100 px-1 rounded">&lt;a href="..."&gt;</code>,
          <code class="bg-gray-100 px-1 rounded">&lt;code&gt;</code>
        </p>
      </div>

      <!-- Send button -->
      <button
        :disabled="!message.trim() || sending"
        class="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200"
        :class="
          !message.trim() || sending
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98]'
        "
        @click="send"
      >
        <span v-if="sending" class="flex items-center justify-center gap-2">
          <span
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          Jo'natilmoqda...
        </span>
        <span v-else>Jo'natish</span>
      </button>
    </div>

    <!-- Result -->
    <div
      v-else
      class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
    >
      <h2 class="text-lg font-bold text-brand-dark text-center">Natija</h2>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-50 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-brand-dark">{{ result.total }}</p>
          <p class="text-xs text-gray-500 mt-1">Jami</p>
        </div>
        <div class="bg-green-50 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ result.sent }}</p>
          <p class="text-xs text-gray-500 mt-1">Yuborildi</p>
        </div>
        <div class="bg-red-50 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-red-500">{{ result.failed }}</p>
          <p class="text-xs text-gray-500 mt-1">Xato</p>
        </div>
        <div class="bg-orange-50 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-orange-500">
            {{ result.blocked }}
          </p>
          <p class="text-xs text-gray-500 mt-1">Bloklangan</p>
        </div>
      </div>

      <button
        class="w-full py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primary/90 active:scale-[0.98] transition-all duration-200"
        @click="reset"
      >
        Yangi xabar
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "default" });

const config = useRuntimeConfig();
const telegramUser = useTelegramUser();

const message = ref("");
const photoFile = ref(null);
const photoPreview = ref(null);
const sending = ref(false);
const result = ref(null);

const onPhotoSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  photoFile.value = file;
  photoPreview.value = URL.createObjectURL(file);
};

const removePhoto = () => {
  photoFile.value = null;
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value);
    photoPreview.value = null;
  }
};

const send = async () => {
  if (!message.value.trim() || sending.value) return;
  sending.value = true;

  try {
    const formData = new FormData();
    formData.append("message", message.value);
    if (photoFile.value) {
      formData.append("photo", photoFile.value);
    }

    const data = await $fetch(
      `${config.public.apiBase}/api/admin/broadcast`,
      {
        method: "POST",
        body: formData,
        headers: {
          "x-telegram-id": String(telegramUser.value?.id),
        },
      },
    );

    result.value = data;
  } catch (error) {
    console.error("Broadcast error:", error);
    alert("Xatolik yuz berdi: " + (error.data?.error || error.message));
  } finally {
    sending.value = false;
  }
};

const reset = () => {
  message.value = "";
  removePhoto();
  result.value = null;
};
</script>
