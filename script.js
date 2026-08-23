// ===== FUG CGPA Calculator - JavaScript Logic =====

// Grade points mapping for 5.0 scale
const gradePoints5 = {
  'A': 5.0,
  'B': 4.0,
  'C': 3.0,
  'D': 2.0,
  'E': 1.0,
  'F': 0.0
};

// Grade points mapping for 4.0 scale
const gradePoints4 = {
  'A': 4.0,
  'B': 3.0,
  'C': 2.0,
  'D': 1.0,
  'E': 0.0,
  'F': 0.0
};

// Department full names mapping
const deptNames = {
  'computer-science': 'Computer Science',
  'medicine': 'Medicine & Surgery',
  'law': 'Law',
  'economics': 'Economics',
  'mass-comm': 'Mass Communication',
  'biology': 'Biology',
  'chemistry': 'Chemistry',
  'physics': 'Physics',
  'mathematics': 'Mathematics',
  'accounting': 'Accounting',
  'business-admin': 'Business Administration',
  'sociology': 'Sociology',
  'political-science': 'Political Science',
  'engineering': 'Engineering (Mechanical)',
  'agric-econ': 'Agricultural Economics'
};

// Sample course data by department and level
const sampleCourses = {
  'computer-science': {
    '100': [
      { title: 'Introduction to Computer Science', units: 3 },
      { title: 'Programming Fundamentals', units: 3 },
      { title: 'Mathematics I', units: 3 },
      { title: 'Physics for Computing', units: 2 },
      { title: 'English Communication', units: 2 }
    ],
    '200': [
      { title: 'Data Structures', units: 3 },
      { title: 'Object-Oriented Programming', units: 3 },
      { title: 'Discrete Mathematics', units: 3 },
      { title: 'Digital Logic', units: 3 },
      { title: 'Statistics', units: 2 }
    ],
    '300': [
      { title: 'Database Systems', units: 3 },
      { title: 'Operating Systems', units: 3 },
      { title: 'Computer Networks', units: 3 },
      { title: 'Software Engineering', units: 3 },
      { title: 'Web Development', units: 2 }
    ],
    '400': [
      { title: 'Artificial Intelligence', units: 3 },
      { title: 'Machine Learning', units: 3 },
      { title: 'Final Year Project', units: 4 },
      { title: 'Information Security', units: 3 },
      { title: 'Cloud Computing', units: 2 }
    ]
  },
  'medicine': {
    '100': [
      { title: 'Anatomy I', units: 4 },
      { title: 'Physiology I', units: 4 },
      { title: 'Biochemistry', units: 3 },
      { title: 'Medical Ethics', units: 2 }
    ],
    '200': [
      { title: 'Anatomy II', units: 4 },
      { title: 'Physiology II', units: 4 },
      { title: 'Pathology', units: 3 },
      { title: 'Pharmacology', units: 3 }
    ],
    '300': [
      { title: 'Clinical Medicine I', units: 5 },
      { title: 'Surgery I', units: 4 },
      { title: 'Pediatrics', units: 3 },
      { title: 'Obstetrics', units: 3 }
    ],
    '400': [
      { title: 'Clinical Medicine II', units: 5 },
      { title: 'Surgery II', units: 4 },
      { title: 'Community Medicine', units: 3 },
      { title: 'Radiology', units: 2 }
    ],
    '500': [
      { title: 'Senior Clerkship', units: 6 },
      { title: 'Elective Rotation', units: 4 },
      { title: 'Research Project', units: 4 }
    ]
  },
  'law': {
    '100': [
      { title: 'Legal Methods', units: 3 },
      { title: 'Constitutional Law', units: 4 },
      { title: 'Contract Law', units: 4 },
      { title: 'English for Lawyers', units: 2 }
    ],
    '200': [
      { title: 'Criminal Law', units: 4 },
      { title: 'Tort Law', units: 4 },
      { title: 'Property Law', units: 4 },
      { title: 'Legal Research', units: 2 }
    ],
    '300': [
      { title: 'Company Law', units: 4 },
      { title: 'Evidence', units: 4 },
      { title: 'Jurisprudence', units: 3 },
      { title: 'Administrative Law', units: 3 }
    ],
    '400': [
      { title: 'International Law', units: 4 },
      { title: 'Human Rights', units: 3 },
      { title: 'Law of Banking', units: 3 },
      { title: 'Legal Practice', units: 3 }
    ],
    '500': [
      { title: 'Law Clinic', units: 6 },
      { title: 'Professional Ethics', units: 3 },
      { title: 'Dissertation', units: 4 }
    ]
  },
  // Default courses for other departments
  'default': {
    '100': [
      { title: 'Introduction to Discipline', units: 3 },
      { title: 'General Mathematics', units: 3 },
      { title: 'English Communication', units: 2 },
      { title: 'General Studies', units: 2 }
    ],
    '200': [
      { title: 'Core Course I', units: 3 },
      { title: 'Core Course II', units: 3 },
      { title: 'Elective I', units: 2 },
      { title: 'Research Methods', units: 2 }
    ],
    '300': [
      { title: 'Advanced Core Course', units: 3 },
      { title: 'Specialized Course', units: 3 },
      { title: 'Seminar', units: 2 },
      { title: 'Practical', units: 2 }
    ],
    '400': [
      { title: 'Final Year Project', units: 4 },
      { title: 'Advanced Seminar', units: 3 },
      { title: 'Special Topics', units: 3 },
      { title: 'Industrial Training', units: 3 }
    ]
  }
};

// DOM Elements
const levelSelect = document.getElementById('levelSelect');
const deptSelect = document.getElementById('deptSelect');
const semesterSelect = document.getElementById('semesterSelect');
const gradingModeSelect = document.getElementById('gradingMode');
const courseListContainer = document.getElementById('courseListContainer');
const addCourseBtn = document.getElementById('addCourseBtn');
const resetCoursesBtn = document.getElementById('resetCoursesBtn');
const courseCountSpan = document.getElementById('courseCount');
const dynamicLevelLabel = document.getElementById('dynamicLevelLabel');
const dynamicDeptLabel = document.getElementById('dynamicDeptLabel');
const gpaValueSpan = document.getElementById('gpaValue');
const gpaScaleSpan = document.getElementById('gpaScale');
const cgpaValueSpan = document.getElementById('cgpaValue');
const totalUnitsSpan = document.getElementById('totalUnits');
const weightedPointsSpan = document.getElementById('weightedPoints');
const creditPassedSpan = document.getElementById('creditPassed');

// State
let courseCounter = 0;

// Initialize the calculator
function initCalculator() {
  updateLabels();
  loadSampleCourses();
  addCourseRow(); // Add one empty course row by default
  addCourseRow(); // Add second empty course row
  addCourseRow(); // Add third empty course row
  updateCourseCount();
  calculateGPA();
}

// Update dynamic labels
function updateLabels() {
  const level = levelSelect.value;
  const dept = deptSelect.value;
  dynamicLevelLabel.textContent = `${level} Level`;
  dynamicDeptLabel.textContent = deptNames[dept] || dept;
}

// Load sample courses based on department and level
function loadSampleCourses() {
  const dept = deptSelect.value;
  const level = levelSelect.value;
  
  // Clear existing courses
  courseListContainer.innerHTML = '';
  courseCounter = 0;
  
  // Get sample courses
  const deptCourses = sampleCourses[dept] || sampleCourses['default'];
  const courses = deptCourses[level] || deptCourses['100'] || [];
  
  // Add sample courses with default grades
  courses.forEach(course => {
    addCourseRow(course.title, course.units, 'A');
  });
}

// Add a new course row
function addCourseRow(title = '', units = '3', grade = 'A') {
  courseCounter++;
  const rowId = `course-${courseCounter}`;
  
  const rowDiv = document.createElement('div');
  rowDiv.className = 'course-row';
  rowDiv.id = rowId;
  
  rowDiv.innerHTML = `
    <input type="text" class="course-title" placeholder="Course Title (e.g., MTH 101)" value="${title}">
    <input type="number" class="course-units" placeholder="Units" min="0" max="10" value="${units}">
    <select class="course-grade">
      <option value="A" ${grade === 'A' ? 'selected' : ''}>A (Excellent)</option>
      <option value="B" ${grade === 'B' ? 'selected' : ''}>B (Very Good)</option>
      <option value="C" ${grade === 'C' ? 'selected' : ''}>C (Good)</option>
      <option value="D" ${grade === 'D' ? 'selected' : ''}>D (Fair)</option>
      <option value="E" ${grade === 'E' ? 'selected' : ''}>E (Pass)</option>
      <option value="F" ${grade === 'F' ? 'selected' : ''}>F (Fail)</option>
    </select>
    <button class="remove-course-btn" onclick="removeCourse('${rowId}')" title="Remove course">×</button>
  `;
  
  courseListContainer.appendChild(rowDiv);
  
  // Add event listeners for real-time calculation
  const inputs = rowDiv.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('input', calculateGPA);
    input.addEventListener('change', calculateGPA);
  });
  
  updateCourseCount();
  calculateGPA();
}

// Remove a course row
function removeCourse(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
    updateCourseCount();
    calculateGPA();
  }
}

// Reset all courses
function resetCourses() {
  if (confirm('Are you sure you want to reset all courses?')) {
    loadSampleCourses();
    calculateGPA();
  }
}

// Update course count
function updateCourseCount() {
  const courseRows = document.querySelectorAll('.course-row');
  courseCountSpan.textContent = `${courseRows.length} courses added`;
}

// Calculate GPA
function calculateGPA() {
  const courseRows = document.querySelectorAll('.course-row');
  const gradingMode = gradingModeSelect.value;
  const gradePoints = gradingMode === '5point' ? gradePoints5 : gradePoints4;
  
  let totalUnits = 0;
  let weightedPoints = 0;
  let creditPassed = 0;
  let totalGradePoints = 0;
  let validCourses = 0;
  
  courseRows.forEach(row => {
    const unitsInput = row.querySelector('.course-units');
    const gradeSelect = row.querySelector('.course-grade');
    
    const units = parseFloat(unitsInput.value) || 0;
    const grade = gradeSelect.value;
    const gradePoint = gradePoints[grade] || 0;
    
    if (units > 0) {
      totalUnits += units;
      weightedPoints += units * gradePoint;
      
      if (grade !== 'F') {
        creditPassed += units;
      }
      
      if (gradePoint > 0) {
        totalGradePoints += gradePoint;
        validCourses++;
      }
    }
  });
  
  // Calculate GPA
  const gpa = totalUnits > 0 ? (weightedPoints / totalUnits) : 0;
  
  // Calculate projected CGPA (simplified: assume current GPA is CGPA for now)
  const cgpa = gpa;
  
  // Update UI
  gpaValueSpan.textContent = gpa.toFixed(2);
  gpaScaleSpan.textContent = `/ ${gradingMode === '5point' ? '5.0' : '4.0'}`;
  cgpaValueSpan.textContent = cgpa.toFixed(2);
  totalUnitsSpan.textContent = totalUnits;
  weightedPointsSpan.textContent = weightedPoints.toFixed(1);
  creditPassedSpan.textContent = creditPassed;
}

// Event Listeners
levelSelect.addEventListener('change', () => {
  updateLabels();
  loadSampleCourses();
  calculateGPA();
});

deptSelect.addEventListener('change', () => {
  updateLabels();
  loadSampleCourses();
  calculateGPA();
});

semesterSelect.addEventListener('change', () => {
  // Semester change doesn't affect sample courses, but could in future
  calculateGPA();
});

gradingModeSelect.addEventListener('change', () => {
  calculateGPA();
});

addCourseBtn.addEventListener('click', () => {
  addCourseRow();
});

resetCoursesBtn.addEventListener('click', resetCourses);

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCalculator);
