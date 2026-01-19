// Inline editing for contact details

let isEditMode = false;

// Enter edit mode - show input fields and hide display text
function enterEditMode() {
  if (isEditMode) return;

  const detailsSection = document.getElementById("contactDetails");
  const contactData = JSON.parse(detailsSection.dataset.contactData || "{}");

  // Hide display elements
  document.getElementById("detailName").classList.add("hidden");
  document.getElementById("detailPhone").classList.add("hidden");
  document.getElementById("detailEmails").classList.add("hidden");

  // Show and populate input fields
  const nameInput = document.getElementById("editName");
  nameInput.classList.remove("hidden");
  nameInput.value = contactData.name || "";

  const phoneInput = document.getElementById("editPhone");
  phoneInput.classList.remove("hidden");
  phoneInput.value = contactData.phone || "";

  // Handle emails
  const editEmailsDiv = document.getElementById("editEmails");
  editEmailsDiv.classList.remove("hidden");
  editEmailsDiv.innerHTML = "";

  if (contactData.emails && contactData.emails.length > 0) {
    contactData.emails.forEach((email, index) => {
      const emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.className =
        "w-full px-3 py-2 border border-border rounded-md bg-background text-foreground";
      emailInput.value = email;
      emailInput.dataset.emailIndex = index;
      editEmailsDiv.appendChild(emailInput);
    });
  } else {
    // Add one empty email field if no emails exist
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.className =
      "w-full px-3 py-2 border border-border rounded-md bg-background text-foreground";
    emailInput.placeholder = "Email address";
    editEmailsDiv.appendChild(emailInput);
  }

  // Switch button visibility
  document.getElementById("editButtons").classList.add("hidden");
  document.getElementById("saveButtons").classList.remove("hidden");

  isEditMode = true;
}

// Exit edit mode - show display text and hide input fields
function exitEditMode() {
  if (!isEditMode) return;

  // Hide input fields
  document.getElementById("editName").classList.add("hidden");
  document.getElementById("editPhone").classList.add("hidden");
  document.getElementById("editEmails").classList.add("hidden");

  // Show display elements
  document.getElementById("detailName").classList.remove("hidden");
  document.getElementById("detailPhone").classList.remove("hidden");
  document.getElementById("detailEmails").classList.remove("hidden");

  // Switch button visibility
  document.getElementById("saveButtons").classList.add("hidden");
  document.getElementById("editButtons").classList.remove("hidden");

  isEditMode = false;
}

// Save changes to backend
async function saveChanges() {
  const detailsSection = document.getElementById("contactDetails");
  const contactId = detailsSection.dataset.contactId;

  if (!contactId) {
    console.error("No contact ID found");
    return;
  }

  // Gather updated values
  const name = document.getElementById("editName").value.trim();
  const phone = document.getElementById("editPhone").value.trim();

  // Gather emails
  const emailInputs = document.querySelectorAll("#editEmails input");
  const emails = Array.from(emailInputs)
    .map((input) => input.value.trim())
    .filter((email) => email !== "");

  if (!name) {
    alert("Name is required");
    return;
  }

  if (emails.length === 0) {
    alert("At least one email is required");
    return;
  }

  // Prepare update data
  const updateData = {
    name: name,
    phone: phone || null,
    emails: emails,
  };

  try {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || "Failed to update contact");
      return;
    }

    const updatedContact = await response.json();

    // Update display fields
    document.getElementById("detailName").textContent = updatedContact.name;
    document.getElementById("detailPhone").textContent =
      updatedContact.phone || "N/A";

    const emailsDiv = document.getElementById("detailEmails");
    emailsDiv.innerHTML = "";
    updatedContact.emails.forEach((email) => {
      const emailEl = document.createElement("p");
      emailEl.className = "text-foreground";
      emailEl.textContent = email;
      emailsDiv.appendChild(emailEl);
    });

    // Update stored contact data
    detailsSection.dataset.contactData = JSON.stringify(updatedContact);

    // Update the contact list item
    const contactListItem = document.querySelector(
      `.contact-item[data-contact-id="${contactId}"]`,
    );
    if (contactListItem) {
      contactListItem.dataset.contactName = updatedContact.name;
      const nameDiv = contactListItem.querySelector(".font-medium");
      if (nameDiv) {
        nameDiv.textContent = updatedContact.name;
      }
      const avatarSpan = contactListItem.querySelector(".rounded-full span");
      if (avatarSpan) {
        avatarSpan.textContent = updatedContact.name[0]?.toUpperCase() || "?";
      }
    }

    // Exit edit mode
    exitEditMode();
  } catch (error) {
    console.error("Error updating contact:", error);
    alert("Failed to update contact. Please try again.");
  }
}

// Expose exitEditMode globally so contact-click.js can access it
window.exitEditMode = exitEditMode;

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editContactBtn");
  const saveBtn = document.getElementById("saveContactBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");

  if (editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      enterEditMode();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      saveChanges();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      exitEditMode();
    });
  }
});
