// Initialize the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// DOM Elements
const pdfInput = document.getElementById('pdfInput');
const dropZone = document.getElementById('dropZone');
const fileInfo = document.getElementById('fileInfo');
const convertBtn = document.getElementById('convertBtn');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const progressStatus = document.getElementById('progress-status');
const preview = document.getElementById('preview');
const previewContainer = document.getElementById('preview-container');
const downloadBtn = document.getElementById('downloadBtn');
const imageQuality = document.getElementById('imageQuality');
const imageScale = document.getElementById('imageScale');

// Variables to store current state
let selectedFile = null;
let convertedPages = [];
let zip = null;

// Event Listeners
pdfInput.addEventListener('change', handleFileSelect);
convertBtn.addEventListener('click', convertPDF);
downloadBtn.addEventListener('click', downloadZip);

// Setup drag and drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('highlight');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('highlight');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('highlight');
    
    if (e.dataTransfer.files.length > 0 && e.dataTransfer.files[0].type === 'application/pdf') {
        pdfInput.files = e.dataTransfer.files;
        handleFileSelect();
    } else {
        alert('Please drop a valid PDF file');
    }
});

dropZone.addEventListener('click', () => {
    pdfInput.click();
});

// Function to handle file selection
function handleFileSelect() {
    if (pdfInput.files.length > 0) {
        selectedFile = pdfInput.files[0];
        fileInfo.textContent = `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`;
        convertBtn.disabled = false;
    } else {
        fileInfo.textContent = 'No file selected';
        convertBtn.disabled = true;
    }
}

// Function to format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Function to convert PDF to JPG
async function convertPDF() {
    if (!selectedFile) {
        alert('Please select a PDF file');
        return;
    }
    
    // Reset and prepare UI
    convertedPages = [];
    previewContainer.innerHTML = '';
    preview.classList.add('hidden');
    progressContainer.classList.remove('hidden');
    progressFill.style.width = '0%';
    progressStatus.textContent = '0%';
    convertBtn.disabled = true;
    
    // Create a new zip file
    zip = new JSZip();
    
    try {
        // Read the file
        const arrayBuffer = await readFileAsArrayBuffer(selectedFile);
        const pdfData = new Uint8Array(arrayBuffer);
        
        // Load the PDF
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const totalPages = pdf.numPages;
        
        // Get selected options
        const quality = parseFloat(imageQuality.value);
        const scale = parseFloat(imageScale.value);
        
        // Convert each page
        for (let i = 1; i <= totalPages; i++) {
            updateProgress(Math.floor((i - 1) / totalPages * 100));
            
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({ canvasContext: context, viewport }).promise;
            
            // Convert canvas to blob
            const blob = await canvasToBlob(canvas, quality);
            const imageUrl = URL.createObjectURL(blob);
            
            // Add to converted pages array
            convertedPages.push({
                pageNumber: i,
                blob,
                url: imageUrl
            });
            
            // Add to zip file
            zip.file(`page_${i.toString().padStart(3, '0')}.jpg`, blob);
            
            // Create preview
            createPreviewItem(imageUrl, i, totalPages);
            
            updateProgress(Math.floor(i / totalPages * 100));
        }
        
        // Show preview section
        preview.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error converting PDF:', error);
        alert('An error occurred while converting the PDF. Please try again.');
    } finally {
        progressContainer.classList.add('hidden');
        convertBtn.disabled = false;
    }
}

// Function to read file as ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Function to convert canvas to blob
function canvasToBlob(canvas, quality = 0.7) {
    return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality);
    });
}

// Function to update progress
function updateProgress(percentage) {
    progressFill.style.width = `${percentage}%`;
    progressStatus.textContent = `${percentage}%`;
}

// Function to create preview item
function createPreviewItem(imageUrl, pageNumber, totalPages) {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `Page ${pageNumber}`;
    img.loading = 'lazy';
    
    const previewInfo = document.createElement('div');
    previewInfo.className = 'preview-info';
    previewInfo.textContent = `Page ${pageNumber} of ${totalPages}`;
    
    previewItem.appendChild(img);
    previewItem.appendChild(previewInfo);
    previewContainer.appendChild(previewItem);
}

// Function to download zip file
function downloadZip() {
    if (!zip || convertedPages.length === 0) {
        alert('No converted images available');
        return;
    }
    
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Preparing Download...';
    
    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = getZipFilename();
        link.click();
        
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download All Images as ZIP';
    }).catch(error => {
        console.error('Error generating ZIP:', error);
        alert('An error occurred while creating the ZIP file.');
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download All Images as ZIP';
    });
}

// Function to generate a filename for the ZIP
function getZipFilename() {
    if (!selectedFile) return 'converted_images.zip';
    
    // Get original filename without extension
    const originalName = selectedFile.name.replace(/\.pdf$/i, '');
    return `${originalName}_images.zip`;
}