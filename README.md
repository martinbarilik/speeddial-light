# SpeedDial Light

A lightweight vibe coded Chrome extension that replaces your new tab page with a customizable speed dial for your favorite websites. 

## Features

- Clean dark theme with minimalist design
- Context menu controls for link management
- Responsive design for all screen sizes
- Import and export functionality for link backup
- Persistent storage using Chrome's local storage API
- Lightweight implementation with minimal resource usage
- Website favicon and custom icon support

## Installation

**Note: This extension is not available on the Chrome Web Store and must be installed manually using Developer Mode.**

### Manual Installation (Developer Mode)
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the project folder
5. The extension will now replace your new tab page

### Prerequisites
- Chrome browser with Developer Mode enabled
- Downloaded or cloned project files
- `icon16.png` file in the project directory (required for the extension to work properly)

## Usage

### Adding Links
- Right-click on empty space → "Add Link"
- Fill in the title, URL, and optional icon URL
- Click "Save Link"

### Managing Links
- **Edit**: Right-click on any link → "Edit Link"
- **Delete**: Right-click on any link → "Delete Link"
- **Navigate**: Click any link to open the website

### Backup & Restore
- **Export**: Right-click on empty space → "Export Links" (downloads JSON file)
- **Import**: Right-click on empty space → "Import Links" → Select JSON backup file
- Choose to replace existing links or merge with current ones

## File Structure

```
speeddial-light/
├── manifest.json          # Extension configuration
├── newtab.html            # Main new tab page
├── newtab.js              # Core functionality
├── styles.css             # Styling and responsive design
├── icon16.png             # Extension icon (16x16)
├── icon48.png             # Extension icon (48x48)
├── icon128.png            # Extension icon (128x128)
└── README.md              # This file
```

## Technical Details

### Built With
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS custom properties
- **Vanilla JavaScript** - No dependencies
- **Chrome Extension API** - Local storage integration

### Browser Compatibility
- Chrome 88+
- Chromium-based browsers (Edge, Brave, etc.)

### Storage Format
Links are stored as JSON in Chrome's local storage:
```json
{
  "version": "1.0",
  "exportDate": "2025-01-18T12:00:00.000Z",
  "appName": "SpeedDial Light",
  "links": [
    {
      "title": "Example Site",
      "url": "https://example.com",
      "icon": "https://example.com/favicon.ico"
    }
  ]
}
```

## Customization

### Default Links
Edit the `setDefaultLinks()` function in `newtab.js` to customize the initial links.

### Styling
Modify CSS custom properties in `styles.css`:
```css
:root {
    --bg-primary: #000;        /* Background color */
    --text-primary: #fff;      /* Text color */
    --icon-size: 200px;        /* Icon dimensions */
    /* ... more variables */
}
```

### Grid Layout
Responsive breakpoints:
- Mobile: 1 column
- Tablet (768px+): 2 columns  
- Desktop (1024px+): 3 columns
- Large (1400px+): 4 columns

## Development

### Prerequisites
- Chrome browser
- Text editor
- Basic knowledge of HTML/CSS/JavaScript

### Local Development
1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh button on the SpeedDial Light extension
4. Open a new tab to see changes

### Building Icons
Create PNG icons in the following sizes:
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels  
- `icon128.png` - 128x128 pixels

## License

This project is open source. Feel free to modify and distribute.

## Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
