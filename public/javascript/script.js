// button effect if screen size decreases
function checkScreenWidth() {
  const screenWidth = window.innerWidth;
  const addBtn = document.getElementById("add-btn");

  if (screenWidth < 850) {
    addBtn.classList.remove("fas", "fa-check-circle", "tick");
    addBtn.textContent = "ADD";
  } else {
    addBtn.classList.add("fas", "fa-check-circle", "tick");
    addBtn.textContent = "";
  }
}

window.addEventListener("resize", checkScreenWidth);

// account deletion
async function confirmDeleteAccount() {
  const password = prompt("Enter your password to delete the account:");

  if (password) {
    try {
      const response = await fetch("/profile/deleteaccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        window.location.href = "/";
      } else {
        alert("Password incorrect. Account not deleted.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while trying to delete the account.");
    }
  } else {
    alert("Password is required to delete the account.");
  }
}

// This script will automatically log the guest out after 10 minutes
window.onload = function () {
  const guestMode = document.body.getAttribute("data-guest-mode") === "true";

  if (guestMode) {
    setTimeout(function () {
      alert("Your session as a guest has expired. You will now be logged out.");
      window.location.href = "/";
    }, 10 * 60 * 1000);
  }
};
