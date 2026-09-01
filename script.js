// ===== FUG CGPA Calculator - Complete Fixed JavaScript =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== NAVIGATION SYSTEM ====================
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const navBrand = document.querySelector('.nav-brand');

  // Navigation function
  function navigateTo(pageId) {
    // Hide all pages
    pages.forEach(page => {
      page.classList.remove('active-page');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active-page');
    }
    
    // Update nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
      }
    });
    
    // Close mobile menu
    navLinksContainer.classList.remove('show');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Add click event to nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      navigateTo(pageId);
    });
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', function() {
    navLinksContainer.classList.toggle('show');
  });

  // Brand click - go to home
  navBrand.addEventListener('click', function() {
    navigateTo('home');
  });

  // ==================== CREATE PARTICLES ====================
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
      particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
      
      container.appendChild(particle);
    }
  }

  // ==================== CGPA CALCULATOR ====================
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

  let courseCounter = 0;

  // Update labels
  function updateLabels() {
    const level = levelSelect.value;
    const dept = deptSelect.value;
    dynamicLevelLabel.textContent = level + ' Level';
    dynamicDeptLabel.textContent = deptNames[dept] || dept;
  }

  // Load sample courses
  function loadSampleCourses() {
    const dept = deptSelect.value;
    const level = levelSelect.value;
    
    courseListContainer.innerHTML = '';
    courseCounter = 0;
    
    const deptCourses = sampleCourses[dept] || sampleCourses['default'];
    const courses = deptCourses[level] || deptCourses['100'] || [];
    
    courses.forEach(function(course) {
      addCourseRow(course.title, course.units, 'A');
    });
  }

  // Add course row
  function addCourseRow(title, units, grade) {
    title = title || '';
    units = units || '3';
    grade = grade || 'A';
    
    courseCounter++;
    const rowId = 'course-' + courseCounter;
    
    const rowDiv = document.createElement('div');
    rowDiv.className = 'course-row';
    rowDiv.id = rowId;
    
    rowDiv.innerHTML = `
      <input type="text" class="course-title" placeholder="Course Title" value="${title}">
      <input type="number" class="course-units" placeholder="Units" min="0" max="10" value="${units}">
      <select class="course-grade">
        <option value="A" ${grade === 'A' ? 'selected' : ''}>A</option>
        <option value="B" ${grade === 'B' ? 'selected' : ''}>B</option>
        <option value="C" ${grade === 'C' ? 'selected' : ''}>C</option>
        <option value="D" ${grade === 'D' ? 'selected' : ''}>D</option>
        <option value="E" ${grade === 'E' ? 'selected' : ''}>E</option>
        <option value="F" ${grade === 'F' ? 'selected' : ''}>F</option>
      </select>
      <button class="remove-course-btn" data-row-id="${rowId}">×</button>
    `;
    
    courseListContainer.appendChild(rowDiv);
    
    // Add event listeners
    const inputs = rowDiv.querySelectorAll('input, select');
    inputs.forEach(function(input) {
      input.addEventListener('input', calculateGPA);
      input.addEventListener('change', calculateGPA);
    });
    
    const removeBtn = rowDiv.querySelector('.remove-course-btn');
    removeBtn.addEventListener('click', function() {
      removeCourse(rowId);
    });
    
    updateCourseCount();
    calculateGPA();
  }

  // Remove course
  function removeCourse(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
      row.remove();
      updateCourseCount();
      calculateGPA();
    }
  }

  // Update course count
  function updateCourseCount() {
    const courseRows = document.querySelectorAll('.course-row');
    courseCountSpan.textContent = courseRows.length + ' courses added';
  }

  // Calculate GPA
  function calculateGPA() {
    const courseRows = document.querySelectorAll('.course-row');
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
    
    gpaValueSpan.textContent = gpa.toFixed(2);
    gpaScaleSpan.textContent = '/ ' + (gradingMode === '5point' ? '5.0' : '4.0');
    cgpaValueSpan.textContent = gpa.toFixed(2);
    totalUnitsSpan.textContent = totalUnits;
    weightedPointsSpan.textContent = weightedPoints.toFixed(1);
    creditPassedSpan.textContent = creditPassed;
  }

  // Event Listeners for Calculator
  levelSelect.addEventListener('change', function() {
    updateLabels();
    loadSampleCourses();
    calculateGPA();
  });

  deptSelect.addEventListener('change', function() {
    updateLabels();
    loadSampleCourses();
    calculateGPA();
  });

  semesterSelect.addEventListener('change', function() {
    calculateGPA();
  });

  gradingModeSelect.addEventListener('change', function() {
    calculateGPA();
  });

  addCourseBtn.addEventListener('click', function() {
    addCourseRow();
  });

  resetCoursesBtn.addEventListener('click', function() {
    if (confirm('Reset all courses?')) {
      loadSampleCourses();
      calculateGPA();
    }
  });

  // Start Calculator button
  const startBtn = document.getElementById('startCalculatorBtn');
  if (startBtn) {
    startBtn.addEventListener('click', function() {
      document.querySelector('.calculator-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Contact form
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', function() {
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
    });
  }

  // ==================== INITIALIZATION ====================
  createParticles();
  navigateTo('home');
  updateLabels();
  loadSampleCourses();
  calculateGPA();

}); // End DOMContentLoaded
