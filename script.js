// Document data
const documents = [
  {
    id: "1",
    name: "Annual Report 2025.pdf",
    type: "PDF",
    size: "2.4 MB",
    lastModified: "May 10, 2025"
  },
  {
    id: "2",
    name: "Student Assessment Template.docx",
    type: "Word",
    size: "1.8 MB",
    lastModified: "May 8, 2025"
  },
  {
    id: "3",
    name: "Class Schedule.xlsx",
    type: "Excel",
    size: "1.2 MB",
    lastModified: "May 5, 2025"
  },
  {
    id: "4",
    name: "Science Project Guidelines.pdf",
    type: "PDF",
    size: "3.5 MB",
    lastModified: "May 2, 2025"
  },
  {
    id: "5",
    name: "Teaching Methodology.pptx",
    type: "PowerPoint",
    size: "4.7 MB",
    lastModified: "April 28, 2025"
  }
];

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the documents list
  renderDocumentsList();
  renderDocumentsGrid();

  // Add event listeners
  setupEventListeners();
  
  // Check for saved dark mode preference
  checkDarkModePreference();
  
  // Initialize charts for all pages
  initializeEnhancedCharts();
});

// Function to render documents in list view
function renderDocumentsList() {
  const listContainer = document.getElementById('documents-list');
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  documents.forEach(doc => {
    const row = document.createElement('tr');
    
    const nameCell = document.createElement('td');
    nameCell.innerHTML = `
      <div style="display: flex; align-items: center;">
        <div class="document-icon ${getDocumentIconClass(doc.type)}" style="width: 30px; height: 30px; margin-right: 10px; font-size: 16px;">
          ${getDocumentIconContent(doc.type)}
        </div>
        <span>${doc.name}</span>
      </div>
    `;
    
    const typeCell = document.createElement('td');
    typeCell.textContent = doc.type;
    
    const sizeCell = document.createElement('td');
    sizeCell.textContent = doc.size;
    
    const modifiedCell = document.createElement('td');
    modifiedCell.textContent = doc.lastModified;
    
    const actionsCell = document.createElement('td');
    const downloadButton = document.createElement('button');
    downloadButton.className = 'btn btn-secondary';
    downloadButton.textContent = 'Download';
    downloadButton.onclick = () => handleDownload(doc);
    actionsCell.appendChild(downloadButton);
    
    row.appendChild(nameCell);
    row.appendChild(typeCell);
    row.appendChild(sizeCell);
    row.appendChild(modifiedCell);
    row.appendChild(actionsCell);
    
    listContainer.appendChild(row);
  });
}

// Function to render documents in grid view
function renderDocumentsGrid() {
  const gridContainer = document.getElementById('documents-grid');
  if (!gridContainer) return;
  
  gridContainer.innerHTML = '';
  
  documents.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'document-card';
    
    card.innerHTML = `
      <div class="document-icon ${getDocumentIconClass(doc.type)}">
        ${getDocumentIconContent(doc.type)}
      </div>
      <div class="document-name">${doc.name}</div>
      <div class="document-meta">${doc.size} · ${doc.lastModified}</div>
      <button class="btn btn-secondary" onclick="handleDownload({id: '${doc.id}', name: '${doc.name}'})">Download</button>
    `;
    
    gridContainer.appendChild(card);
  });
}

// Helper function to get document icon class based on type
function getDocumentIconClass(type) {
  switch(type) {
    case 'PDF': return 'pdf';
    case 'Word': return 'word';
    case 'Excel': return 'excel';
    case 'PowerPoint': return 'ppt';
    default: return '';
  }
}

// Helper function to get document icon content based on type
function getDocumentIconContent(type) {
  switch(type) {
    case 'PDF': return '📄';
    case 'Word': return '📝';
    case 'Excel': return '📊';
    case 'PowerPoint': return '📑';
    default: return '📁';
  }
}

// Set up event listeners for the page
function setupEventListeners() {
  // Navigation links - Updated to switch between pages
  const navLinks = document.querySelectorAll('.nav-links li');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const pageName = this.getAttribute('data-page');
      
      // Update active navigation link
      navLinks.forEach(navLink => navLink.classList.remove('active'));
      this.classList.add('active');
      
      // Update page title
      const pageTitle = document.getElementById('page-title');
      pageTitle.textContent = this.querySelector('span:last-child').textContent;
      
      // Update active page
      const pages = document.querySelectorAll('.page');
      pages.forEach(page => page.classList.remove('active'));
      document.getElementById(pageName).classList.add('active');
    });
  });
  
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Update active tab button
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Show selected tab content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(tabId + '-view').classList.add('active');
    });
  });
  
  // Document search
  const searchInput = document.getElementById('doc-search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      // For a real application, this would filter the documents list
      console.log('Searching for:', searchTerm);
    });
  }
  
  // Upload button
  const uploadButton = document.querySelector('.upload-button');
  if (uploadButton) {
    uploadButton.addEventListener('click', function() {
      showModal('upload-modal');
    });
  }
  
  // Close modal
  const closeModal = document.querySelector('.close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      closeAllModals();
    });
  }
  
  // Upload form submission
  const uploadForm = document.getElementById('upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleUpload();
    });
  }
  
  // Modal background click to close
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      closeAllModals();
    }
  });
  
  // Calendar navigation for Activities page
  const prevMonthBtn = document.querySelector('.prev-month');
  const nextMonthBtn = document.querySelector('.next-month');
  if (prevMonthBtn && nextMonthBtn) {
    const calendarHeader = document.querySelector('.calendar-header');
    
    // Current date to track displayed month
    let currentDate = new Date();
    
    prevMonthBtn.addEventListener('click', function() {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendarHeader();
    });
    
    nextMonthBtn.addEventListener('click', function() {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendarHeader();
    });
    
    function updateCalendarHeader() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
      calendarHeader.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  }
  
  // Add event button functionality
  const addEventBtn = document.querySelector('.add-event-button');
  if (addEventBtn) {
    addEventBtn.addEventListener('click', function() {
      alert('Add event functionality would open a form in a real application.');
    });
  }
  
  // Save attendance button
  const saveAttendanceBtn = document.querySelector('.save-button');
  if (saveAttendanceBtn) {
    saveAttendanceBtn.addEventListener('click', function() {
      showToast('Attendance Saved', 'Attendance record has been saved successfully.');
    });
  }
  
  // Status select dropdowns in attendance
  const statusSelects = document.querySelectorAll('.status-select');
  statusSelects.forEach(select => {
    select.addEventListener('change', function() {
      this.className = 'status-select ' + this.value;
    });
  });
  
  // Statistics filters
  const statFilters = document.querySelectorAll('.filter-card select');
  statFilters.forEach(filter => {
    filter.addEventListener('change', function() {
      console.log('Filter changed:', this.id, 'value:', this.value);
      // In a real app, this would update the statistics display
    });
  });
  
  // Chat functionality for Staff Room
  const chatInput = document.querySelector('.chat-input input');
  const sendButton = document.querySelector('.send-button');
  const chatMessages = document.querySelector('.chat-messages');
  
  if (chatInput && sendButton && chatMessages) {
    sendButton.addEventListener('click', sendMessage);
    
    // Allow sending messages with Enter key
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    function sendMessage() {
      const message = chatInput.value.trim();
      if (message) {
        // Get current time
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const timeString = `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
        
        // Create a new message element
        const messageHTML = `
          <div class="message">
            <div class="message-avatar">JT</div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-author">John Teacher</span>
                <span class="message-time">${timeString}</span>
              </div>
              <div class="message-text">
                ${message}
              </div>
            </div>
          </div>
        `;
        
        // Add the message to the chat
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        
        // Clear the input field
        chatInput.value = '';
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }
  }
}

// Handle document download
function handleDownload(document) {
  showToast('Download Started', `${document.name} is being downloaded.`);
  
  // In a real application, this would start a download
  console.log('Downloading document:', document.id);
}

// Handle document upload
function handleUpload() {
  closeAllModals();
  
  // In a real application, this would upload the file
  const title = document.getElementById('title').value || 'New Document';
  showToast('Document Uploaded', `${title} has been successfully uploaded.`);
  
  // Clear form
  document.getElementById('upload-form').reset();
}

// Show modal
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

// Close all modals
function closeAllModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.classList.remove('active');
  });
}

// Show toast notification
function showToast(title, message) {
  const toast = document.getElementById('toast');
  const toastTitle = document.querySelector('.toast-title');
  const toastMessage = document.querySelector('.toast-message');
  
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  
  // Save preference to localStorage
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDarkMode);
}

// Check for saved dark mode preference
function checkDarkModePreference() {
  const savedDarkMode = localStorage.getItem('dark-mode');
  
  if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.checked = true;
    }
  }
}

// Enhanced chart initializing function
function initializeEnhancedCharts() {
  const chartPlaceholders = document.querySelectorAll('.chart-placeholder');
  
  chartPlaceholders.forEach((placeholder, index) => {
    // Chart type based on data attribute or index
    const chartType = placeholder.getAttribute('data-chart-type') || (index % 3 === 0 ? 'bar' : (index % 3 === 1 ? 'line' : 'pie'));
    
    switch(chartType) {
      case 'bar':
        createBarChart(placeholder);
        break;
      case 'line':
        createLineChart(placeholder);
        break;
      case 'pie':
        createPieChart(placeholder);
        break;
      default:
        createBarChart(placeholder);
    }
  });
}

function createBarChart(container) {
  const colors = ['#9b87f5', '#7E69AB', '#1EAEDB', '#8E9196', '#4caf50', '#f44336'];
  
  const barData = [
    { label: 'Math', value: Math.random() * 80 + 20 },
    { label: 'Physics', value: Math.random() * 80 + 20 },
    { label: 'Science', value: Math.random() * 80 + 20 },
    { label: 'English', value: Math.random() * 80 + 20 },
    { label: 'Biology', value: Math.random() * 80 + 20 }
  ];
  
  // Find the max value to calculate percentages
  const maxValue = Math.max(...barData.map(item => item.value));
  
  // Create labels container
  const labelsHTML = `
    <div class="chart-labels">
      ${barData.map(item => `<span>${item.label}</span>`).join('')}
    </div>
  `;
  
  // Create bars with animation
  const barsHTML = `
    <div class="chart-bars">
      ${barData.map((item, i) => `
        <div class="chart-bar" style="height: 0; background: ${colors[i % colors.length]};" 
             data-height="${(item.value / maxValue * 100).toFixed(0)}%">
          <span class="chart-value">${item.value.toFixed(0)}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  // Combine the elements
  container.innerHTML = `
    <div class="enhanced-chart bar-chart">
      ${barsHTML}
      ${labelsHTML}
    </div>
  `;
  
  // Animate bars after a short delay
  setTimeout(() => {
    container.querySelectorAll('.chart-bar').forEach(bar => {
      const targetHeight = bar.getAttribute('data-height');
      bar.style.height = targetHeight;
    });
  }, 100);
}

function createLineChart(container) {
  const data = [
    { label: 'Week 1', value: Math.random() * 60 + 40 },
    { label: 'Week 2', value: Math.random() * 60 + 40 },
    { label: 'Week 3', value: Math.random() * 60 + 40 },
    { label: 'Week 4', value: Math.random() * 60 + 40 },
    { label: 'Week 5', value: Math.random() * 60 + 40 }
  ];
  
  // Calculate points for the SVG path
  const maxValue = Math.max(...data.map(item => item.value));
  const width = 100; // percentage width
  const height = 100; // percentage height
  const pointSpacing = width / (data.length - 1);
  
  // Generate SVG path points
  let pathPoints = '';
  let circles = '';
  
  data.forEach((item, i) => {
    const x = i * pointSpacing;
    const y = height - (item.value / maxValue * height);
    
    if (i === 0) {
      pathPoints += `M${x},${y} `;
    } else {
      pathPoints += `L${x},${y} `;
    }
    
    circles += `
      <circle class="line-point" cx="${x}%" cy="${y}%" r="4" 
              data-value="${item.value.toFixed(0)}" data-label="${item.label}"></circle>
    `;
  });
  
  // Create the SVG content
  const svgContent = `
    <svg class="line-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path class="line-path" d="${pathPoints}" fill="none" stroke="#9b87f5" stroke-width="2" stroke-dasharray="1000" stroke-dashoffset="1000"></path>
      ${circles}
    </svg>
  `;
  
  // Create labels
  const labelsHTML = `
    <div class="chart-labels">
      ${data.map(item => `<span>${item.label}</span>`).join('')}
    </div>
  `;
  
  // Combine everything
  container.innerHTML = `
    <div class="enhanced-chart line-chart">
      ${svgContent}
      ${labelsHTML}
      <div class="chart-tooltip">
        <span class="tooltip-value"></span>
        <span class="tooltip-label"></span>
      </div>
    </div>
  `;
  
  // Animate path drawing
  setTimeout(() => {
    const path = container.querySelector('.line-path');
    path.style.strokeDashoffset = '0';
    path.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
  }, 100);
  
  // Add hover events to circles
  const chartTooltip = container.querySelector('.chart-tooltip');
  const tooltipValue = container.querySelector('.tooltip-value');
  const tooltipLabel = container.querySelector('.tooltip-label');
  
  container.querySelectorAll('.line-point').forEach(point => {
    point.addEventListener('mouseenter', function() {
      tooltipValue.textContent = this.getAttribute('data-value');
      tooltipLabel.textContent = this.getAttribute('data-label');
      
      const cx = parseFloat(this.getAttribute('cx'));
      const cy = parseFloat(this.getAttribute('cy'));
      
      chartTooltip.style.left = `${cx}%`;
      chartTooltip.style.top = `${cy - 10}%`;
      chartTooltip.classList.add('visible');
      
      this.setAttribute('r', '6');
    });
    
    point.addEventListener('mouseleave', function() {
      chartTooltip.classList.remove('visible');
      this.setAttribute('r', '4');
    });
  });
}

function createPieChart(container) {
  const data = [
    { label: 'A', value: 35, color: '#9b87f5' },
    { label: 'B', value: 25, color: '#4caf50' },
    { label: 'C', value: 20, color: '#f44336' },
    { label: 'D', value: 15, color: '#ff9800' },
    { label: 'F', value: 5, color: '#795548' }
  ];
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Generate SVG pie slices
  let cumulativeAngle = 0;
  const slices = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    
    // Calculate SVG arc path
    // SVG arc: M cx,cy L (point on radius at start angle) A rx,ry 0 flag,flag (point on radius at end angle) Z
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    
    // Convert angles to radians for calculation
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const centerX = 50;
    const centerY = 50;
    const radius = 40;
    
    const startX = centerX + radius * Math.cos(startRad);
    const startY = centerY + radius * Math.sin(startRad);
    const endX = centerX + radius * Math.cos(endRad);
    const endY = centerY + radius * Math.sin(endRad);
    
    // Flag for arc: 1 if angle is > 180 degrees
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const path = `M ${centerX},${centerY} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
    
    // For label positioning (place at the middle of the arc)
    const midRad = (startRad + endRad) / 2;
    const labelRadius = radius * 0.7; // Place labels at 70% of radius
    const labelX = centerX + labelRadius * Math.cos(midRad);
    const labelY = centerY + labelRadius * Math.sin(midRad);
    
    cumulativeAngle = endAngle;
    
    return {
      path,
      color: item.color,
      label: item.label,
      percentage: percentage.toFixed(0),
      labelX,
      labelY
    };
  });
  
  // Create SVG content
  const svgContent = `
    <svg class="pie-chart-svg" viewBox="0 0 100 100">
      ${slices.map((slice, i) => `
        <path class="pie-slice" d="${slice.path}" fill="${slice.color}" 
              stroke="#fff" stroke-width="1" data-index="${i}" opacity="0">
        </path>
      `).join('')}
      ${slices.map(slice => `
        <text class="pie-label" x="${slice.labelX}" y="${slice.labelY}" 
              text-anchor="middle" fill="#fff" font-size="8" font-weight="bold" opacity="0">
          ${slice.label}
        </text>
      `).join('')}
    </svg>
  `;
  
  // Generate legend
  const legendHTML = `
    <div class="chart-legend">
      ${data.map(item => `
        <div class="legend-item">
          <span class="legend-color" style="background-color: ${item.color}"></span>
          <span class="legend-label">${item.label}: ${(item.value / total * 100).toFixed(0)}%</span>
        </div>
      `).join('')}
    </div>
  `;
  
  // Combine everything
  container.innerHTML = `
    <div class="enhanced-chart pie-chart">
      ${svgContent}
      ${legendHTML}
    </div>
  `;
  
  // Animate pie slices and labels
  setTimeout(() => {
    container.querySelectorAll('.pie-slice').forEach((slice, i) => {
      setTimeout(() => {
        slice.style.opacity = '1';
        slice.style.transition = 'opacity 0.3s ease-in-out';
      }, i * 100);
    });
    
    container.querySelectorAll('.pie-label').forEach((label, i) => {
      setTimeout(() => {
        label.style.opacity = '1';
        label.style.transition = 'opacity 0.3s ease-in-out';
      }, i * 100 + 300);
    });
  }, 100);
  
  // Add hover effect for pie slices
  container.querySelectorAll('.pie-slice').forEach(slice => {
    slice.addEventListener('mouseenter', function() {
      this.style.opacity = '0.8';
      this.style.transform = 'translate(2px, 2px)';
      this.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
    });
    
    slice.addEventListener('mouseleave', function() {
      this.style.opacity = '1';
      this.style.transform = 'translate(0, 0)';
    });
  });
}