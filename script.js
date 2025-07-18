const imageInput = document.getElementById('imageInput');
const resizeBtn = document.getElementById('resizeBtn');
const outputDiv = document.getElementById('output');
const downloadContainer = document.getElementById('download-container');
const dropZone = document.getElementById('dropZone');

const SIZES = [16, 32, 48, 128];

// Drag and drop functionality
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        imageInput.files = files;
        processImage(files[0]);
    }
});

// File input change handler
imageInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        processImage(e.target.files[0]);
    }
});

// Process image function with improved quality
function processImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            outputDiv.style.display = 'block';
            downloadContainer.innerHTML = ''; // Clear previous results

            SIZES.forEach(size => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = size;
                canvas.height = size;

                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Calculate scaling to maintain aspect ratio
                const scale = Math.min(size / img.width, size / img.height);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const offsetX = (size - scaledWidth) / 2;
                const offsetY = (size - scaledHeight) / 2;

                // Fill with transparent background
                ctx.clearRect(0, 0, size, size);
                
                // Draw the image with proper scaling
                ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

                const dataURL = canvas.toDataURL('image/png');

                const link = document.createElement('a');
                link.href = dataURL;
                link.download = `icon${size}.png`;
                link.textContent = `Download ${size}x${size}`;

                const imageElement = document.createElement('img');
                imageElement.src = dataURL;

                const downloadWrapper = document.createElement('div');
                downloadWrapper.classList.add('download-item');
                downloadWrapper.appendChild(imageElement);
                downloadWrapper.appendChild(link);

                downloadContainer.appendChild(downloadWrapper);
            });
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

resizeBtn.addEventListener('click', () => {
    if (imageInput.files && imageInput.files[0]) {
        processImage(imageInput.files[0]);
    }
});
