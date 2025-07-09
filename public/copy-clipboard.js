// Copy to Clipboard functionality for all code sections
(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCopyToClipboard);
    } else {
        initCopyToClipboard();
    }

    function initCopyToClipboard() {
        // Process all code blocks (pre > code)
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            addCopyButton(block.parentElement, block);
        });

        // Process inline code elements with code-block class
        const inlineCodeBlocks = document.querySelectorAll('code.code-block');
        inlineCodeBlocks.forEach(block => {
            // Only add copy button if it's not inside a pre tag
            if (block.parentElement.tagName !== 'PRE') {
                addInlineCopyButton(block);
            }
        });
    }

    function addCopyButton(preElement, codeElement) {
        // Skip if already has a copy button
        if (preElement.parentElement && preElement.parentElement.querySelector('.copy-clipboard-btn')) {
            return;
        }

        // Create wrapper div
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        
        // Wrap the pre element
        preElement.parentNode.insertBefore(wrapper, preElement);
        wrapper.appendChild(preElement);

        // Create copy button
        const copyButton = createCopyButton();
        copyButton.style.position = 'absolute';
        copyButton.style.top = '0.5rem';
        copyButton.style.right = '0.5rem';
        
        // Add click handler
        copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            copyToClipboard(codeElement.textContent.trim(), copyButton);
        });

        wrapper.appendChild(copyButton);
    }

    function addInlineCopyButton(codeElement) {
        // Skip if already has a copy button or text is too short
        if (codeElement.parentElement && codeElement.parentElement.querySelector('.copy-clipboard-btn')) {
            return;
        }

        const text = codeElement.textContent.trim();
        if (text.length < 3) {
            return; // Skip very short code snippets
        }

        // Create wrapper span
        const wrapper = document.createElement('span');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        
        // Wrap the code element
        codeElement.parentNode.insertBefore(wrapper, codeElement);
        wrapper.appendChild(codeElement);

        // Create copy button for inline code
        const copyButton = createCopyButton();
        copyButton.style.position = 'absolute';
        copyButton.style.top = '50%';
        copyButton.style.right = '-30px';
        copyButton.style.transform = 'translateY(-50%)';
        copyButton.style.padding = '0.25rem 0.5rem';
        copyButton.style.fontSize = '0.75rem';
        
        // Add click handler
        copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            copyToClipboard(text, copyButton);
        });

        wrapper.appendChild(copyButton);
    }

    function createCopyButton() {
        const button = document.createElement('button');
        button.className = 'copy-clipboard-btn';
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span style="margin-left: 0.25rem;">Copy</span>
        `;
        
        // Style the button
        button.style.cssText = `
            display: flex;
            align-items: center;
            background-color: #374151;
            color: #9ca3af;
            border: 1px solid #4b5563;
            border-radius: 0.375rem;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            font-family: 'Inter', 'Sarabun', sans-serif;
            z-index: 10;
        `;

        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#4b5563';
            button.style.color = '#e5e7eb';
            button.style.borderColor = '#6b7280';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#374151';
            button.style.color = '#9ca3af';
            button.style.borderColor = '#4b5563';
        });

        return button;
    }

    function copyToClipboard(text, button) {
        // Use modern clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showSuccess(button);
            }).catch(err => {
                console.error('Failed to copy:', err);
                fallbackCopy(text, button);
            });
        } else {
            // Fallback for older browsers
            fallbackCopy(text, button);
        }
    }

    function fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            showSuccess(button);
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showError(button);
        } finally {
            textArea.remove();
        }
    }

    function showSuccess(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span style="margin-left: 0.25rem;">Copied!</span>
        `;
        button.style.backgroundColor = '#10b981';
        button.style.color = '#ffffff';
        button.style.borderColor = '#10b981';

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.backgroundColor = '#374151';
            button.style.color = '#9ca3af';
            button.style.borderColor = '#4b5563';
        }, 2000);
    }

    function showError(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span style="margin-left: 0.25rem;">Error</span>
        `;
        button.style.backgroundColor = '#ef4444';
        button.style.color = '#ffffff';
        button.style.borderColor = '#ef4444';

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.backgroundColor = '#374151';
            button.style.color = '#9ca3af';
            button.style.borderColor = '#4b5563';
        }, 2000);
    }

    // Add CSS for better integration
    const style = document.createElement('style');
    style.textContent = `
        /* Ensure pre elements have enough padding for the button */
        pre {
            padding-top: 2.5rem !important;
            position: relative;
        }

        /* Add space for inline copy buttons */
        code.code-block {
            margin-right: 2rem !important;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
            .copy-clipboard-btn span {
                display: none;
            }
            .copy-clipboard-btn {
                padding: 0.25rem !important;
            }
            code.code-block {
                margin-right: 1.5rem !important;
            }
        }

        /* Print styles - hide copy buttons */
        @media print {
            .copy-clipboard-btn {
                display: none !important;
            }
        }

        /* Hover effects for code blocks */
        pre:hover .copy-clipboard-btn {
            opacity: 1;
        }

        .copy-clipboard-btn {
            opacity: 0.7;
            transition: opacity 0.2s ease-in-out;
        }

        .copy-clipboard-btn:hover {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
})();