// Load sidebar
fetch('../../components/sidebar/sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;

        initializeNavbar();
    });
    
function initializeNavbar() {
    document.querySelector('.sidebar-toggle')
        ?.addEventListener('click', () => {
            document.querySelector('.sidebar')
                .classList.toggle('collapsed');
        });
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      if(this.innerText.includes('Products')) alert('You are already on Product Management view.');
      else alert(`Demo: ${this.innerText} section (Product Management remains active).`);
    });
  });
    
}