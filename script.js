(function () {
    // Global variables
    let allImages = [];
    const grid = document.getElementById('portfolioGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const filterItems = document.querySelectorAll('.filter-item');

    let currentFilter = 'all';
    let currentIndex = 0;
    const imagesPerLoad = 3;

    // ------------------- JSON DATA LOAD KARO -------------------
    async function loadImageData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();

            // Photos add karo
            data.photos.forEach(photo => {
    allImages.push({
        src: photo.src, // Seedha JSON se src uthayega
        hd: photo.src,  // HD ke liye bhi wahi link
        title: photo.title,
        category: photo.category,
        location: 'all',
        type: 'photo'
    });
});

            // Videos add karo
            data.videos.forEach(video => {
                if (video.isExternal) {
                    // External video (like Vimeo)
                    allImages.push({
                        src: video.src,
                        hd: video.src,
                        title: video.title,
                        category: video.category,
                        location: 'videos',
                        type: 'video'
                    });
                } else {
                    // Local video
                    allImages.push({
                        src: data.folders.videos + video.filename,
                        hd: data.folders.videos + video.filename,
                        title: video.title,
                        category: video.category,
                        location: 'videos',
                        type: 'video'
                    });
                }
            });

            console.log('Total items loaded:', allImages.length);

            // Data load hone ke baad gallery render karo
            renderGallery();

        } catch (error) {
            console.error('Error loading data.json:', error);
            // Fallback data agar json load na ho
            allImages = [
                { src: 'https://images.pexels.com/photos/2874901/pexels-photo-2874901.jpeg?auto=compress&cs=tinysrgb&w=600', hd: 'https://images.pexels.com/photos/2874901/pexels-photo-2874901.jpeg?auto=compress&cs=tinysrgb&w=1260', title: 'Coastal Silence', category: 'landscape', location: 'all', type: 'photo' },
            ];
            renderGallery();
        }
    }

    // ------------------- RENDER GALLERY -------------------
    function renderGallery(reset = false) {
        if (reset) {
            grid.innerHTML = '';
            currentIndex = 0;
            loadMoreBtn.classList.remove('hidden');
        }

        const filteredImages = currentFilter === 'all'
            ? allImages.filter(img => img.type === 'photo')
            : allImages.filter(img => img.type === 'video');

        // Agar filtered images empty hain to kuch mat dikhao
        if (filteredImages.length === 0) {
            grid.innerHTML = '<div style="text-align: center; padding: 50px; color: #777;">No items to display</div>';
            loadMoreBtn.classList.add('hidden');
            return;
        }

        let htmlStr = '';
        const limit = Math.min(currentIndex + imagesPerLoad, filteredImages.length);

        for (let i = currentIndex; i < limit; i++) {
            const item = filteredImages[i];

            if (item.type === 'video') {
                htmlStr += `
                        <div class="grid-item video-card" data-video="${item.hd}" data-title="${item.title}" data-type="video">
                            <video src="${item.src}" muted loop playsinline></video>
                            <div class="overlay">
                                <h3>${item.title}</h3>
                                <p>VIDEO</p>
                            </div>
                            <div class="video-icon"><i class="fas fa-play"></i></div>
                        </div>`;
            } else {
                htmlStr += `
                        <div class="grid-item" data-hd="${item.hd}" data-title="${item.title}" data-type="photo">
                            <img src="${item.src}" alt="${item.title}" loading="lazy">
                            <div class="overlay">
                                <h3>${item.title}</h3>
                                <p>PHOTO</p>
                            </div>
                        </div>`;
            }
        }

        grid.innerHTML += htmlStr;
        currentIndex = limit;

        if (currentIndex >= filteredImages.length) {
            loadMoreBtn.classList.add('hidden');
        }
    }

    // ------------------- FILTER CLICK HANDLER -------------------
    filterItems.forEach(item => {
        item.addEventListener('click', function () {
            filterItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderGallery(true);
        });
    });

    // ------------------- LOAD MORE BUTTON -------------------
    loadMoreBtn.addEventListener('click', () => renderGallery());

    // ------------------- LIGHTBOX CODE -------------------
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVid = document.getElementById('lightboxVid');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeLightbox = document.getElementById('closeLightbox');

    // Lightbox styles
    if (lightboxModal) {
        lightboxModal.style.cssText = `
                display: none;
                position: fixed;
                z-index: 10000;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.98);
                justify-content: center;
                align-items: center;
            `;
    }

    if (lightboxVid) {
        lightboxVid.style.cssText = `
                width: 90vw;
                height: 90vh;
                object-fit: contain;
                background: #000;
            `;
    }

    if (lightboxImg) {
        lightboxImg.style.cssText = `
                max-width: 90vw;
                max-height: 90vh;
                object-fit: contain;
            `;
    }

    // Grid click handler for lightbox
    if (grid) {
        grid.addEventListener('click', (e) => {
            const item = e.target.closest('.grid-item');
            if (!item) return;

            const type = item.getAttribute('data-type');
            const title = item.getAttribute('data-title') || 'untitled';

            if (type === 'video') {
                const videoUrl = item.getAttribute('data-video');
                if (videoUrl && lightboxModal) {
                    lightboxImg.style.display = 'none';
                    lightboxVid.style.display = 'block';

                    const source = lightboxVid.querySelector('source');
                    if (source) {
                        source.src = videoUrl;
                    } else {
                        const newSource = document.createElement('source');
                        newSource.src = videoUrl;
                        newSource.type = 'video/mp4';
                        lightboxVid.innerHTML = '';
                        lightboxVid.appendChild(newSource);
                    }

                    lightboxVid.load();
                    lightboxVid.play().catch(e => console.log('Auto-play failed:', e));

                    if (lightboxCaption) lightboxCaption.textContent = title;
                    lightboxModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            } else {
                const hdUrl = item.getAttribute('data-hd');
                if (hdUrl && lightboxModal) {
                    lightboxVid.style.display = 'none';
                    lightboxVid.pause();
                    lightboxImg.style.display = 'block';
                    lightboxImg.src = hdUrl;
                    if (lightboxCaption) lightboxCaption.textContent = title;
                    lightboxModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    }

    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = '';
            lightboxVid.pause();
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.style.display = 'none';
                document.body.style.overflow = '';
                lightboxVid.pause();
            }
        });
    }

    // ------------------- START THE APP -------------------
    // Data load karo
    loadImageData();

})();

// MOBILE MENU TOGGLE
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });
}
