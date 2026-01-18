// Add Contact Modal usage (with ModalManager and event delegation)
const openAddContactBtn = document.getElementById("openAddContact");
openAddContactBtn.addEventListener("click", () => {
  console.log("Hi");
  window.app.push("AddContact");
  // Attach submit handler for the form
  setTimeout(() => {
    const modal = document.querySelector(".modal-content.add-contact");
    if (!modal) return;
    const form = modal.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // TODO: integrate with backend create endpoint
      window.app.pop();
    });
  }, 0);
});
