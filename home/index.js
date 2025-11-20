const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');
const closeBtn = document.getElementById('close-btn');
const authBtn = document.getElementById("auth-btn");

// Open mobile menu
menuIcon.addEventListener('click', () => {
  navLinks.classList.add('active');
});

// Close menu
closeBtn.addEventListener('click', () => {
  navLinks.classList.remove('active');
});

// ✅ Check login status using "loggedInUser"
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (loggedInUser) {
  authBtn.textContent = "Logout";
} else {
  authBtn.textContent = "Login";
}

// ✅ Handle Login / Logout actions
authBtn.addEventListener("click", () => {
  if (authBtn.textContent === "Login") {
    window.location.href = "../login/index.html";
  } else {
    // Logout logic
    localStorage.removeItem("loggedInUser");
    authBtn.textContent = "Login";
    alert("You have logged out successfully!");
    // Optionally reload page
    window.location.reload();
  }
});

// ✅ Reload when clicking the logo
document.querySelector(".logo").addEventListener("click", () => {
  window.location.reload();
});

// ✅ Close mobile menu when any nav link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});
