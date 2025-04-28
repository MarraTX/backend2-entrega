// Handle logout button click
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/sessions/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    alert('Logout failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during logout');
            }
        });
    }
    
    // Add Handlebars helpers
    if (typeof Handlebars !== 'undefined') {
        Handlebars.registerHelper('multiply', function(a, b) {
            return a * b;
        });
        
        Handlebars.registerHelper('addNumbers', function(a, b) {
            return a + b;
        });
        
        Handlebars.registerHelper('calculateTotal', function(products) {
            return products.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
        });
        
        Handlebars.registerHelper('eq', function(a, b) {
            return a === b;
        });
        
        Handlebars.registerHelper('range', function(start, end) {
            const result = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        });
    }
});
