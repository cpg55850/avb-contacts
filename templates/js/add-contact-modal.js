import { refreshContactsList } from "./refresh-contacts-list.js";
import { createModal } from "./modal-builder.js";
import { ContactFormBuilder } from "./contact-form-builder.js";
import toast from "./toast.js";

export function pushAddContactModal() {
  const modal = createModal({
    title: "Add Contact",
    content: `
      <form id="addContactForm">
        <div id="formFields"></div>
        <div class="flex gap-2 mt-4 justify-end">
          <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
          <button type="submit" class="btn btn-primary submit-btn">Add Contact</button>
        </div>
      </form>
    `,
    buttons: ``,
  });

  // Initialize form builder
  const formContainer = modal.querySelector("#formFields");
  const formBuilder = new ContactFormBuilder(formContainer);
  formBuilder.createForm(); // Empty form for new contact

  // Attach cancel handler
  modal.querySelector(".cancel-btn").addEventListener("click", () => {
    window.app.pop();
  });

  // Attach submit handler
  const form = modal.querySelector("#addContactForm");
  const submitBtn = modal.querySelector(".submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!formBuilder.validate()) {
      return;
    }

    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';

    const payload = formBuilder.getFormData();

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        window.app.pop();
        await refreshContactsList();
        toast.success("Contact added successfully!");

        // Auto-select the newly created contact
        const newContactId = data.id;
        if (newContactId) {
          const newContactItem = document.querySelector(
            `.contact-item[data-contact-id="${newContactId}"]`,
          );
          if (newContactItem) {
            newContactItem.click();
          }
        }
      } else {
        toast.error(data.error || "Failed to add contact.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
    }
  });

  window.app.push(modal);
}

// Attach to button
document.getElementById("openAddContact")?.addEventListener("click", () => {
  pushAddContactModal();
});
