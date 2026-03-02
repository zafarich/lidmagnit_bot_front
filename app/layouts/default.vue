<template>
  <div class="min-h-screen bg-brand-bg">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div
          class="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-brand-dark/60">Yuklanmoqda...</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="pb-24">
      <slot />
    </div>

    <!-- Bottom Navbar -->
    <BottomNavbar v-if="!loading && !publicRoutes.includes(route.path)" />
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const telegramUser = useTelegramUser();

const loading = ref(true);
const userData = useState("userData", () => null);
const isAdmin = ref(false);

// Routes that don't require auth checks
const publicRoutes = [
  "/phone-input",
  "/onboarding/name",
  "/onboarding/schedule",
  "/onboarding/test-info",
  "/onboarding/test",
];

// Helper to check if onboarding is completed
const isOnboardingCompleted = (data) => {
  if (!data?.onboarding) return false;
  return (
    data.onboarding.isCompleted === true ||
    data.onboarding.currentStep === "completed"
  );
};

// Helper to get current onboarding step
const getCurrentStep = (data) => {
  return data?.onboarding?.currentStep || "phone";
};

// Helper to check if data from server indicates completed onboarding
const checkServerDataCompleted = (data) => {
  if (!data?.onboarding) return false;
  return (
    data.onboarding.isCompleted === true ||
    data.onboarding.currentStep === "completed"
  );
};

// Fetch user data from backend
const fetchUserData = async () => {
  // Skip if no telegram user (not in Telegram Web App)
  if (!telegramUser.value?.id) {
    console.log("[Layout] No telegram user, skipping user fetch");
    loading.value = false;
    return;
  }

  // Skip for public routes
  if (publicRoutes.includes(route.path)) {
    console.log("[Layout] Public route, skipping user check");
    loading.value = false;
    return;
  }

  try {
    console.log("[Layout] Fetching user data for:", telegramUser.value.id);

    const data = await $fetch(
      `${config.public.apiBase}/api/users/me/${telegramUser.value.id}`,
    );

    console.log("[Layout] User data from server:", data);
    console.log("[Layout] Server onboarding:", data?.onboarding);

    // Update userData state
    userData.value = data;

    // Check if user is admin
    try {
      const adminData = await $fetch(
        `${config.public.apiBase}/api/admin/check/${telegramUser.value.id}`,
      );
      isAdmin.value = adminData.isAdmin === true;
    } catch (e) {
      isAdmin.value = false;
    }

    // Perform redirect checks based on user data
    handleRedirects(data);
  } catch (error) {
    console.error("[Layout] Error fetching user:", error);

    // If user not found, redirect to phone-input
    if (error.statusCode === 404) {
      console.log("[Layout] User not found, redirecting to phone-input");
      if (route.path !== "/phone-input") {
        router.push("/phone-input");
      }
    }
  } finally {
    loading.value = false;
  }
};

// Handle redirects based on user state
const handleRedirects = (data) => {
  console.log("[Layout] handleRedirects called with data:", data);

  // Check if user needs onboarding
  if (!data.phoneNumber && route.path !== "/phone-input") {
    console.log("[Layout] No phone number, redirecting to phone-input");
    router.push("/phone-input");
    return;
  }

  // If onboarding is completed, stay on current page
  if (isOnboardingCompleted(data)) {
    console.log("[Layout] Onboarding completed, staying on", route.path);
    return;
  }

  // Check onboarding step and redirect if needed
  const step = getCurrentStep(data);
  console.log("[Layout] Current step:", step);

  // If on test step, allow staying on test pages
  if (step === "test") {
    console.log("[Layout] On test step, no redirect");
    return;
  }

  // Map steps to routes
  const onboardingRoutes = {
    phone: "/phone-input",
    name: "/onboarding/name",
    schedule: "/onboarding/schedule",
    "test-info": "/onboarding/test-info",
  };

  const targetRoute = onboardingRoutes[step];

  if (targetRoute && route.path !== targetRoute) {
    console.log("[Layout] Redirecting to:", targetRoute);
    router.push(targetRoute);
  } else if (targetRoute && route.path === targetRoute) {
    console.log("[Layout] Already on correct route:", route.path);
  }
};

// Watch for telegram user to be available
watch(
  () => telegramUser.value?.id,
  (newId) => {
    if (newId) {
      fetchUserData();
    } else {
      loading.value = false;
    }
  },
  {immediate: true},
);

// Watch for route changes
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (!telegramUser.value?.id) return;

    console.log("[Layout] Route changed from", oldPath, "to", newPath);
    console.log("[Layout] Current userData:", userData.value);

    // If coming from public route to private route, refresh data
    if (publicRoutes.includes(oldPath) && !publicRoutes.includes(newPath)) {
      console.log("[Layout] Coming from public route, refreshing data");
      fetchUserData();
    }
    // If going to home page explicitly
    else if (newPath === "/" && oldPath !== "/") {
      console.log("[Layout] Going to home, refreshing data");
      fetchUserData();
    }
  },
);

// Provide user data to child components
provide("userData", userData);
provide("refreshUserData", fetchUserData);
provide("isAdmin", isAdmin);
</script>
