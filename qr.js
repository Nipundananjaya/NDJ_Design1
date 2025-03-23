document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const textInput = document.getElementById('text-input');
    const sizeSelect = document.getElementById('size-select');
    const generateButton = document.getElementById('generate-button');
    const downloadButton = document.getElementById('download-button');
    const qrcodeDiv = document.getElementById('qrcode');
    
    // Add these lines to HTML for color pickers
    const colorOptions = document.createElement('div');
    colorOptions.innerHTML = `
        <div class="option-group">
            <label>QR Code Color:</label>
            <input type="color" id="foreground-color" value="#000000">
        </div>
        <div class="option-group">
            <label>Background Color:</label>
            <input type="color" id="background-color" value="#ffffff">
        </div>
    `;
    document.querySelector('.options-section').appendChild(colorOptions);
    
    const foregroundColor = document.getElementById('foreground-color');
    const backgroundColor = document.getElementById('background-color');
    
    // QR Code object
    let qrcode = null;
    
    // Generate QR code
    generateButton.addEventListener('click', function() {
        const text = textInput.value.trim();
        const size = parseInt(sizeSelect.value);
        const foreColor = foregroundColor.value;
        const backColor = backgroundColor.value;
        
        if (!text) {
            alert('Please enter text or URL first');
            return;
        }
        
        // Clear previous QR code
        qrcodeDiv.innerHTML = '';
        
        // Generate new QR code
        qrcode = new QRCode(qrcodeDiv, {
            text: text,
            width: size,
            height: size,
            colorDark: foreColor,
            colorLight: backColor,
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Show download button
        downloadButton.style.display = 'block';
    });
    
    // Download QR code as image
    downloadButton.addEventListener('click', function() {
        if (!qrcode) return;
        
        // Get the QR code image
        const img = qrcodeDiv.querySelector('img');
        if (!img) return;
        
        // Create a canvas to modify the image (in case we need to add padding or effects)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size with some padding
        const padding = 20;
        canvas.width = img.width + (padding * 2);
        canvas.height = img.height + (padding * 2);
        
        // Fill background
        ctx.fillStyle = backgroundColor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the QR code in the center
        ctx.drawImage(img, padding, padding, img.width, img.height);
        
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'qrcode.png';
        
        // Simulate click to trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Enable generate on Enter key
    textInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            generateButton.click();
        }
    });
});