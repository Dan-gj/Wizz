// ===== FUG CGPA Calculator - Fixed JavaScript =====

// Global functions for onclick handlers
function showPage(pageId) {
  // Hide all pages
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(function(page) {
    page.classList.remove('active-page');
  });
  
  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active-page');
  }
  
  // Update nav links
  const allLinks = document.querySelectorAll('.nav-link');
  allLinks.forEach(function(link) {
    link.classList.remove('active');
    if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(pageId)) {
      link.classList.add('active');
    }
  });
  
  // Close mobile menu
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.remove('show');
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('show');
  }
}

function addCourse() {
  const courseListContainer = document.getElementById('courseListContainer');
  if (!courseListContainer) return;
  
  // Create unique ID
  const rowId = 'course-' + Date.now();
  
  // Create row div
  const rowDiv = document.createElement('div');
  rowDiv.className = 'course-row';
  rowDiv.id = rowId;
  
  // Set inner HTML
  rowDiv.innerHTML = `
    <input type="text" class="course-title" placeholder="Course Title">
    <input type="number" class="course-units" placeholder="Units" min="0" max="10" value="3">
    <select class="course-grade">
      <option value="A" selected>A (Excellent)</option>
      <option value="B">B (Very Good)</option>
      <option value="C">C (Good)</option>
      <option value="D">D (Fair)</option>
      <option value="E">E (Pass)</option>
      <option value="F">F (Fail)</option>
    </select>
    <button class="remove-course-btn" onclick="removeCourse('${rowId}')">×</button>
  `;
  
  // Add to container
  courseListContainer.appendChild(rowDiv);
  
  // Add event listeners for real-time calculation
  const inputs = rowDiv.querySelectorAll('input, select');
  inputs.forEach(function(input) {
    input.addEventListener('input', calculateGPA);
    input.addEventListener('change', calculateGPA);
  });
  
  // Update count and calculate
  updateCourseCount();
  calculateGPA();
}

function removeCourse(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
    updateCourseCount();
    calculateGPA();
  }
}

function resetCourses() {
  if (confirm('Are you sure you want to reset all courses?')) {
    loadSampleCourses();
    calculateGPA();
  }
}

function scrollToCalculator() {
  const calculatorSection = document.getElementById('calculatorSection');
  if (calculatorSection) {
    calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function sendMessage() {
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMessage').value;
  
  if (!name || !email || !message) {
    alert('Please fill in all fields');
    return;
  }
  
  alert('Thank you ' + name + '! Your message has been sent.');
  
  document.getElementById('contactName').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactMessage').value = '';
}

// ===== CGPA CALCULATOR LOGIC =====

// Grade points
const gradePoints5 = { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0.0 };
const gradePoints4 = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'E': 0.0, 'F': 0.0 };

// Department names
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
  'engineering': 'Engineering',
  'agric-econ': 'Agricultural Economics'
};

// Sample courses
const sampleCourses = {
  'computer-science': {
    '100': [
      { title: 'Intro to Computer Science', units: 3 },
      { title: 'Programming Fundamentals', units: 3 },
      { title: 'Mathematics I', units: 3 },
      { title: 'English Communication', units: 2 }
    ],
    '200': [
      { title: 'Data Structures', units: 3 },
      { title: 'OOP', units: 3 },
      { title: 'Discrete Math', units: 3 }
    ],
    '300': [
      { title: 'Database Systems', units: 3 },
      { title: 'Operating Systems', units: 3 }
    ],
    '400': [
      { title: 'AI', units: 3 },
      { title: 'Final Year Project', units: 4 }
    ]
  },
  'default': {
    '100': [
      { title: 'Introduction Course', units: 3 },
      { title: 'General Studies', units: 2 },
      { title: 'English', units: 2 }
    ],
    '200': [
      { title: 'Core Course I', units: 3 },
      { title: 'Core Course II', units: 3 }
    ],
    '300': [
      { title: 'Advanced Course', units: 3 },
      { title: 'Seminar', units: 2 }
    ],
    '400': [
      { title: 'Project', units: 4 },
      { title: 'Special Topics', units: 3 }
    ]
  }
};

// Update labels
function updateLabels() {
  const levelSelect = document.getElementById('levelSelect');
  const deptSelect = document.getElementById('deptSelect');
  const dynamicLevelLabel = document.getElementById('dynamicLevelLabel');
  const dynamicDeptLabel = document.getElementById('dynamicDeptLabel');
  
  if (levelSelect && deptSelect && dynamicLevelLabel && dynamicDeptLabel) {
    dynamicLevelLabel.textContent = levelSelect.value + ' Level';
    dynamicDeptLabel.textContent = deptNames[deptSelect.value] || deptSelect.value;
  }
}

// Load sample courses
function loadSampleCourses() {
  const deptSelect = document.getElementById('deptSelect');
  const levelSelect = document.getElementById('levelSelect');
  const courseListContainer = document.getElementById('courseListContainer');
  
  if (!deptSelect || !levelSelect || !courseListContainer) return;
  
  courseListContainer.innerHTML = '';
  
  const dept = deptSelect.value;
  const level = levelSelect.value;
  
  const deptCourses = sampleCourses[dept] || sampleCourses['default'];
  const courses = deptCourses[level] || deptCourses['100'] || [];
  
  courses.forEach(function(course) {
    // Create row
    const rowId = 'course-' + Date.now() + '-' + Math.random();
    const rowDiv = document.createElement('div');
    rowDiv.className = 'course-row';
    rowDiv.id = rowId;
    
    rowDiv.innerHTML = `
      <input type="text" class="course-title" placeholder="Course Title" value="${course.title}">
      <input type="number" class="course-units" placeholder="Units" min="0" max="10" value="${course.units}">
      <select class="course-grade">
        <option value="A" selected>A (Excellent)</option>
        <option value="B">B (Very Good)</option>
        <option value="C">C (Good)</option>
        <option value="D">D (Fair)</option>
        <option value="E">E (Pass)</option>
        <option value="F">F (Fail)</option>
      </select>
      <button class="remove-course-btn" onclick="removeCourse('${rowId}')">×</button>
    `;
    
    courseListContainer.appendChild(rowDiv);
    
    // Add event listeners
    const inputs = rowDiv.querySelectorAll('input, select');
    inputs.forEach(function(input) {
      input.addEventListener('input', calculateGPA);
      input.addEventListener('change', calculateGPA);
    });
  });
  
  updateCourseCount();
  calculateGPA();
}

// Update course count
function updateCourseCount() {
  const courseRows = document.querySelectorAll('.course-row');
  const courseCountSpan = document.getElementById('courseCount');
  if (courseCountSpan) {
    courseCountSpan.textContent = courseRows.length + ' courses added';
  }
}

// Calculate GPA
function calculateGPA() {
  const courseRows = document.querySelectorAll('.course-row');
  const gradingModeSelect = document.getElementById('gradingMode');
  const gpaValueSpan = document.getElementById('gpaValue');
  const gpaScaleSpan = document.getElementById('gpaScale');
  const cgpaValueSpan = document.getElementById('cgpaValue');
  const totalUnitsSpan = document.getElementById('totalUnits');
  const weightedPointsSpan = document.getElementById('weightedPoints');
  const creditPassedSpan = document.getElementById('creditPassed');
  
  if (!gradingModeSelect || !gpaValueSpan) return;
  
  const gradingMode = gradingModeSelect.value;
  const gradePoints = gradingMode === '5point' ? gradePoints5 : gradePoints4;
  
  let totalUnits = 0;
  let weightedPoints = 0;
  let creditPassed = 0;
  
  courseRows.forEach(function(row) {
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
    }
  });
  
  const gpa = totalUnits > 0 ? (weightedPoints / totalUnits) : 0;
  
  if (gpaValueSpan) gpaValueSpan.textContent = gpa.toFixed(2);
  if (gpaScaleSpan) gpaScaleSpan.textContent = '/ ' + (gradingMode === '5point' ? '5.0' : '4.0');
  if (cgpaValueSpan) cgpaValueSpan.textContent = gpa.toFixed(2);
  if (totalUnitsSpan) totalUnitsSpan.textContent = totalUnits;
  if (weightedPointsSpan) weightedPointsSpan.textContent = weightedPoints.toFixed(1);
  if (creditPassedSpan) creditPassedSpan.textContent = creditPassed;
}

// Create particles
function createParticles() {
  const container = document.getElementById('particleContainer');
  if (!container) return;
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 3 + 's';
    particle.style.animationDuration = (2 + Math.random() * 3) + 's';
    
    const colors = ['#b892ff', '#ec4899', '#06b6d4', '#7c3aed'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.boxShadow = '0 0 10px ' + color + ', 0 0 20px ' + color;
    
    container.appendChild(particle);
  }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Create particles
  createParticles();
  
  // Show home page
  showPage('home');
  
  // Initialize calculator
  updateLabels();
  loadSampleCourses();
  
  // Add event listeners to selects
  const levelSelect = document.getElementById('levelSelect');
  const deptSelect = document.getElementById('deptSelect');
  const gradingModeSelect = document.getElementById('gradingMode');
  
  if (levelSelect) {
    levelSelect.addEventListener('change', function() {
      updateLabels();
      loadSampleCourses();
    });
  }
  
  if (deptSelect) {
    deptSelect.addEventListener('change', function() {
      updateLabels();
      loadSampleCourses();
    });
  }
  
  if (gradingModeSelect) {
    gradingModeSelect.addEventListener('change', function() {
      calculateGPA();
    });
  }
});
