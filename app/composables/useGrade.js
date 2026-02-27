export const useGrade = () => {
  // Calculate grade info based on percentage
  const calculateGrade = (percentage) => {
    let grade, label, color;
    
    if (percentage >= 93) {
      grade = 'A+';
      label = 'A\'lo';
      color = '#10B981';
    } else if (percentage >= 80) {
      grade = 'A';
      label = 'A\'lo';
      color = '#22C55E';
    } else if (percentage >= 67) {
      grade = 'B+';
      label = 'Yaxshi';
      color = '#6366F1';
    } else if (percentage >= 53) {
      grade = 'B';
      label = 'Yaxshi';
      color = '#3B82F6';
    } else if (percentage >= 40) {
      grade = 'C+';
      label = 'Qoniqarli';
      color = '#F59E0B';
    } else {
      grade = 'C';
      label = 'Qoniqarli';
      color = '#F97316';
    }
    
    return { grade, label, color };
  };

  // Get grade info by grade letter
  const getGradeInfo = (grade) => {
    const gradeMap = {
      'A+': { label: 'A\'lo', color: '#10B981', minPercent: 93 },
      'A': { label: 'A\'lo', color: '#22C55E', minPercent: 80 },
      'B+': { label: 'Yaxshi', color: '#6366F1', minPercent: 67 },
      'B': { label: 'Yaxshi', color: '#3B82F6', minPercent: 53 },
      'C+': { label: 'Qoniqarli', color: '#F59E0B', minPercent: 40 },
      'C': { label: 'Qoniqarli', color: '#F97316', minPercent: 0 },
    };
    
    return gradeMap[grade] || gradeMap['C'];
  };

  // Get days until goal date (April 25)
  const getGoalInfo = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let goalDate = new Date(currentYear, 3, 25); // April 25 (month is 0-indexed)
    
    // If April 25 has passed this year, use next year
    if (today > goalDate) {
      goalDate = new Date(currentYear + 1, 3, 25);
    }
    
    const diffTime = goalDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      daysRemaining: diffDays,
      date: goalDate,
      formatted: goalDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' }),
      shortDate: '25-aprel',
    };
  };

  return {
    calculateGrade,
    getGradeInfo,
    getGoalInfo,
  };
};

export default useGrade;
