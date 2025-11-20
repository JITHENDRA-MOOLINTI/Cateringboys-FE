const findAccountBtn = document.getElementById("findAccountBtn");
const updatePasswordBtn = document.getElementById("updatePasswordBtn");
const accountDiv = document.getElementById("accountInfo");
const result = document.getElementById("result");

findAccountBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  result.innerText = "";

  if (!email) {
    result.innerText = "Please enter your email.";
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/cateringboys?email=${email}`);
    const data = await response.json();
   
    console.log(data);

    if (!response.ok) {
      result.innerText = data.error || "Account not found!";
      return;
    }

    // Display user info and password inputs
    document.getElementById("name").innerText = data.name;
    document.getElementById("userEmail").innerText = data.email;
    document.getElementById("phone").innerText = data.phone;
    accountDiv.style.display = "block";

  } catch (err) {
    console.error(err);
    result.innerText = "Server error. Try again later.";
  }
});

updatePasswordBtn.addEventListener("click", async () => {
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const email = document.getElementById("userEmail").innerText;

  result.innerText = "";

  if (!newPassword || !confirmPassword) {
    result.innerText = "Please enter both password fields.";
    return;
  }

  if (newPassword !== confirmPassword) {
    result.innerText = "Passwords do not match!";
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/cateringboys/user/update-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email,newPassword })
    });

    const data = await response.json();
    
    if (!response.ok) {
      result.innerText = data.error || "Failed to update password!";
      return;
    }

    result.style.color = "green";
    result.innerText = "Password updated successfully!";
    accountDiv.style.display = "none";

  } catch (err) {
    console.error(err);
    result.innerText = "Server error. Try again later.";
  }
});
