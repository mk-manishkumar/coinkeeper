// to clear everything in dB

document.getElementById("clear-all").addEventListener("click", async () => {
  try {
    const response = await fetch("/clear-all", {
      method: "POST",
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.error("Failed to clear database");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// delete expense by ID
async function handleDelete(event) {
  try {
    const listItem = event.target.closest("li");
    const expenseId = listItem.getAttribute("data-id");

    const response = await fetch(`/delete/${expenseId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      listItem.remove();
    } else {
      console.error("Failed to delete expense");
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
}

// Adding click event listener to delete icons
const deleteIcons = document.querySelectorAll("#delete-icon");
deleteIcons.forEach((icon) => {
  icon.addEventListener("click", handleDelete);
});

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

// handling error message
// window.addEventListener("load", () => {
//   const url = new URL(window.location.href);
//   if (url.searchParams.has("errorMessage")) {
//     url.searchParams.delete("errorMessage");
//     window.history.replaceState({}, document.title, url.toString());
//   }
// });
