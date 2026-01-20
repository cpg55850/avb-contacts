// Detail fetch on contact click
import toast from "./toast.js";

export function attachContactClickHandlers() {
  document.querySelectorAll(".contact-item").forEach((item) => {
    item.addEventListener("click", async function () {
      const contactId = this.dataset.contactId;
      try {
        const response = await fetch(`/api/contacts/${contactId}`);
        const contact = await response.json();

        // Store contact ID in the details section
        const detailsSection = document.getElementById("contactDetails");
        const welcomeSection = document.getElementById("welcomeSection");
        detailsSection.dataset.contactId = contact.id;

        // Update display fields
        document.getElementById("detailName").textContent = contact.name;
        document.getElementById("detailPhone").textContent =
          contact.phone || "N/A";
        const emailsDiv = document.getElementById("detailEmails");
        emailsDiv.innerHTML = "";
        contact.emails.forEach((email) => {
          const emailEl = document.createElement("p");
          emailEl.className = "text-foreground";
          emailEl.textContent = email.email || email;
          emailsDiv.appendChild(emailEl);
        });
        const createdDate = new Date(contact.created_at).toLocaleDateString();
        document.getElementById("detailCreated").textContent = createdDate;

        // Store contact data for editing
        detailsSection.dataset.contactData = JSON.stringify(contact);

        // Ensure we're in display mode (not edit mode)
        if (window.exitEditMode) {
          window.exitEditMode();
        }

        detailsSection.classList.remove("hidden");
        welcomeSection.classList.add("hidden");
      } catch (error) {
        console.error("Error fetching contact:", error);
        toast.error("Failed to load contact details. Please try again.");
      }
    });
  });
}
