document.addEventListener("DOMContentLoaded", () => {
  const attendanceBody = document.getElementById("attendanceBody");

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("eventId");

  if (!eventId) {
    attendanceBody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">❌ Event ID missing in URL</td></tr>`;
    return;
  }

  document.getElementById("bookings-link").href= `../bookings/index.html?eventId=${eventId}`;
 

document.getElementById("events-link").href=`../admindash/index.html`;

  // Fetch bookings for this event
  fetch(`http://localhost:8080/cateringboys/admin/${eventId}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    })
    .then(bookings => {
      attendanceBody.innerHTML = "";

      if (bookings.length === 0) {
        attendanceBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#666;">No bookings found for this event.</td></tr>`;
        return;
      }

      bookings.forEach(booking => {
        const tr = document.createElement("tr");

        const statusText = booking.attendance?.attendanceStatus || "-";
        const attendedAtText = booking.attendance?.attendedAt || "-";

        tr.innerHTML = `
          <td>${booking.id}</td>
          <td>${booking.user.name}</td>
          <td>${booking.user.phone}</td>
          <td id="status-${booking.id}">${statusText}</td>
          <td id="attendedAt-${booking.id}">${attendedAtText}</td>
          <td>
            <button class="update-btn" onclick="enableUpdate(${booking.id}, ${eventId})">Update</button>
          </td>
        `;

        attendanceBody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Error loading bookings:", err);
      attendanceBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error loading bookings.</td></tr>`;
    });
});

// Enable update — replaces table cells with inputs
function enableUpdate(bookingId, eventId) {
  const statusCell = document.getElementById(`status-${bookingId}`);
  const attendedAtCell = document.getElementById(`attendedAt-${bookingId}`);

  const currentStatus = statusCell.textContent;
  const currentTime = attendedAtCell.textContent;

  // Replace with inputs
  statusCell.innerHTML = `
    <select id="edit-status-${bookingId}">
      <option value="">Select</option>
      <option value="PRESENT" ${currentStatus === "PRESENT" ? "selected" : ""}>PRESENT</option>
      <option value="ABSENT" ${currentStatus === "ABSENT" ? "selected" : ""}>ABSENT</option>
    </select>
  `;
  attendedAtCell.innerHTML = `<input type="time" id="edit-attendedAt-${bookingId}" value="${currentTime}">`;

  // Change Update button to Save
  const updateBtn = statusCell.parentElement.querySelector(".update-btn");
  updateBtn.textContent = "Save";
  updateBtn.onclick = () => saveUpdatedAttendance(bookingId, eventId);
}

// Save updated attendance
function saveUpdatedAttendance(bookingId, eventId) {
  const status = document.getElementById(`edit-status-${bookingId}`).value;
  const attendedAt = document.getElementById(`edit-attendedAt-${bookingId}`).value;

  if (!status || !attendedAt) {
    alert("Please fill both Attendance Status and Attended At fields.");
    return;
  }

  fetch(`http://localhost:8080/cateringboys/admin/${bookingId}?attendanceStatus=${status}&attendedAt=${attendedAt}`, {
    method: "PUT"
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to update attendance");
      return res.text();
    })
    .then(() => {
      alert("✅ Attendance updated successfully!");

      // Replace inputs back with text
      document.getElementById(`status-${bookingId}`).textContent = status;
      document.getElementById(`attendedAt-${bookingId}`).textContent = attendedAt;

      const updateBtn = document.getElementById(`status-${bookingId}`).parentElement.querySelector(".update-btn");
      updateBtn.textContent = "Update";
      updateBtn.onclick = () => enableUpdate(bookingId, eventId);
    })
    .catch(err => {
      console.error("Update failed:", err);
      alert("❌ Error updating attendance!");
    });
}


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
