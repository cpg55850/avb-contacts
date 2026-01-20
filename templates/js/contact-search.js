// Contact search functionality

export function initContactSearch() {
  const searchInput = document.getElementById("contactSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    filterContacts(searchTerm);
  });
}

function filterContacts(searchTerm) {
  const contactItems = document.querySelectorAll(".contact-item");

  contactItems.forEach((item) => {
    const contactName = item.dataset.contactName?.toLowerCase() || "";

    if (contactName.includes(searchTerm)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });

  // Show a "no results" message if needed
  const visibleContacts = Array.from(contactItems).filter(
    (item) => item.style.display !== "none",
  );

  // Remove existing "no results" message
  const existingMessage = document.getElementById("noSearchResults");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Add "no results" message if no contacts visible and search term exists
  if (visibleContacts.length === 0 && searchTerm) {
    const contactsList = document.getElementById("contactsList");
    const noResultsMsg = document.createElement("div");
    noResultsMsg.id = "noSearchResults";
    noResultsMsg.className = "text-center py-8 text-muted-foreground";
    noResultsMsg.innerHTML = `
      <i class="fa fa-search text-3xl mb-2"></i>
      <p>No contacts found for "${searchTerm}"</p>
    `;
    contactsList.appendChild(noResultsMsg);
  }
}

// Re-initialize search after contacts list is refreshed
export function resetSearch() {
  const searchInput = document.getElementById("contactSearch");
  if (searchInput && searchInput.value) {
    filterContacts(searchInput.value.toLowerCase().trim());
  }
}
