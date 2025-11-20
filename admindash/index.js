let data=JSON.parse(localStorage.getItem("loggedInUser"));
let adminId=data.id;
let adminName=data.name;
let adminEmail=data.email;

console.log(adminName);
console.log(adminEmail)


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("event-container");
  const modal = document.getElementById("eventModal");
  const addEventBtn = document.getElementById("addEventBtn");
  const closeModal = document.getElementById("closeModal");
  const form = document.getElementById("eventForm");
  const modalTitle = document.getElementById("modalTitle");
  const marquee = document.getElementById("marquee");

  let editMode = false;

  // const adminEmail = localStorage.getItem("adminEmail");
  // const adminName = localStorage.getItem("adminName") || "Admin";

  marquee.innerHTML = `🎉 ${adminName}! Manage your catering events easily 🎉`;

  async function fetchEvents() {
    if (!adminEmail) {
      container.innerHTML = "<p>No admin info found. Please login again.</p>";
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/cateringboys/admin/events?email=${encodeURIComponent(adminEmail)}`
      );
      if (!response.ok) throw new Error("Failed to fetch events");
      const events = await response.json();
      console.log(events)
      container.innerHTML = events.length
        ? ""
        : "<p>No events found. Add your first one!</p>";

      events.forEach(ev => createEventCard(ev));
    } catch (err) {
      console.error(err);
      container.innerHTML = "<p>⚠️ Failed to load events. Try again later.</p>";
    }
  }

  function createEventCard(ev) {
    const card = document.createElement("div");
     const bookedCount=ev.bookings.length;
    card.classList.add("event-card");
    card.innerHTML = `
      <div class="event-details">
        <h3>${ev.title}</h3>
        <p><strong>Venue:</strong> ${ev.venue}</p>
        <p><strong>Description:</strong> ${ev.description}</p>
        <p><strong>Date:</strong> ${ev.date}</p>
        <p><strong>Time:</strong> ${ev.time}</p>
        <p><strong>Required Boys:</strong> ${ev.requiredboys}</p>
        <p><strong>Booked:</strong> ${bookedCount}</p>
        <p><strong>Booking Status:</strong> ${ev.status}</p>
        <p><strong>Amount per Boy:</strong> ₹${ev.amountPerBoy}</p>
      </div>
      <div class="btn-container">
        <button class="update-btn">Update</button>
        <button class="bookings-btn">Bookings</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Update event
    card.querySelector(".update-btn").addEventListener("click", () => {
      editMode = true;
      modalTitle.textContent = "Update Event";
      modal.style.display = "flex";

      document.getElementById("eventId").value = ev.id;
      form.title.value = ev.title;
      form.venue.value = ev.venue;
      form.description.value = ev.description;
      form.date.value = ev.date;
      form.time.value = ev.time;
      form.requiredboys.value = ev.requiredboys;
      form.amountPerBoy.value = ev.amountPerBoy;
    });

    // Bookings
    card.querySelector(".bookings-btn").addEventListener("click", () => {
      window.location.href = `../bookings/index.html?eventId=${ev.id}`;
    });

    // Delete event
    card.querySelector(".delete-btn").addEventListener("click", async () => {
      if (confirm(`Delete "${ev.title}"?`)) {
        try {
          await fetch(`http://localhost:8080/cateringboys/admin/${ev.id}?email=${encodeURIComponent(adminEmail)}`, { method: "DELETE" });
          alert("Event deleted successfully!");
          fetchEvents();
        } catch {
          alert("Error deleting event. Try again.");
        }
      }
    });

    container.appendChild(card);
  }

  // Add event
  addEventBtn.addEventListener("click", () => {
    editMode = false;
    modalTitle.textContent = "Add New Event";
    form.reset();
    modal.style.display = "flex";
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Save event
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const eventData = {
      title: form.title.value,
      venue: form.venue.value,
      description: form.description.value,
      date: form.date.value,
      time: form.time.value,
      requiredboys: parseInt(form.requiredboys.value),
      amountPerBoy: parseFloat(form.amountPerBoy.value),
      createdByEmail: adminEmail,
    };

    try {
      let response;
      if (editMode) {
        const id = form.eventId.value;
        response = await fetch(`http://localhost:8080/cateringboys/admin/update/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
        if (!response.ok) throw new Error("Update failed");
        alert("✅ Event successfully updated!");
      } else {
        response = await fetch(`http://localhost:8080/cateringboys/admin?email=${encodeURIComponent(adminEmail)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
        if (!response.ok) throw new Error("Creation failed");
        alert("🎉 Event added successfully!");
      }
      modal.style.display = "none";
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to save event. Try again.");
    }
  });

  // Initial load
  fetchEvents();
});

document.getElementById("contact-link").addEventListener("click",()=>{
   window.location.href="../contactus/index.html";
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

