(function() {
    // 1. Images Array - Ab videos bhi add kar diye
    const allImages = [
        // PHOTOS (location: 'all')
        { src: './Photos/0E7A5648.jpg', hd: './Photos/0E7A5648.jpg', title: 'Shubhendu & Poonam' , category: 'landscape', location: 'all', type: 'photo' },
        { src: './Photos/0E7A5840 (1).jpg', hd: './Photos/0E7A5840 (1).jpg', title: 'Shubhendu & Poonam', category: 'portrait', location: 'all', type: 'photo' },
        { src: './Photos/0E7A6130.jpg', hd: './Photos/0E7A6130.jpg', title: 'Shubhendu & Poonam', category: 'portrait', location: 'all', type: 'photo' },
        { src: './Photos/1742632102633 (2).jpg', hd: './Photos/1742632102633 (2).jpg', title: 'Shubham & Suvarana', category: 'urban', location: 'all', type: 'photo' },
        { src: './Photos/0E7A6136.jpg', hd: './Photos/0E7A6136.jpg', title: 'Raj & Seema', category: 'portrait', location: 'all', type: 'photo' },
        { src: './Photos/0E7A6147.jpg', hd: './Photos/0E7A6147.jpg', title: 'Shubhendu & Poonam', category: 'portrait', location: 'all', type: 'photo' },
        { src: './Photos/0E7A6238 (1).jpg', hd: './Photos/0E7A6238 (1).jpg', title: 'Shubhendu & Poonam', category: 'portrait', location: 'all', type: 'photo' },
        { src: './Photos/0E7A6399.jpg', hd: './Photos/0E7A6399.jpg', title: 'Shubhendu & Poonam', category: 'portrait', location: 'all', type: 'photo' },
        { src: './Photos/1742632100929.jpg', hd: './Photos/1742632100929.jpg', title: 'Shubhendu & Poonam', category: 'portrait', location: 'all', type: 'photo' },
        { src: './Photos/1742632101710 (1).jpg', hd: './Photos/1742632101710 (1).jpg', title: 'Shubhendu & Poonam', category: 'portrait', location: 'all', type: 'photo' },
        { src: './Photos/1742632102236.jpg', hd: './Photos/1742632102236.jpg', title: 'Shubhendu & Poonam', category: 'portrait', location: 'all', type: 'photo' },
        { src: './Photos/1742632102633 (2)jpg', hd: './Photos/1742632102633 (2).jpg', title: 'Shubhendu & Poonam', category: 'portrait', location: 'all', type: 'photo' },
        // VIDEOS (location: 'videos')
        { src: './Videos/IMG_202510151213220.MP4', hd: './Videos/IMG_202510151213220.MP4', title: 'Wedding Highlights', category: 'video', location: 'videos', type: 'video' },
        { src: './Videos/IMG_202510151219310.MP4', hd: './Videos/IMG_202510151219310.MP4', title: 'Wedding Teaser', category: 'video', location: 'videos', type: 'video' },
        { src: './Videos/IMG_2403.MP4', hd: './Videos/IMG_2403.MP4', title: 'Pre-wedding Shoot', category: 'Wedding Reel', location: 'videos', type: 'video' },
    ];

    const grid = document.getElementById('portfolioGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const filterItems = document.querySelectorAll('.filter-item');
    
    let currentFilter = 'all';
    let currentIndex = 0;
    const imagesPerLoad = 3;

    function renderGallery(reset = false) {
        if (reset) {
            grid.innerHTML = '';
            currentIndex = 0;
            loadMoreBtn.classList.remove('hidden');
        }

        const filteredImages = allImages.filter(img => img.location === currentFilter);
        
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

    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            filterItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderGallery(true); 
        });
    });

    renderGallery();
    loadMoreBtn.addEventListener('click', () => renderGallery());

    // LIGHTBOX - UPDATED FOR BIG VIDEOS
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVid = document.getElementById('lightboxVid');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeLightbox = document.getElementById('closeLightbox');

    // CSS inline add karo lightbox ke liye
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
                    
                    // Video source set karo
                    const source = lightboxVid.querySelector('source');
                    if (source) {
                        source.src = videoUrl;
                    } else {
                        // Agar source nahi hai to naya banao
                        const newSource = document.createElement('source');
                        newSource.src = videoUrl;
                        newSource.type = 'video/mp4';
                        lightboxVid.innerHTML = '';
                        lightboxVid.appendChild(newSource);
                    }
                    
                    lightboxVid.load();
                    lightboxVid.play().catch(e => console.log('Auto-play failed:', e));
                    
                    if(lightboxCaption) lightboxCaption.textContent = title;
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
                    if(lightboxCaption) lightboxCaption.textContent = title;
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
