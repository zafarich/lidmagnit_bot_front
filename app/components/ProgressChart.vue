<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-brand-primary/5 to-brand-success/5 p-6">
      <h2 class="text-lg font-bold text-brand-dark mb-1">
        Sizning tahminiy darajangiz
      </h2>
      <p class="text-sm text-brand-dark/50">Test natijalariga asoslangan</p>
    </div>

    <!-- Main Grade Display -->
    <div class="px-6 pt-6 pb-4">
      <div class="flex items-center justify-between mb-6">
        <!-- Grade Badge -->
        <div class="flex items-center gap-4">
          <div
            class="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg"
            :style="{
              backgroundColor: currentGrade.color,
              boxShadow: `0 10px 30px ${currentGrade.color}40`,
            }"
          >
            {{ currentGrade.grade }}
          </div>
          <div>
            <div class="text-2xl font-bold text-brand-dark">
              {{ currentGrade.label }}
            </div>
            <div class="text-sm text-brand-dark/50">
              {{ currentGrade.description }}
            </div>
          </div>
        </div>

        <!-- Percentage Circle -->
        <div class="relative w-16 h-16">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <!-- Background circle -->
            <path
              class="text-gray-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            />
            <!-- Progress circle -->
            <path
              :style="{color: currentGrade.color}"
              :stroke-dasharray="`${currentGrade.position}, 100`"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              class="transition-all duration-1000"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-sm font-bold" :style="{color: currentGrade.color}"
              >{{ currentGrade.position }}%</span
            >
          </div>
        </div>
      </div>

      <!-- Scale/Levels -->
      <div class="flex justify-between mb-3">
        <div
          v-for="level in gradeLevels"
          :key="level.grade"
          class="flex flex-col items-center"
          :class="{
            'opacity-100': level.grade === currentGrade.grade,
            'opacity-40': level.grade !== currentGrade.grade,
          }"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mb-1 transition-all"
            :class="
              level.grade === currentGrade.grade
                ? 'text-white scale-110'
                : 'bg-gray-100 text-gray-500'
            "
            :style="
              level.grade === currentGrade.grade
                ? {backgroundColor: currentGrade.color}
                : {}
            "
          >
            {{ level.grade }}
          </div>
          <span
            class="text-[10px] font-medium"
            :style="{
              color:
                level.grade === currentGrade.grade
                  ? currentGrade.color
                  : '#9CA3AF',
            }"
          >
            {{ level.shortLabel }}
          </span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="relative mt-4">
        <!-- Background -->
        <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
          <!-- Fill with gradient -->
          <div
            class="h-full rounded-full transition-all duration-1000 relative"
            :style="{
              width: `${currentGrade.position}%`,
              background: `linear-gradient(to right, #F97316, ${currentGrade.color})`,
            }"
          >
            <!-- Shine effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Markers -->
        <div class="flex justify-between mt-2 text-xs text-gray-400">
          <span>C</span>
          <span class="text-brand-success font-medium">A+</span>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-px bg-gray-100 border-t border-gray-100">
      <div class="bg-white p-4 text-center">
        <div class="text-xs text-brand-dark/50 mb-1">Keyingi daraja</div>
        <div
          v-if="nextGrade"
          class="font-bold"
          :style="{color: nextGrade.color}"
        >
          {{ nextGrade.grade }}
        </div>
        <div v-else class="font-bold text-brand-success">Eng yuqori!</div>
      </div>
      <div class="bg-white p-4 text-center">
        <div class="text-xs text-brand-dark/50 mb-1">Maqsad sanagacha</div>
        <div class="font-bold text-brand-dark">25-aprel</div>
      </div>
    </div>

    <!-- Motivation Section -->
    <div class="p-4 bg-gradient-to-r from-brand-soft/50 to-transparent">
      <p class="text-sm text-center">
        <span
          v-if="currentGrade.grade === 'A+'"
          class="text-brand-success font-medium"
        >
          🎉 Tabriklaymiz! Siz eng yuqori darajadasiz!
        </span>
        <span v-else-if="nextGrade" class="text-brand-dark/70">
          📚 {{ nextGrade.grade }} ga chiqish uchun mashq qilishda davom eting
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  grade: {
    type: String,
    default: "C",
  },
});

// Grade configuration
const gradeConfig = {
  C: {
    position: 15,
    color: "#F97316",
    label: "Qoniqarli",
    shortLabel: "Boshlang'ich",
    description: "Boshlang'ich daraja",
  },
  "C+": {
    position: 30,
    color: "#F59E0B",
    label: "Qoniqarli",
    shortLabel: "O'rtacha",
    description: "O'rtacha daraja",
  },
  B: {
    position: 45,
    color: "#3B82F6",
    label: "Yaxshi",
    shortLabel: "Yaxshi",
    description: "Yaxshi daraja",
  },
  "B+": {
    position: 60,
    color: "#6366F1",
    label: "Yaxshi",
    shortLabel: "Juda yaxshi",
    description: "Juda yaxshi daraja",
  },
  A: {
    position: 80,
    color: "#22C55E",
    label: "A'lo",
    shortLabel: "A'lo",
    description: "A'lo daraja",
  },
  "A+": {
    position: 100,
    color: "#10B981",
    label: "A'lo",
    shortLabel: "Mukammal",
    description: "Mukammal daraja",
  },
};

const gradeLevels = [
  {grade: "C", shortLabel: "Boshlang'ich"},
  {grade: "C+", shortLabel: "O'rtacha"},
  {grade: "B", shortLabel: "Yaxshi"},
  {grade: "B+", shortLabel: "Juda yaxshi"},
  {grade: "A", shortLabel: "A'lo"},
  {grade: "A+", shortLabel: "Mukammal"},
];

const currentGrade = computed(() => {
  return gradeConfig[props.grade] || gradeConfig["C"];
});

const nextGrade = computed(() => {
  const grades = ["C", "C+", "B", "B+", "A", "A+"];
  const currentIndex = grades.indexOf(props.grade);
  if (currentIndex === -1 || currentIndex >= grades.length - 1) return null;
  const nextGradeKey = grades[currentIndex + 1];
  return gradeConfig[nextGradeKey];
});
</script>
