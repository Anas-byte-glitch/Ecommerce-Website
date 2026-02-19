// العناصر
const loginSidebar = document.getElementById('login-sidebar');
const loginClose = document.getElementById('login-close');
const loginButtons = document.querySelectorAll('.seConnecter-js'); // جميع أزرار تسجيل الدخول
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

// فتح الـ Sidebar عند الضغط على أي زر
loginButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        loginSidebar.classList.add('active');
        overlay.classList.add("show");
    });
});

loginButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        /* ⬅️ اغلق Sidebar Menu */
        sideBar?.classList.remove("show-side-bar");

        /* ➡️ افتح Sidebar Login */
        loginSidebar?.classList.add("active");

        /* Overlay يبقى */
        overlay?.classList.add("show");
    });
});

// إغلاق الـ Sidebar عند الضغط على زر الإغلاق أو الـ overlay
loginClose.addEventListener('click', () => {
    loginSidebar.classList.remove('active');
    overlay.classList.remove("show");
});

overlay.addEventListener('click', () => {
    loginSidebar.classList.remove('active');
    overlay.classList.remove("show");
});

// Toggle Show/Hide Password
togglePassword.addEventListener('click', () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.innerHTML = '<i class="ri-eye-off-line"></i>';
    } else {
        passwordInput.type = "password";
        togglePassword.innerHTML = '<i class="ri-eye-line"></i>';
    }
});