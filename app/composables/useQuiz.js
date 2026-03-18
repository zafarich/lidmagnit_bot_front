import quizData from '../data/quiz.json';

export const useQuiz = () => {
  const currentSectionIndex = useState('currentSectionIndex', () => 0);
  const currentQuestionIndex = useState('currentQuestionIndex', () => 0);
  const answers = useState('answers', () => ({}));
  const isCompleted = useState('isCompleted', () => false);
  const savedGrade = useState('savedGrade', () => null);

  const quiz = quizData;
  
  // Flatten all questions for easier navigation
  const allQuestions = computed(() => {
    const questions = [];
    quiz.sections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        questions.push({
          ...question,
          sectionIndex,
          questionIndex,
          sectionName: section.section_name,
          contextTitle: section.context_title,
          contextText: section.context_text,
        });
      });
    });
    return questions;
  });

  const totalQuestions = computed(() => allQuestions.value.length);
  
  const currentQuestion = computed(() => {
    const index = currentQuestionIndex.value;
    return allQuestions.value[index] || null;
  });

  const progress = computed(() => {
    return ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100;
  });

  const currentQuestionNumber = computed(() => currentQuestionIndex.value + 1);

  const selectAnswer = (questionId, optionIndex) => {
    answers.value[questionId] = optionIndex;
  };

  const goToNext = () => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++;
      return true;
    }
    return false;
  };

  const goToPrevious = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
      return true;
    }
    return false;
  };

  const calculateResults = () => {
    let correct = 0;
    let total = 0;
    const answerDetails = [];

    allQuestions.value.forEach((question) => {
      total++;
      const userAnswer = answers.value[question.id];
      const isCorrect = userAnswer !== undefined && userAnswer === question.correct_answer_index;
      if (isCorrect) correct++;

      answerDetails.push({
        questionId: question.id,
        selected: userAnswer !== undefined ? userAnswer : -1,
        correct: question.correct_answer_index,
        isCorrect,
      });
    });

    const percentage = Math.round((correct / total) * 100);

    return { correct, total, percentage, answers: answerDetails };
  };

  const completeQuiz = () => {
    isCompleted.value = true;
    const results = calculateResults();
    
    // Save to localStorage for persistence
    if (process.client) {
      localStorage.setItem('quizResults', JSON.stringify(results));
    }
    
    // Log to console as requested
    console.log('=== TEST NATIJALARI ===');
    console.log(`Jami savollar: ${results.total}`);
    console.log(`To'g'ri javoblar: ${results.correct}`);
    console.log(`Foiz: ${results.percentage}%`);
    console.log('=======================');
    
    return results;
  };

  const resetQuiz = () => {
    currentSectionIndex.value = 0;
    currentQuestionIndex.value = 0;
    answers.value = {};
    isCompleted.value = false;
  };

  const loadSavedResults = () => {
    if (process.client) {
      const saved = localStorage.getItem('quizResults');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return null;
  };

  const hasAnswer = (questionId) => {
    return answers.value[questionId] !== undefined;
  };

  const getAnswer = (questionId) => {
    return answers.value[questionId];
  };

  // Get current section info
  const currentSection = computed(() => {
    if (!currentQuestion.value) return null;
    return quiz.sections[currentQuestion.value.sectionIndex];
  });

  // Check if context changed (for showing context)
  const isNewSection = computed(() => {
    if (currentQuestionIndex.value === 0) return true;
    const prevQuestion = allQuestions.value[currentQuestionIndex.value - 1];
    return prevQuestion.sectionIndex !== currentQuestion.value?.sectionIndex;
  });

  return {
    quiz,
    currentQuestion,
    currentQuestionIndex,
    currentQuestionNumber,
    totalQuestions,
    progress,
    answers,
    isCompleted,
    savedGrade,
    currentSection,
    isNewSection,
    selectAnswer,
    goToNext,
    goToPrevious,
    calculateResults,
    completeQuiz,
    resetQuiz,
    loadSavedResults,
    hasAnswer,
    getAnswer,
  };
};

export default useQuiz;
