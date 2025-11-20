let data=JSON.parse(localStorage.getItem("loggedInUser"));
let userId=data.id;
let userName=data.name;
let userEmail=data.email;

document.addEventListener("DOMContentLoaded", () => {
  const eventsContainer = document.getElementById("events-container");
  
  // Fetch events created by admin
  fetch(`http://localhost:8080/cateringboys/user/${userId}`) // Replace with your backend URL
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    })
    .then(bookings => {
      if (bookings.length === 0) {
        eventsContainer.innerHTML = "<p>No events available.</p>";
        return;
      }
     console.log(bookings);
      eventsContainer.innerHTML = "";
      bookings.forEach(bookings => {
  

        const div = document.createElement("div");
        div.classList.add("event-card");
        div.innerHTML = `
          <h3>${bookings.event.title}</h3>
          <p><strong>Venue:</strong> ${bookings.event.venue}</p>
          <p><strong>Description:</strong> ${bookings.event.description}</p>
          <p><strong>Event Date:</strong> ${bookings.event.date.split("-").reverse().join("-")}</p>
          <p><strong>Event Time:</strong> ${bookings.event.time}</p>
          <p><strong>Amount Per Boy:</strong> ₹${bookings.event.amountPerBoy}</p>
           <p><strong>Booking:</strong> ${bookings.event.status}</p>
          <p><strong>Organizer Name:</strong> ${bookings.event.createdBy.name}</p>
          <p><strong>Organizer Phone:</strong> ${bookings.event.createdBy.phone}</p>
          <div class="buttons">
            <button class="cancel-btn" onclick="cancelBooking(${bookings.id})">Cancel</button>
          </div>
        `;
        eventsContainer.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error loading events:", err);
      eventsContainer.innerHTML = "<p style='color:red;'>Error loading events.</p>";
    });
});

document.getElementById("contact-link").addEventListener("click",()=>{
   window.location.href="../contactus/index.html";
})


// Function to cancel booking
function cancelBooking(bookingId) {
  fetch(`http://localhost:8080/cateringboys/user/${bookingId}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Failed to cancel booking");
      return res.text();
    })
    .then(data => {
      alert("✅ Booking canceled successfully!");
      window.location.reload(); // refresh to update UI
    })
    .catch(err => {
      console.error("Cancel failed:", err);
      alert("❌ Error canceling booking!");
    });
}

document.getElementById("events-link").addEventListener("click",()=>{
   
     window.location.href="../userdash/index.html";
})

// Navbar mobile controls
const menuIcon = document.getElementById("menu-icon");
const navLinks = document.getElementById("nav-links");
const closeBtn = document.getElementById("close-btn");

menuIcon.addEventListener("click", () => navLinks.classList.add("active"));
closeBtn.addEventListener("click", () => navLinks.classList.remove("active"));

// Logout
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../home/index.html";
});
