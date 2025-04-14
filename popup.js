// Function to execute script in the active tab
async function executeScript(func, ...args) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: func,
    args: args,
  })

  return result[0].result
}

// Get localStorage data from the current page
async function getLocalStorage() {
  return executeScript(() => {
    const items = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      items[key] = localStorage.getItem(key)
    }
    return {
      items: items,
      count: localStorage.length,
      size: new Blob(Object.values(items)).size,
    }
  })
}

// Set localStorage data on the current page
async function setLocalStorage(data) {
  return executeScript((data) => {
    try {
      for (const [key, value] of Object.entries(data)) {
        localStorage.setItem(key, value)
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, data)
}

// Clear localStorage on the current page
async function clearLocalStorage() {
  return executeScript(() => {
    try {
      localStorage.clear()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}

// Format bytes to human-readable format
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Update the UI with localStorage data
async function updateUI() {
  try {
    // Get current tab info
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const url = new URL(tab.url)
    document.getElementById("current-site").textContent = url.hostname

    // Get localStorage data
    const storageData = await getLocalStorage()

    // Update storage stats
    document.getElementById("storage-stats").textContent =
      `${storageData.count} items (${formatBytes(storageData.size)})`

    // Update storage items list
    const storageItemsEl = document.getElementById("storage-items")

    if (storageData.count === 0) {
      storageItemsEl.innerHTML = '<div class="storage-item">No items in localStorage</div>'
      return
    }

    let html = ""
    for (const [key, value] of Object.entries(storageData.items)) {
      html += `
        <div class="storage-item">
          <div class="storage-key">${key}</div>
          <div class="storage-value">${value.length > 100 ? value.substring(0, 100) + "..." : value}</div>
        </div>
      `
    }

    storageItemsEl.innerHTML = html
  } catch (error) {
    console.error("Error updating UI:", error)
    document.getElementById("current-site").textContent = "Error accessing page"
    document.getElementById("storage-stats").textContent = "N/A"
    document.getElementById("storage-items").innerHTML = `<div class="storage-item">Error: ${error.message}</div>`
  }
}

// Export localStorage data to a JSON file
async function exportLocalStorage() {
  try {
    const storageData = await getLocalStorage()

    // Create a JSON blob
    const blob = new Blob([JSON.stringify(storageData.items, null, 2)], { type: "application/json" })

    // Get current tab info for filename
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const url = new URL(tab.url)
    const filename = `localStorage_${url.hostname}_${new Date().toISOString().slice(0, 10)}.json`

    // Download the file
    chrome.downloads.download({
      url: URL.createObjectURL(blob),
      filename: filename,
      saveAs: true,
    })
  } catch (error) {
    console.error("Error exporting localStorage:", error)
    alert("Error exporting localStorage: " + error.message)
  }
}

// Import localStorage data from a JSON file
async function importLocalStorage(file) {
  try {
    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result)

        if (typeof data !== "object" || data === null) {
          throw new Error("Invalid JSON format")
        }

        const result = await setLocalStorage(data)

        if (result.success) {
          alert("LocalStorage data imported successfully!")
          updateUI()
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error("Error parsing JSON:", error)
        alert("Error importing localStorage: " + error.message)
      }
    }

    reader.readAsText(file)
  } catch (error) {
    console.error("Error importing localStorage:", error)
    alert("Error importing localStorage: " + error.message)
  }
}

// Initialize the popup
document.addEventListener("DOMContentLoaded", () => {
  // Update UI when popup opens
  updateUI()

  // Export button
  document.getElementById("export-btn").addEventListener("click", exportLocalStorage)

  // Import file input
  document.getElementById("import-file").addEventListener("change", (event) => {
    if (event.target.files.length > 0) {
      importLocalStorage(event.target.files[0])
    }
  })

  // Clear button
  document.getElementById("clear-btn").addEventListener("click", async () => {
    if (confirm("Are you sure you want to clear all localStorage data for this site?")) {
      const result = await clearLocalStorage()

      if (result.success) {
        alert("LocalStorage cleared successfully!")
        updateUI()
      } else {
        alert("Error clearing localStorage: " + result.error)
      }
    }
  })
})
