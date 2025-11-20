const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value;
  const output = document.getElementById("result");

  try {
    const response = await fetch('http://localhost:8080/cateringboys/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      showToast(data.error || "❌ Invalid email or password", "error");
      return;
    }

    // ✅ Login successful
    showToast("✅ You have logged in successfully!", "success");

    // ✅ Save login info in localStorage (common for both roles)
    const userInfo = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: role
    };
    localStorage.setItem("loggedInUser", JSON.stringify(userInfo));

    // ✅ Redirect based on role

    setTimeout(() => {
      if (role === "ADMIN") window.location.href = "../admindash/index.html";
      else window.location.href = "../userdash/index.html";
    }, 1000);
    

  } catch (err) {
    console.error("Server error:", err);
    output.innerText = "⚠️ Server not reachable. Try again later.";
    output.style.color = "#ff4d4d";
  }
});

// ✅ Clear messages when user focuses inputs
["email", "password", "role"].forEach(id => {
  document.getElementById(id).addEventListener("focus", () => {
    document.getElementById("result").textContent = "";
  });
});


function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.textContent = message;

  // Style toast
  toast.style.minWidth = "200px";
  toast.style.marginBottom = "10px";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.color = "#fff";
  toast.style.fontWeight = "bold";
  toast.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.5s";

  // Set background based on type
  toast.style.backgroundColor = type === "success" ? "#4BB543" : "#ff4d4d";

  container.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);

  // Hide and remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => container.removeChild(toast), 500);
  }, 3000);
}

