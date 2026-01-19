// Detail fetch on contact click
export function attachContactClickHandlers() {
  document.querySelectorAll(".contact-item").forEach((item) => {
    item.addEventListener("click", async function () {
      const contactId = this.dataset.contactId;
      try {
        const response = await fetch(`/api/contacts/${contactId}`);
        const contact = await response.json();
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
        document.getElementById("contactDetails").classList.remove("hidden");
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    });
  });
}
