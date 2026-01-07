const imageUploader = document.getElementById('imageUploader');
const imagePreview = document.getElementById('imagePreview');
const placeholderText = document.getElementById('placeholderText');


const cropModal = document.getElementById('cropModal');
const imageToCrop = document.getElementById('imageToCrop');
const cropBtn = document.getElementById('cropBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

let cropper = null;
if (imageUploader && window.GIF) {
    imageUploader.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imageToCrop.src = event.target.result;
                cropModal.classList.remove('hidden');
                if (cropper) { cropper.destroy(); }       
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: 1,
                    viewMode: 0,
                    dragMode: 'move',
                    autoCropArea: 1,
                    background: false,
                });
            };
            reader.readAsDataURL(file);
        }
        this.value = ''; 
    });

    cropBtn.addEventListener('click', function() {
        if (!cropper) return;
        const canvas = cropper.getCroppedCanvas({
            width: 512,
            height: 512,
            imageSmoothingQuality: 'high'
        });
        const croppedImageSrc = canvas.toDataURL('image/png');
        closeModal();
        generateSticker(croppedImageSrc);
    });
    function closeModal() {
        cropModal.classList.add('hidden');
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }
    cancelBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
}


function generateSticker(imageSource) {

    imagePreview.classList.add('hidden');
    placeholderText.style.display = 'block';
    placeholderText.textContent = "Processing Sticker...";

    /** @type {import('gif.js')} */
    const gif = new GIF({
        workers: 2,
        quality: 5,
        width: 512,
        height: 512,
        workerScript: './gifjs/gif.worker.js'
    });

    const img = new Image();
    img.src = imageSource;

    img.onload = function() {
        gif.addFrame(img, { delay: 200 });
        gif.render();
    };

    gif.on('finished', function(blob) {
        const url = URL.createObjectURL(blob);
        imagePreview.src = url;
        imagePreview.classList.remove('hidden');
        placeholderText.style.display = 'none';
        placeholderText.textContent = "Preview will appear here";
    });
}
