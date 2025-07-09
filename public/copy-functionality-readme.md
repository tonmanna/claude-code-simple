# Copy to Clipboard Functionality

This implementation adds copy-to-clipboard functionality to all code sections across the HTML pages.

## Features

### Automatic Detection
- Automatically detects `<pre><code>` blocks for multi-line code
- Automatically detects `<code class="code-block">` for inline code snippets
- Skips very short code snippets (less than 3 characters) for inline code

### Visual Design
- Clean, unobtrusive copy buttons that match the site's dark theme
- Hover effects for better user experience
- Copy buttons have a subtle opacity that increases on hover
- Responsive design that works on mobile devices

### User Feedback
- Shows "Copied!" with checkmark icon when successful
- Shows "Error" with X icon if copying fails
- Visual feedback lasts for 2 seconds before reverting

### Browser Compatibility
- Uses modern Clipboard API when available (secure contexts)
- Falls back to `document.execCommand('copy')` for older browsers
- Works across all modern browsers including mobile

### Code Structure

#### Main Functions:
- `initCopyToClipboard()` - Main initialization function
- `addCopyButton()` - Adds copy button to code blocks
- `addInlineCopyButton()` - Adds copy button to inline code
- `createCopyButton()` - Creates styled copy button element
- `copyToClipboard()` - Handles the actual copying logic
- `fallbackCopy()` - Fallback for older browsers

#### Features:
- Prevents duplicate copy buttons
- Trims whitespace from copied text
- Handles click events properly (preventDefault, stopPropagation)
- Responsive CSS adjustments for mobile
- Print-friendly (hides copy buttons when printing)

## Usage

The script automatically initializes when the DOM is loaded. Simply include it in your HTML:

```html
<script src="copy-clipboard.js"></script>
```

## Customization

The copy buttons can be customized by modifying the CSS classes:
- `.copy-clipboard-btn` - Main button styling
- Responsive breakpoints at 640px for mobile

## Security

- Uses secure Clipboard API when available
- Graceful fallback for non-secure contexts
- No external dependencies