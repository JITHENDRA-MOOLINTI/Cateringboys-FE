document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value,
    role: document.getElementById("role").value
  };

  try {
    const response = await fetch("https://cateringboys-be.onrender.com/cateringboys/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      alert("🎉 Account created successfully!");
      window.location.href = "../login/index.html"; // redirect to home page
    } else {
      alert("⚠️ Failed to create account. Try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Something went wrong!");
  }
});
