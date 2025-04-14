# LocalStorage Manager Chrome Extension

A Chrome extension that allows you to export and import localStorage data for websites. This tool is particularly useful for developers and users who need to backup or transfer their website data.

## Features

- Export localStorage data from any website
- Import previously exported data
- Simple and intuitive user interface
- Secure data handling

## Installation

### From Chrome Web Store

1. Visit the Chrome Web Store
2. Search for "LocalStorage Manager"
3. Click "Add to Chrome"
4. Confirm the installation

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
2. Navigate to the website whose localStorage data you want to manage
3. Use the popup interface to:
   - Export current localStorage data
   - Import previously saved data
   - Clear localStorage data

## Uploading to Chrome Web Store

### Prerequisites

- A Google Developer account ($5 one-time fee)
- A ZIP file of your extension
- Screenshots of your extension in action
- Privacy policy (if applicable)

### Steps to Publish

1. **Prepare Your Extension**
   - Ensure all files are properly organized
   - Verify the manifest.json is correct
   - Test the extension thoroughly

2. **Create a ZIP File**
   - Select all extension files
   - Create a ZIP archive
   - Name it appropriately (e.g., `localstorage-manager-v1.0.zip`)

3. **Upload to Chrome Web Store**
   - Go to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Click "New Item"
   - Upload your ZIP file
   - Fill in the required information:
     - Detailed description
     - Category
     - Screenshots
     - Privacy policy (if applicable)
   - Submit for review

4. **Review Process**
   - Wait for Google's review (typically 1-7 days)
   - Address any issues if they arise
   - Once approved, your extension will be published

## Development

### Project Structure

- `manifest.json` - Extension configuration
- `popup.html` - Main extension interface
- `popup.js` - Extension logic
- `content.js` - Content script
- `styles.css` - Styling
- `icons/` - Extension icons

### Building

No build process required. The extension can be loaded directly from the source files.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository.
