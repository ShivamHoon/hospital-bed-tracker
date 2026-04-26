// ==================== ENHANCED DATA MODEL ====================
let hospitals = [
    { id: 1, name: "Apollo City Hospital", city: "Mumbai", address: "12 Marine Drive, Mumbai", phone: "+912240501000", image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&h=400&fit=crop",
      beds: { general: { total: 120, available: 42 }, icu: { total: 40, available: 6 }, ventilator: { total: 15, available: 2 }, oxygen: { total: 60, available: 25 } } },
    { id: 2, name: "Fortis Memorial", city: "Delhi", address: "Sector 44, Gurugram", phone: "+911244500111", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
      beds: { general: { total: 200, available: 88 }, icu: { total: 60, available: 18 }, ventilator: { total: 25, available: 8 }, oxygen: { total: 90, available: 55 } } },
    { id: 3, name: "Manipal Health", city: "Bengaluru", address: "98 HAL Airport Rd", phone: "+918030554400", image: "https://images.unsplash.com/photo-1538108149393-cebb47ac1927?w=600&h=400&fit=crop",
      beds: { general: { total: 150, available: 12 }, icu: { total: 35, available: 0 }, ventilator: { total: 12, available: 1 }, oxygen: { total: 50, available: 8 } } },
    { id: 4, name: "AIIMS Central", city: "Delhi", address: "Ansari Nagar", phone: "+911126588500", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&h=400&fit=crop",
      beds: { general: { total: 300, available: 110 }, icu: { total: 80, available: 24 }, ventilator: { total: 40, available: 12 }, oxygen: { total: 140, available: 60 } } },
    { id: 5, name: "Kokilaben Hospital", city: "Mumbai", address: "Rao Saheb Achutrao Patwardhan Marg", phone: "+912242669999", image: "https://images.unsplash.com/photo-1551076805-e1869043e560?w=600&h=400&fit=crop",
      beds: { general: { total: 220, available: 95 }, icu: { total: 55, available: 20 }, ventilator: { total: 22, available: 9 }, oxygen: { total: 100, available: 48 } } },
    { id: 6, name: "Narayana Health", city: "Bengaluru", address: "258/A Bommasandra", phone: "+918067890000", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop",
      beds: { general: { total: 180, available: 0 }, icu: { total: 50, available: 3 }, ventilator: { total: 20, available: 0 }, oxygen: { total: 70, available: 5 } } },
    { id: 7, name: "Medanta Hospital", city: "Gurugram", address: "Sector 38", phone: "+911244141414", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop",
      beds: { general: { total: 250, available: 75 }, icu: { total: 70, available: 15 }, ventilator: { total: 30, available: 5 }, oxygen: { total: 120, available: 35 } } },
    { id: 8, name: "Jaslok Hospital", city: "Mumbai", address: "15 Pedder Road", phone: "+912266570000", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=400&fit=crop",
      beds: { general: { total: 180, available: 45 }, icu: { total: 45, available: 8 }, ventilator: { total: 18, available: 3 }, oxygen: { total: 85, available: 28 } } },
    { id: 9, name: "Lilavati Hospital", city: "Mumbai", address: "Bandra West", phone: "+912226767676", image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=600&h=400&fit=crop",
      beds: { general: { total: 160, available: 38 }, icu: { total: 50, available: 5 }, ventilator: { total: 20, available: 1 }, oxygen: { total: 75, available: 22 } } },
    { id: 10, name: "Sir Ganga Ram", city: "Delhi", address: "Rajinder Nagar", phone: "+911142242424", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
      beds: { general: { total: 200, available: 55 }, icu: { total: 60, available: 10 }, ventilator: { total: 25, available: 2 }, oxygen: { total: 95, available: 30 } } }
];

let searchTimeout;
let recentActivity = [];

// ==================== HELPER FUNCTIONS ====================
function getAvailabilityClass(available, total) {
    let percent = total === 0 ? 0 : (available / total) * 100;
    if (percent >= 50) return "badge-available";
    if (percent >= 20) return "badge-limited";
    if (available === 0) return "badge-full";
    return "badge-critical";
}

function getOverallStatus(hospital) {
    let totalFree = hospital.beds.general.available + hospital.beds.icu.available + 
                    hospital.beds.ventilator.available + hospital.beds.oxygen.available;
    let totalBeds = hospital.beds.general.total + hospital.beds.icu.total + 
                    hospital.beds.ventilator.total + hospital.beds.oxygen.total;
    let percent = totalBeds === 0 ? 0 : (totalFree / totalBeds) * 100;
    if (percent >= 30) return { text: "Available", class: "badge-available" };
    if (percent >= 10) return { text: "Limited", class: "badge-limited" };
    if (totalFree === 0) return { text: "Full", class: "badge-full" };
    return { text: "Critical", class: "badge-critical" };
}

function logActivity(message, type = 'info') {
    recentActivity.unshift({ message, time: new Date().toLocaleTimeString(), type });
    if (recentActivity.length > 10) recentActivity.pop();
    updateOffcanvasStats();
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-notification show mb-2`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-header ${type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}">
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
            <strong class="me-auto">${type === 'success' ? 'Booking Confirmed' : 'Booking Failed'}</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateOffcanvasStats() {
    const statsDiv = document.getElementById('offcanvasStats');
    const totalBeds = hospitals.reduce((s, h) => s + h.beds.general.available + h.beds.icu.available + h.beds.ventilator.available + h.beds.oxygen.available, 0);
    statsDiv.innerHTML = `
        <div class="mb-2">Total Hospitals: <strong>${hospitals.length}</strong></div>
        <div class="mb-2">Total Available Beds: <strong>${totalBeds}</strong></div>
        <div class="mb-2">Cities Covered: <strong>${[...new Set(hospitals.map(h => h.city))].length}</strong></div>
    `;
    
    const activityDiv = document.getElementById('recentActivityLog');
    activityDiv.innerHTML = recentActivity.map(a => `
        <div class="small mb-2 p-2 bg-light rounded">
            <i class="bi ${a.type === 'success' ? 'bi-check-circle text-success' : 'bi-info-circle text-info'}"></i>
            ${a.message}<br><small class="text-muted">${a.time}</small>
        </div>
    `).join('');
}

// ==================== RENDER HOSPITAL SECTION ====================
function renderHospitalSection() {
    const container = document.getElementById("mainContent");
    let totalGeneral = hospitals.reduce((s, h) => s + h.beds.general.available, 0);
    let totalICU = hospitals.reduce((s, h) => s + h.beds.icu.available, 0);
    let totalVent = hospitals.reduce((s, h) => s + h.beds.ventilator.available, 0);
    let totalOxy = hospitals.reduce((s, h) => s + h.beds.oxygen.available, 0);
    
    container.innerHTML = `
        <div class="hero-section text-white text-center">
            <h1 class="display-4 fw-bold"><i class="bi bi-heart-pulse-fill"></i> Find Hospital Beds Instantly</h1>
            <p class="lead mt-3">Real-time availability across 50+ hospitals | 24/7 Emergency Support</p>
            <div class="mt-4">
                <button class="btn btn-light btn-lg me-2" id="scrollToHospitalsBtn"><i class="bi bi-search-heart"></i> Find Bed Now</button>
                <button class="btn btn-outline-light btn-lg" data-bs-toggle="modal" data-bs-target="#bookingModal"><i class="bi bi-calendar-check"></i> Emergency Booking</button>
            </div>
        </div>
        
        <div class="row g-4 mb-5">
            <div class="col-md-3 col-6">
                <div class="stat-card p-3 text-center shadow">
                    <i class="bi bi-hospital stats-icon text-primary" style="font-size: 2.5rem;"></i>
                    <h3 class="mt-2 fw-bold">${hospitals.length}</h3>
                    <p class="text-muted mb-0">Partner Hospitals</p>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="stat-card p-3 text-center shadow">
                    <i class="bi bi-person-bed stats-icon text-success" style="font-size: 2.5rem;"></i>
                    <h3 class="mt-2 fw-bold">${totalGeneral}</h3>
                    <p class="text-muted mb-0">General Beds</p>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="stat-card p-3 text-center shadow">
                    <i class="bi bi-heart-pulse stats-icon text-danger" style="font-size: 2.5rem;"></i>
                    <h3 class="mt-2 fw-bold">${totalICU}</h3>
                    <p class="text-muted mb-0">ICU Beds</p>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="stat-card p-3 text-center shadow">
                    <i class="bi bi-wind stats-icon text-info" style="font-size: 2.5rem;"></i>
                    <h3 class="mt-2 fw-bold">${totalVent + totalOxy}</h3>
                    <p class="text-muted mb-0">Oxygen/Ventilator</p>
                </div>
            </div>
        </div>
        
        <!-- Tabs for filtering -->
        <ul class="nav nav-tabs mb-4" id="bedTypeTabs">
            <li class="nav-item"><button class="nav-link active" data-filter-type="all">All Beds</button></li>
            <li class="nav-item"><button class="nav-link" data-filter-type="general">General Ward</button></li>
            <li class="nav-item"><button class="nav-link" data-filter-type="icu">ICU</button></li>
            <li class="nav-item"><button class="nav-link" data-filter-type="ventilator">Ventilator</button></li>
            <li class="nav-item"><button class="nav-link" data-filter-type="oxygen">Oxygen</button></li>
        </ul>
        
        <div class="filter-section mb-4">
            <div class="row g-3 align-items-end">
                <div class="col-md-4">
                    <label class="form-label fw-bold"><i class="bi bi-search"></i> Search Hospital</label>
                    <input type="text" class="form-control" id="searchInput" placeholder="Name or city...">
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-bold"><i class="bi bi-geo-alt"></i> Filter by City</label>
                    <select class="form-select" id="cityFilter">
                        <option value="">All Cities</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Gurugram">Gurugram</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-primary w-100" id="resetFiltersBtn">
                        <i class="bi bi-arrow-repeat"></i> Reset
                    </button>
                </div>
            </div>
        </div>
        
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3><i class="bi bi-building"></i> Hospital Directory</h3>
            <span class="badge bg-secondary" id="resultCount">${hospitals.length} Hospitals</span>
        </div>
        <div class="row g-4" id="hospitalsGrid"></div>
    `;
    
    populateHospitalsGrid();
    attachFiltersAndEvents();
}

function populateHospitalsGrid() {
    const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const cityFilter = document.getElementById("cityFilter")?.value || "";
    const activeTab = document.querySelector("#bedTypeTabs .nav-link.active")?.getAttribute("data-filter-type") || "all";
    
    let filtered = hospitals.filter(h => {
        if (searchTerm && !h.name.toLowerCase().includes(searchTerm) && !h.city.toLowerCase().includes(searchTerm)) return false;
        if (cityFilter && h.city !== cityFilter) return false;
        if (activeTab !== "all" && h.beds[activeTab].available <= 0) return false;
        return true;
    });
    
    document.getElementById("resultCount").innerHTML = `${filtered.length} Hospitals`;
    const grid = document.getElementById("hospitalsGrid");
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle-fill fs-1 d-block mb-3"></i>
                    <h4>No Hospitals Found</h4>
                    <p>Try adjusting your search or filter criteria</p>
                    <button class="btn btn-primary" onclick="location.reload()">Reset Filters</button>
                </div>
            </div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(h => {
        const status = getOverallStatus(h);
        const hasBeds = (h.beds.general.available + h.beds.icu.available + h.beds.ventilator.available + h.beds.oxygen.available) > 0;
        const generalPercent = (h.beds.general.available / h.beds.general.total) * 100;
        const icuPercent = (h.beds.icu.available / h.beds.icu.total) * 100;
        
        return `
            <div class="col-md-6 col-lg-4" data-hospital-id="${h.id}">
                <div class="card h-100 shadow-sm hospital-card">
                    <img src="${h.image}" class="card-img-top" alt="${h.name}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold mb-0">${h.name}</h5>
                            <span class="badge ${status.class} badge-status">${status.text}</span>
                        </div>
                        <p class="card-text text-muted small">
                            <i class="bi bi-geo-alt-fill text-danger"></i> ${h.city}<br>
                            <i class="bi bi-telephone-fill"></i> ${h.phone}
                        </p>
                        
                        <div class="mb-2">
                            <div class="d-flex justify-content-between small">
                                <span>General Beds</span>
                                <span class="fw-bold">${h.beds.general.available}/${h.beds.general.total}</span>
                            </div>
                            <div class="progress"><div class="progress-bar bg-success" style="width: ${generalPercent}%"></div></div>
                        </div>
                        <div class="mb-2">
                            <div class="d-flex justify-content-between small">
                                <span>ICU Beds</span>
                                <span class="fw-bold">${h.beds.icu.available}/${h.beds.icu.total}</span>
                            </div>
                            <div class="progress"><div class="progress-bar bg-danger" style="width: ${icuPercent}%"></div></div>
                        </div>
                        
                        <div class="mt-3 d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary flex-grow-1 detail-btn" data-id="${h.id}">
                                <i class="bi bi-eye"></i> Details
                            </button>
                            <button class="btn btn-sm ${hasBeds ? 'btn-success' : 'btn-secondary'} flex-grow-1 book-btn" 
                                    data-id="${h.id}" data-name="${h.name}" ${!hasBeds ? 'disabled' : ''}>
                                <i class="bi bi-calendar-plus"></i> ${hasBeds ? 'Book' : 'Full'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.detail-btn').forEach(btn => btn.addEventListener('click', () => showHospitalDetail(parseInt(btn.dataset.id))));
    document.querySelectorAll('.book-btn').forEach(btn => btn.addEventListener('click', () => openBookingModal(parseInt(btn.dataset.id), btn.dataset.name)));
}

function attachFiltersAndEvents() {
    const searchInput = document.getElementById("searchInput");
    const cityFilter = document.getElementById("cityFilter");
    const resetBtn = document.getElementById("resetFiltersBtn");
    
    // Debounced search
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => populateHospitalsGrid(), 300);
    });
    if (cityFilter) cityFilter.addEventListener('change', () => populateHospitalsGrid());
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = "";
        if (cityFilter) cityFilter.value = "";
        populateHospitalsGrid();
    });
    
    // Tab clicks
    document.querySelectorAll("#bedTypeTabs .nav-link").forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll("#bedTypeTabs .nav-link").forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            populateHospitalsGrid();
        });
    });
    
    const scrollBtn = document.getElementById("scrollToHospitalsBtn");
    if (scrollBtn) scrollBtn.addEventListener('click', () => document.getElementById("hospitalsGrid")?.scrollIntoView({ behavior: 'smooth' }));
}

function showHospitalDetail(hospitalId) {
    const hospital = hospitals.find(h => h.id === hospitalId);
    if (!hospital) return;
    
    const generalPercent = (hospital.beds.general.available / hospital.beds.general.total) * 100;
    const icuPercent = (hospital.beds.icu.available / hospital.beds.icu.total) * 100;
    const ventPercent = (hospital.beds.ventilator.available / hospital.beds.ventilator.total) * 100;
    const oxyPercent = (hospital.beds.oxygen.available / hospital.beds.oxygen.total) * 100;
    
    const modalBody = document.getElementById("detailModalBody");
    modalBody.innerHTML = `
        <img src="${hospital.image}" class="img-fluid rounded mb-3" style="max-height: 250px; width: 100%; object-fit: cover;">
        <h4 class="mb-3">${hospital.name}</h4>
        <p><i class="bi bi-geo-alt-fill text-danger"></i> ${hospital.address}<br><i class="bi bi-telephone-fill"></i> <strong>Phone:</strong> ${hospital.phone}</p>
        
        <div class="mb-3">
            <div class="d-flex justify-content-between"><span>General Ward</span><span class="fw-bold">${hospital.beds.general.available}/${hospital.beds.general.total}</span></div>
            <div class="progress"><div class="progress-bar bg-success" style="width: ${generalPercent}%"></div></div>
            <div class="d-flex justify-content-between mt-2"><span>ICU</span><span class="fw-bold">${hospital.beds.icu.available}/${hospital.beds.icu.total}</span></div>
            <div class="progress"><div class="progress-bar bg-danger" style="width: ${icuPercent}%"></div></div>
            <div class="d-flex justify-content-between mt-2"><span>Ventilator</span><span class="fw-bold">${hospital.beds.ventilator.available}/${hospital.beds.ventilator.total}</span></div>
            <div class="progress"><div class="progress-bar bg-warning" style="width: ${ventPercent}%"></div></div>
            <div class="d-flex justify-content-between mt-2"><span>Oxygen Supported</span><span class="fw-bold">${hospital.beds.oxygen.available}/${hospital.beds.oxygen.total}</span></div>
            <div class="progress"><div class="progress-bar bg-info" style="width: ${oxyPercent}%"></div></div>
        </div>
    `;
    new bootstrap.Modal(document.getElementById("hospitalDetailModal")).show();
}

// ==================== BOOKING FUNCTIONALITY ====================
let currentBookingHospitalId = null;

function openBookingModal(hospitalId, hospitalName) {
    const hospital = hospitals.find(h => h.id === hospitalId);
    if (!hospital) return;
    
    currentBookingHospitalId = hospitalId;
    document.getElementById("bookingHospitalName").innerText = hospitalName;
    
    const bedTypeSelect = document.getElementById("bookingBedType");
    const msgDiv = document.getElementById("bookingAvailabilityMsg");
    
    bedTypeSelect.onchange = () => {
        const bedType = bedTypeSelect.value;
        const available = hospital.beds[bedType].available;
        if (available === 0) {
            msgDiv.innerHTML = `<div class="alert alert-danger">⚠️ No ${bedType} beds available!</div>`;
        } else {
            msgDiv.innerHTML = `<div class="alert alert-success">✅ ${available} ${bedType} beds available!</div>`;
        }
    };
    bedTypeSelect.dispatchEvent(new Event('change'));
    
    new bootstrap.Modal(document.getElementById("bookingModal")).show();
}

document.getElementById("confirmBookingBtn")?.addEventListener("click", () => {
    const hospital = hospitals.find(h => h.id === currentBookingHospitalId);
    const bedType = document.getElementById("bookingBedType").value;
    
    if (hospital && hospital.beds[bedType].available > 0) {
        hospital.beds[bedType].available--;
        showToast(`✅ ${bedType.toUpperCase()} bed booked at ${hospital.name}! Remaining: ${hospital.beds[bedType].available}`, 'success');
        logActivity(`Booked ${bedType} bed at ${hospital.name}`, 'success');
        
        bootstrap.Modal.getInstance(document.getElementById("bookingModal")).hide();
        
        if (document.getElementById("hospitalsGrid")) populateHospitalsGrid();
        if (document.getElementById("adminTableBody")) renderAdminSection();
        
        // Animate updated card
        const card = document.querySelector(`[data-hospital-id="${currentBookingHospitalId}"]`);
        if (card) card.classList.add('bed-updated');
        setTimeout(() => card?.classList.remove('bed-updated'), 500);
    } else {
        showToast(`❌ No ${bedType} beds available at ${hospital?.name || 'this hospital'}`, 'danger');
        logActivity(`Failed booking: No ${bedType} beds at ${hospital?.name}`, 'error');
    }
});

// ==================== ADMIN SECTION ====================
function renderAdminSection() {
    const container = document.getElementById("mainContent");
    container.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h4 class="mb-0"><i class="bi bi-shield-lock"></i> Hospital Management System</h4>
                <button class="btn btn-success" id="addNewHospitalBtn"><i class="bi bi-plus-circle"></i> Add New Hospital</button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="table-dark"><tr><th>ID</th><th>Hospital Name</th><th>City</th><th>General</th><th>ICU</th><th>Ventilator</th><th>Oxygen</th><th>Actions</th></tr></thead>
                        <tbody id="adminTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    const tbody = document.getElementById("adminTableBody");
    tbody.innerHTML = hospitals.map(h => `
        <tr><td>${h.id}</td><td><strong>${h.name}</strong></td><td>${h.city}</td>
        <td>${h.beds.general.available}/${h.beds.general.total}</td><td>${h.beds.icu.available}/${h.beds.icu.total}</td>
        <td>${h.beds.ventilator.available}/${h.beds.ventilator.total}</td><td>${h.beds.oxygen.available}/${h.beds.oxygen.total}</td>
        <td><button class="btn btn-sm btn-warning edit-hospital" data-id="${h.id}"><i class="bi bi-pencil"></i> Edit</button>
        <button class="btn btn-sm btn-danger delete-hospital" data-id="${h.id}"><i class="bi bi-trash"></i> Delete</button></td></tr>
    `).join('');
    
    document.querySelectorAll(".edit-hospital").forEach(btn => btn.addEventListener("click", () => openHospitalForm(parseInt(btn.dataset.id))));
    document.querySelectorAll(".delete-hospital").forEach(btn => btn.addEventListener("click", () => {
        if (confirm("Delete this hospital permanently?")) {
            hospitals = hospitals.filter(h => h.id !== parseInt(btn.dataset.id));
            renderAdminSection();
            if (document.getElementById("hospitalsGrid")) populateHospitalsGrid();
            logActivity(`Deleted hospital ${btn.dataset.id}`, 'info');
            showToast("Hospital deleted successfully!", "success");
        }
    }));
    document.getElementById("addNewHospitalBtn").addEventListener("click", () => openHospitalForm(null));
}

function openHospitalForm(id) {
    const modal = new bootstrap.Modal(document.getElementById("hospitalFormModal"));
    if (id) {
        const h = hospitals.find(h => h.id === id);
        if (h) {
            document.getElementById("hospitalFormTitle").innerText = "Edit Hospital";
            document.getElementById("editId").value = h.id;
            document.getElementById("hName").value = h.name;
            document.getElementById("hCity").value = h.city;
            document.getElementById("hAddress").value = h.address;
            document.getElementById("hPhone").value = h.phone;
            document.getElementById("genTotal").value = h.beds.general.total;
            document.getElementById("genAvail").value = h.beds.general.available;
            document.getElementById("icuTotal").value = h.beds.icu.total;
            document.getElementById("icuAvail").value = h.beds.icu.available;
            document.getElementById("ventTotal").value = h.beds.ventilator.total;
            document.getElementById("ventAvail").value = h.beds.ventilator.available;
            document.getElementById("oxyTotal").value = h.beds.oxygen.total;
            document.getElementById("oxyAvail").value = h.beds.oxygen.available;
        }
    } else {
        document.getElementById("hospitalFormTitle").innerText = "Add New Hospital";
        document.getElementById("editId").value = "";
        document.getElementById("hName").value = "";
        document.getElementById("hCity").value = "";
        document.getElementById("hAddress").value = "";
        document.getElementById("hPhone").value = "";
        document.getElementById("genTotal").value = 100;
        document.getElementById("genAvail").value = 50;
        document.getElementById("icuTotal").value = 40;
        document.getElementById("icuAvail").value = 20;
        document.getElementById("ventTotal").value = 15;
        document.getElementById("ventAvail").value = 5;
        document.getElementById("oxyTotal").value = 60;
        document.getElementById("oxyAvail").value = 30;
    }
    modal.show();
}

document.getElementById("hospitalForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const editId = document.getElementById("editId").value;
    const hospitalData = {
        id: editId ? parseInt(editId) : Date.now(),
        name: document.getElementById("hName").value,
        city: document.getElementById("hCity").value,
        address: document.getElementById("hAddress").value || "Address not provided",
        phone: document.getElementById("hPhone").value || "Not available",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
        beds: {
            general: { total: parseInt(document.getElementById("genTotal").value), available: parseInt(document.getElementById("genAvail").value) },
            icu: { total: parseInt(document.getElementById("icuTotal").value), available: parseInt(document.getElementById("icuAvail").value) },
            ventilator: { total: parseInt(document.getElementById("ventTotal").value), available: parseInt(document.getElementById("ventAvail").value) },
            oxygen: { total: parseInt(document.getElementById("oxyTotal").value), available: parseInt(document.getElementById("oxyAvail").value) }
        }
    };
    
    if (editId) {
        const index = hospitals.findIndex(h => h.id == editId);
        if (index !== -1) hospitals[index] = hospitalData;
        showToast("Hospital updated successfully!", "success");
        logActivity(`Updated hospital: ${hospitalData.name}`, 'info');
    } else {
        hospitals.push(hospitalData);
        showToast("New hospital added successfully!", "success");
        logActivity(`Added new hospital: ${hospitalData.name}`, 'success');
    }
    bootstrap.Modal.getInstance(document.getElementById("hospitalFormModal")).hide();
    renderAdminSection();
    if (document.getElementById("hospitalsGrid")) populateHospitalsGrid();
});

// ==================== NAVIGATION ====================
function showHome() { renderHospitalSection(); document.getElementById("breadcrumbNav").innerHTML = '<li class="breadcrumb-item active">Dashboard</li>'; }
function showAdmin() { renderAdminSection(); document.getElementById("breadcrumbNav").innerHTML = '<li class="breadcrumb-item"><a href="#" id="goHome">Dashboard</a></li><li class="breadcrumb-item active">Admin Panel</li>'; document.getElementById("goHome")?.addEventListener("click", (e) => { e.preventDefault(); showHome(); }); }

document.getElementById("navHome")?.addEventListener("click", (e) => { e.preventDefault(); showHome(); });
document.getElementById("navHospitals")?.addEventListener("click", (e) => { e.preventDefault(); showHome(); });
document.getElementById("navAdmin")?.addEventListener("click", (e) => { e.preventDefault(); showAdmin(); });

// Initialize tooltips and popovers
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

setTimeout(() => { document.getElementById("loadingSpinner").style.display = "none"; showHome(); logActivity("System initialized", "info"); }, 500);
