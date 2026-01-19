import { refreshContactsList } from "./refresh-contacts-list.js";

// Add Contact Modal usage (with ModalManager and event delegation)
const openAddContactBtn = document.getElementById("openAddContact");
openAddContactBtn.addEventListener("click", () => {
  window.app.push("AddContact");
  // Attach submit handler for the form
  setTimeout(() => {
    const modal = document.querySelector(".modal-content.add-contact");
    if (!modal) return;
    const form = modal.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';
      const name = form.querySelector("#modalName").value.trim();
      const phone = form.querySelector("#modalPhone").value.trim();
      const email = form.querySelector("#modalEmail").value.trim();
      // You can extend this to support multiple emails if needed
      const payload = {
        name,
        phone,
        emails: [email],
      };
      try {
        const res = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          window.app.pop();
          // Optionally refresh contact list or show success
          await refreshContactsList();
        } else {
          alert(data.error || "Failed to add contact.");
        }
      } catch (err) {
        alert("Network error.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
      }
    });
  }, 0);
});
