import { showGenericModal, hideGenericModal } from "./generic-modal.js";

// Add Contact Modal usage
const openAddContactBtn = document.getElementById("openAddContact");
openAddContactBtn.addEventListener("click", () => {
  // Create the form dynamically so it can be reused
  const form = document.createElement("form");
  form.id = "addContactForm";
  form.className = "space-y-4";
  form.innerHTML = /*html*/ `
          <div>
            <label class="form-row-label" for="modalName">Name</label>
            <input id="modalName" name="name" type="text" class="form-row-input" placeholder="Jane Doe" required />
          </div>
          <div>
            <label class="form-row-label" for="modalEmail">Email</label>
            <input id="modalEmail" name="email" type="email" class="form-row-input" placeholder="jane@example.com" required />
          </div>
          <div>
            <label class="form-row-label" for="modalPhone">Phone</label>
            <input id="modalPhone" name="phone" type="tel" class="form-row-input" placeholder="(555) 123-4567" />
          </div>
          <div class="flex justify-end space-x-3 pt-2">
            <button type="button" id="cancelAddContact" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Contact</button>
          </div>
        `;
  // Cancel button logic
  form
    .querySelector("#cancelAddContact")
    .addEventListener("click", hideGenericModal);
  // Submit logic
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // TODO: integrate with backend create endpoint
    hideGenericModal();
  });
  showGenericModal({
    title: "Add Contact",
    description: "Create a new contact",
    content: form,
    onClose: () => form.reset(),
  });
});
