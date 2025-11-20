let data=JSON.parse(localStorage.getItem("loggedInUser"));
let userId=data.id;
let userName=data.name;



  marquee.innerHTML = `🎉 Welcome ${userName}! Be a Part of Catering🎉`;

document.addEventListener("DOMContentLoaded", () => {
  const eventsContainer = document.getElementById("events-container");
  
  // Fetch events created by admin
  fetch(`http://localhost:8080/cateringboys/user/events/${userId}`) // Replace with your backend URL
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    })
    .then(events => {
      if (events.length === 0) {
        eventsContainer.innerHTML = "<p>No events available.</p>";
        return;
      }
     console.log(events);
      eventsContainer.innerHTML = "";
      events.forEach(event => {
        const bookedCount = event.bookings ? event.bookings.length : 0;

        const div = document.createElement("div");
        div.classList.add("event-card");
        div.innerHTML = `
          <h3>${event.title}</h3>
          <p><strong>Venue:</strong> ${event.venue}</p>
          <p><strong>Description:</strong> ${event.description}</p>
          <p><strong>Event Date:</strong> ${event.date.split("-").reverse().join("-")}</p>
          <p><strong>Event Time:</strong> ${event.time}</p>
          <p><strong>Amount Per Boy:</strong> ₹${event.amountPerBoy}</p>
           <p><strong>Booking:</strong> ${event.status}</p>
          <p><strong>Booked:</strong> <span id="booked-${event.id}">${bookedCount}</span></p>
          <p><strong>Organizer Name:</strong> ${event.createdBy.name}</p>
          <p><strong>Organizer Phone:</strong> ${event.createdBy.phone}</p>
          <div class="buttons">
            <button onclick="bookEvent(${event.id})">Book</button>
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

// Function to book an event
function bookEvent(eventId) {
  fetch(`http://localhost:8080/cateringboys/user/${eventId}/${userId}`, { method: "POST" })
    .then(async res => {
      // Parse JSON even if response is not OK
      const data = await res.json();

      if (!res.ok) {
        // ✅ Display backend message if available
        const msg = data.message || "❌ Booking failed!";
        alert(msg);
        throw new Error(msg); // Stop further execution
      }

      return data; // Booking successful
    })
    .then(data => {
      alert("✅ Event booked successfully!");

      // 1️⃣ Increase booked count
      const bookedSpan = document.getElementById(`booked-${eventId}`);
      bookedSpan.textContent = parseInt(bookedSpan.textContent) + 1;

      // 2️⃣ Remove the booked event from available events
      const eventCard = bookedSpan.closest(".event-card");
      if (eventCard) eventCard.remove();
    })
    .catch(err => {
      console.error("Booking failed:", err);
      // Optional: already alerted backend message above
    });
}



document.getElementById("bookings-link").addEventListener("click",()=>{
  window.location.href="../booked/index.html";
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

document.getElementById("contact-link").addEventListener("click",()=>{
   window.location.href="../contactus/index.html";
})
