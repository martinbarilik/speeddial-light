// Global variables
let links = [];
let editingIndex = -1;
let currentContextIndex = -1;

// DOM elements
let linksContainer,
  modal,
  closeModalBtn,
  linkForm,
  contextMenu,
  addLinkMenu,
  editLinkMenu,
  deleteLinkMenu,
  exportLinksMenu,
  importLinksMenu,
  importModal,
  importCloseBtn,
  importForm,
  contextMenuSeparator;

// Load links from storage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM elements
  linksContainer = document.getElementById("links-container");
  modal = document.getElementById("modal");
  closeModalBtn = document.querySelector(".close-btn");
  linkForm = document.getElementById("link-form");
  contextMenu = document.getElementById("context-menu");
  addLinkMenu = document.getElementById("add-link-menu");
  editLinkMenu = document.getElementById("edit-link-menu");
  deleteLinkMenu = document.getElementById("delete-link-menu");
  exportLinksMenu = document.getElementById("export-links-menu");
  importLinksMenu = document.getElementById("import-links-menu");
  importModal = document.getElementById("import-modal");
  importCloseBtn = document.getElementById("import-close-btn");
  importForm = document.getElementById("import-form");
  contextMenuSeparator = document.getElementById("context-menu-separator");

  loadLinks();

  // Event listeners
  closeModalBtn.addEventListener("click", closeModals);
  importCloseBtn.addEventListener("click", closeModals);
  document.addEventListener("click", (e) => {
    if (e.target === modal || e.target === importModal) {
      closeModals();
    }
    // Hide context menu when clicking elsewhere (but not on context menu items)
    if (!contextMenu.contains(e.target) && !e.target.closest(".context-menu")) {
      hideContextMenu();
    }
  });

  // Right-click on empty space to show "Add Link" option
  document.addEventListener("contextmenu", (e) => {
    // Only show context menu if right-clicking on empty space (not on link items)
    if (
      (e.target === document.body ||
        e.target.classList.contains("container") ||
        e.target.classList.contains("links-container")) &&
      !e.target.closest(".link-item")
    ) {
      e.preventDefault();

      showContextMenu(e.pageX, e.pageY, -1); // -1 indicates empty space
    }
  });

  // Context menu event listeners
  addLinkMenu.addEventListener("click", (e) => {
    e.stopPropagation();

    showAddModal();
    hideContextMenu();
  });

  editLinkMenu.addEventListener("click", (e) => {
    e.stopPropagation();

    if (currentContextIndex >= 0) {
      editLink(currentContextIndex);
    }
    hideContextMenu();
  });

  deleteLinkMenu.addEventListener("click", (e) => {
    e.stopPropagation();

    if (currentContextIndex >= 0) {
      deleteLink(currentContextIndex);
    }
    hideContextMenu();
  });

  exportLinksMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    exportLinks();
    hideContextMenu();
  });

  importLinksMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    showImportModal();
    hideContextMenu();
  });

  // Import form submission
  importForm.addEventListener("submit", (e) => {
    e.preventDefault();
    importLinks();
  });

  // Handle link form submission
  linkForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const action = document.getElementById("form-action").value;
    const title = document.getElementById("link-title").value;
    const url = document.getElementById("link-url").value;
    const icon =
      document.getElementById("link-icon").value ||
      "https://www.google.com/favicon.ico";

    if (action === "add") {
      links.push({ title, url, icon });
    } else {
      links[editingIndex] = { title, url, icon };
    }

    saveLinks();
    closeModals();
  });
});

// Load links from Chrome storage
function loadLinks() {
  chrome.storage.local.get(["speedDialLinks"], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error loading links:", chrome.runtime.lastError);
      setDefaultLinks();
      return;
    }

    if (result.speedDialLinks && Array.isArray(result.speedDialLinks)) {
      links = result.speedDialLinks;
    } else {
      setDefaultLinks();
    }
    renderLinks();
  });
}

// Set default links
function setDefaultLinks() {
  links = [
    {
      title: "Start9",
      url: "https://start9.com/",
      icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fd1muf25xaso8hp.cloudfront.net%2Fhttps%3A%2F%2Fff111e9e11da6c3e7a1ecd5bd3c1cfd7.cdn.bubble.io%2Ff1694720316281x874650874892558300%2Ficon_pwa.png%3Fw%3D%26h%3D%26auto%3Dcompress%26dpr%3D1%26fit%3Dmax&f=1&nofb=1&ipt=c5806ba55952171b40359df04cda836eecb6ff83f0a30e6d19d324d5975ef8fc",
    },
    {
      title: "LibreTranslate",
      url: "https://libretranslate.com/",
      icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcommunity.libretranslate.com%2Fuploads%2Fdefault%2Foriginal%2F1X%2Fcba1464ba45e470db4ec853535218539cf5d4777.png&f=1&nofb=1&ipt=74b6c2a21dfd7af16c8c957d3ebd02c978b4d1e9a158858652c5021d2772ae23&ipo=images",
    },
    {
      title: "Nostr",
      url: "https://nostr.com/",
      icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fuser-images.githubusercontent.com%2F99301796%2F219741736-3ce00069-9c6a-47f2-9c8b-108f3f40295b.png&f=1&nofb=1&ipt=b56a8ea1fa90e01dfd92717f77c5b5790e03963ee7e3b39caf4d88b3c942ee71",
    },
    {
      title: "Mempool",
      url: "https://mempool.space/",
      icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fhomarr-labs%2Fdashboard-icons%2Fwebp%2Fmempool.webp&f=1&nofb=1&ipt=896e4e40ee3d0fc61c001097c2c08e923a76ec2562ffefb469dfcbe620e6c519",
    },
  ];
  saveLinks();
}

// Save links to Chrome storage
function saveLinks() {
  chrome.storage.local.set({ speedDialLinks: links }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving links:", chrome.runtime.lastError);
      return;
    }
    renderLinks();
  });
}

// Render all links
function renderLinks() {
  linksContainer.innerHTML = "";

  links.forEach((link, index) => {
    const linkElement = document.createElement("div");
    linkElement.className = "link-item";
    linkElement.innerHTML = `
            <img src="${link.icon}" alt="${link.title}" class="link-icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzMzMyIvPgo8cGF0aCBkPSJNMjQgMjRINTZWNTZIMjRWMjRaIiBzdHJva2U9IiNGRkYiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMzIgMzJINDhWNDhIMzJWMzJaIiBmaWxsPSIjRkZGIi8+Cjwvc3ZnPgo='">
        `;

    // Add click event to open the link
    linkElement.addEventListener("click", (e) => {
      window.location.href = link.url;
    });

    // Add right-click context menu
    linkElement.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenu(e.pageX, e.pageY, index);
    });

    linksContainer.appendChild(linkElement);
  });
}

// Show modal for adding a new link
function showAddModal() {
  editingIndex = -1;
  document.getElementById("modal-title").textContent = "Add New Link";
  document.getElementById("link-form").reset();
  document.getElementById("form-action").value = "add";
  modal.style.display = "flex";
}

// Show modal for editing an existing link
function editLink(index) {
  editingIndex = index;
  const link = links[index];
  document.getElementById("modal-title").textContent = "Edit Link";
  document.getElementById("link-title").value = link.title;
  document.getElementById("link-url").value = link.url;
  document.getElementById("link-icon").value = link.icon;
  document.getElementById("form-action").value = "edit";
  modal.style.display = "flex";
}

// Delete a link
function deleteLink(index) {
  if (confirm("Are you sure you want to delete this link?")) {
    links.splice(index, 1);
    saveLinks();
  }
}

// Close all modals
function closeModals() {
  modal.style.display = "none";
  importModal.style.display = "none";
}

// Show context menu
function showContextMenu(x, y, linkIndex) {
  currentContextIndex = linkIndex;

  //reset all menus
  addLinkMenu.style = "";
  editLinkMenu.style = "";
  deleteLinkMenu.style = "";
  exportLinksMenu.style = "";
  importLinksMenu.style = "";
  contextMenuSeparator.style = "";

  // Show/hide menu items based on context
  if (linkIndex === -1) {
    // Right-clicked on empty space - show Add Link and import/export
    addLinkMenu.style.display = "flex";
    editLinkMenu.style.display = "none";
    deleteLinkMenu.style.display = "none";
    exportLinksMenu.style.display = "flex";
    importLinksMenu.style.display = "flex";
    contextMenuSeparator.style.display = "none";
  } else {
    // Right-clicked on a link - show all options except import/export
    addLinkMenu.style.display = "flex";
    editLinkMenu.style.display = "flex";
    deleteLinkMenu.style.display = "flex";
    exportLinksMenu.style.display = "none";
    importLinksMenu.style.display = "none";
  }

  // Position the context menu
  contextMenu.style.left = x + "px";
  contextMenu.style.top = y + "px";
  contextMenu.style.display = "block";

  // Prevent the menu from going off-screen
  const menuRect = contextMenu.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (menuRect.right > windowWidth) {
    contextMenu.style.left = x - menuRect.width + "px";
  }
  if (menuRect.bottom > windowHeight) {
    contextMenu.style.top = y - menuRect.height + "px";
  }
}

// Hide context menu
function hideContextMenu() {
  contextMenu.style.display = "none";
  currentContextIndex = -1;
}

// Export links to JSON file
function exportLinks() {
  const exportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    appName: "SpeedDial Light",
    links: links,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `speeddial-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}

// Show import modal
function showImportModal() {
  importForm.reset();
  importModal.style.display = "flex";
}

// Import links from JSON file
function importLinks() {
  const fileInput = document.getElementById("import-file");
  const replaceExisting = document.getElementById("replace-existing").checked;

  if (!fileInput.files[0]) {
    alert("Please select a file to import.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importData = JSON.parse(e.target.result);

      // Validate the imported data
      if (!importData.links || !Array.isArray(importData.links)) {
        throw new Error("Invalid file format: links array not found");
      }

      // Validate each link has required properties
      for (let link of importData.links) {
        if (!link.title || !link.url) {
          throw new Error("Invalid file format: links must have title and url");
        }
        // Ensure icon exists, use default if not
        if (!link.icon) {
          link.icon = "https://www.google.com/favicon.ico";
        }
      }

      if (replaceExisting) {
        links = importData.links;
      } else {
        // Merge with existing links, avoiding duplicates
        for (let newLink of importData.links) {
          const existingLink = links.find(
            (link) => link.url === newLink.url || link.title === newLink.title
          );
          if (!existingLink) {
            links.push(newLink);
          }
        }
      }

      saveLinks();
      closeModals();
      alert(`Successfully imported ${importData.links.length} links!`);
    } catch (error) {
      alert("Error importing file: " + error.message);
    }
  };

  reader.readAsText(file);
}
