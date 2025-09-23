// Main application logic
document.addEventListener('DOMContentLoaded', async () => {
    // Define routes
    const routes = [
        {
            path: '/',
            component: homePage,
            init: initHomePage
        },
        {
            path: '/departments',
            component: departmentsPage,
            init: initDepartmentsPage
        },
        {
            path: '/department/:id',
            component: departmentDetailPage,
            init: initDepartmentDetailPage
        },
        {
            path: '/about',
            component: aboutPage
        },
        {
            path: '*',
            component: notFoundPage
        }
    ];

    // Initialize router
    const router = new Router(routes);
    
    // Handle initial route
    router.handleRoute();
});

// Page Components
async function homePage() {
    return `
        <section class="home-page">
            <h2>Welcome to the Hawaii State Budget Explorer</h2>
            <p>Explore the FY 2026 budget allocations across all state departments.</p>
            
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="amount">$XX.XB</div>
                    <div class="label">Total Budget</div>
                </div>
                <div class="summary-card">
                    <div class="amount">XX</div>
                    <div class="label">Departments</div>
                </div>
                <div class="summary-card">
                    <div class="amount">$XX.XM</div>
                    <div class="label">Largest Department</div>
                </div>
            </div>
            
            <div class="cta-buttons">
                <a href="#/departments" class="button primary">Browse All Departments</a>
                <a href="#/about" class="button secondary">About This Project</a>
            </div>
            
            <div class="chart-container">
                <canvas id="budgetOverviewChart"></canvas>
            </div>
        </section>
    `;
}

async function departmentsPage() {
    // This would be populated from your data
    const departments = [
        { id: 'hrd', name: 'Human Resources Development', budget: '$37.0M' },
        { id: 'edn', name: 'Education', budget: '$2.3B' },
        { id: 'hth', name: 'Health', budget: '$1.8B' },
        // Add all departments here
    ];
    
    const departmentCards = departments.map(dept => `
        <a href="#/department/${dept.id}" class="department-card">
            <h3>${dept.name}</h3>
            <div class="card-content">
                <p><strong>Budget:</strong> ${dept.budget}</p>
                <span class="view-details">View Details →</span>
            </div>
        </a>
    `).join('');
    
    return `
        <section class="departments-page">
            <h2>All Departments</h2>
            <div class="department-grid">
                ${departmentCards}
            </div>
        </section>
    `;
}

async function departmentDetailPage() {
    const deptId = window.location.hash.split('/').pop();
    // This would be fetched from your data
    const deptData = {
        id: deptId,
        name: 'Human Resources Development',
        description: 'The Department of Human Resources Development manages the state workforce and employee benefits.',
        budget: {
            total: '$37,000,000',
            operating: '$35,000,000',
            capital: '$2,000,000',
            change: '+5.2%',
            changeType: 'increase'
        },
        programs: [
            { name: 'Employee Training', amount: '$12,000,000' },
            { name: 'Benefits Administration', amount: '$15,000,000' },
            { name: 'Workforce Development', amount: '$8,000,000' },
            { name: 'HR Technology', amount: '$2,000,000' }
        ]
    };
    
    const programRows = deptData.programs.map(program => `
        <tr>
            <td>${program.name}</td>
            <td class="amount">${program.amount}</td>
        </tr>
    `).join('');
    
    return `
        <section class="department-detail">
            <a href="#/departments" class="back-button">← Back to Departments</a>
            
            <div class="department-header">
                <h2>${deptData.name}</h2>
                <p>${deptData.description}</p>
            </div>
            
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="amount">${deptData.budget.total}</div>
                    <div class="label">Total Budget</div>
                </div>
                <div class="summary-card">
                    <div class="amount">${deptData.budget.operating}</div>
                    <div class="label">Operating</div>
                </div>
                <div class="summary-card">
                    <div class="amount">${deptData.budget.capital}</div>
                    <div class="label">Capital</div>
                </div>
                <div class="summary-card">
                    <div class="amount ${deptData.budget.changeType}">${deptData.budget.change}</div>
                    <div class="label">vs. Last Year</div>
                </div>
            </div>
            
            <div class="chart-container">
                <canvas id="deptBudgetChart"></canvas>
            </div>
            
            <h3>Program Allocations</h3>
            <table class="budget-table">
                <thead>
                    <tr>
                        <th>Program</th>
                        <th class="amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${programRows}
                </tbody>
            </table>
        </section>
    `;
}

async function aboutPage() {
    return `
        <section class="about-page">
            <h2>About the Hawaii State Budget Explorer</h2>
            <p>This interactive tool allows you to explore the Hawaii State Budget for Fiscal Year 2026.</p>
            
            <h3>Data Sources</h3>
            <ul>
                <li>HB300 CD1 - State of Hawaii Operating and Capital Budget</li>
                <li>Department of Budget and Finance</li>
                <li>Governor's Office</li>
            </ul>
            
            <h3>Methodology</h3>
            <p>Budget data is sourced from official state documents and processed to provide an accessible view of state spending.</p>
            
            <h3>Contact</h3>
            <p>For questions about this tool, please contact [Your Contact Information].</p>
        </section>
    `;
}

function notFoundPage() {
    return `
        <div class="not-found">
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <a href="#/" class="button">Return to Home</a>
        </div>
    `;
}

// Initialization Functions
async function initHomePage() {
    // Initialize home page charts
    const ctx = document.getElementById('budgetOverviewChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Education', 'Health', 'Transportation', 'Public Safety', 'HRD', 'Other'],
            datasets: [{
                label: 'Budget ($ Millions)',
                data: [2300, 1800, 1200, 850, 37, 2500],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toLocaleString()}M`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return `$${value.toLocaleString()}M`;
                        }
                    }
                }
            }
        }
    });
}

async function initDepartmentsPage() {
    // Any department list specific initialization
    console.log('Departments page initialized');
}

async function initDepartmentDetailPage() {
    // Initialize department detail charts
    const ctx = document.getElementById('deptBudgetChart')?.getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Employee Training', 'Benefits', 'Workforce Dev', 'Technology'],
                datasets: [{
                    data: [12, 15, 8, 2],
                    backgroundColor: [
                        '#4e79a7',
                        '#f28e2b',
                        '#e15759',
                        '#76b7b2'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: $${value}M (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Utility function to update iframe height
function updateIframeHeight() {
    if (window.self !== window.top) {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({ 
            type: 'setHeight', 
            height: height 
        }, '*');
    }
}

// Update iframe height on window resize
window.addEventListener('resize', updateIframeHeight);
