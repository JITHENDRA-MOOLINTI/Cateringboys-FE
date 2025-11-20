
document.addEventListener("DOMContentLoaded", () => {
  const bookingBody = document.getElementById("bookingBody");
  const adminEmail = localStorage.getItem("adminEmail");

  const params=new URLSearchParams(window.location.search);
  const eventId=params.get("eventId");
  
document.getElementById("events-link").href=`../admindash/index.html`;

document.querySelector("#attendance").addEventListener("click",(e)=>{
      e.preventDefault();
      window.location.href=`../attendance/index.html?eventId=${eventId}`;
})
  // ✅ Fetch Bookings
  async function fetchBookings() {
    try {
      const response = await fetch(`https://cateringboys-be.onrender.com/cateringboys/admin/${eventId}`);
      if (!response.ok) throw new Error("Failed to load bookings");
      const bookings = await response.json();
      
      bookingBody.innerHTML = "";
    
      if (bookings.length === 0) {
        bookingBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align:center; color:#666;">No bookings available.</td>
          </tr>
        `;
        return;
      }
      console.log(bookings);
      bookings.forEach(b => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${b.id}</td>
          <td>${b.user.name}</td>
          <td>${b.user.email}</td>
          <td>${b.user.phone}</td>
          <td>${b.bookedAt.split("T")[0]}</td>
         
        `;
        bookingBody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
      bookingBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; color:red;">Error loading bookings. Try again later.</td>
        </tr>
      `;
    }
  }

  fetchBookings();

  // ✅ Navbar toggle
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");
  const closeBtn = document.getElementById("close-btn");

  menuIcon.addEventListener("click", () => navLinks.classList.add("active"));
  closeBtn.addEventListener("click", () => navLinks.classList.remove("active"));

  // ✅ Logout
  document.querySelector(".logout-btn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../login/index.html";
  });
});

document.getElementById("contact-link").addEventListener("click",()=>{
   window.location.href="../contactus/index.html";
})



