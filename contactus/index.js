const form = document.getElementById("contactForm");
const responseMessage = document.getElementById("responseMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  try {
    const response = await fetch("http://localhost:8080/cateringboys/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });

    const data = await response.json();
    if (response.ok) {
      responseMessage.style.color = "green";
      responseMessage.innerText = data.message;
      form.reset();
    } else {
      responseMessage.style.color = "red";
      responseMessage.innerText = data.error || "Failed to send message.";
    }
  } catch (error) {
    console.error(error);
    responseMessage.style.color = "red";
    responseMessage.innerText = "Server error. Try again later.";
  }
});


