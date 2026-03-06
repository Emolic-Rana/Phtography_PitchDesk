(function () {
    let allImages = [];
    const grid = document.getElementById('portfolioGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const filterItems = document.querySelectorAll('.filter-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVid = document.getElementById('lightboxVid');

    // Shuruat PHOTOS se hogi
    let currentFilter = 'photos'; 
    let currentIndex = 0;
    const imagesPerLoad = 3;

    async function loadImageData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            allImages = []; 
            if (data.photos) data.photos.forEach(p => allImages.push({ ...p, type: 'photo' }));
            if (data.videos) data.videos.forEach(v => allImages.push({ ...v, type: 'video' }));
            
            renderGallery(true);
        } catch (e) { console.error("JSON Error:", e); }
    }

    function renderGallery(reset = false) {
        if (reset) {
            grid.innerHTML = '';
            currentIndex = 0;
            loadMoreBtn.classList.remove('hidden');
        }

        // --- FILTER LOGIC: Sirf wahi dikhao jo manga hai ---
        const filtered = allImages.filter(item => {
            if (currentFilter === 'photos') return item.type === 'photo';
            if (currentFilter === 'videos') return item.type === 'video';
            return false;
        });

        let htmlStr = '';
        const limit = Math.min(currentIndex + imagesPerLoad, filtered.length);

        for (let i = currentIndex; i < limit; i++) {
            const item = filtered[i];
            const isVid = item.type === 'video';
            
            htmlStr += `
                <div class="grid-item ${isVid ? 'video-card' : ''}" 
                     data-type="${item.type}" 
                     data-url="${isVid ? item.video_url : item.src}" 
                     data-title="${item.title}">
                    <img src="${item.src}" alt="${item.title}" loading="lazy">
                    <div class="overlay">
                        <h3>${item.title}</h3>
                        <p>${isVid ? 'VIDEO' : 'PHOTO'}</p>
                    </div>
                    ${isVid ? '<div class="video-icon"><i class="fas fa-play"></i></div>' : ''}
                </div>`;
        }

        grid.innerHTML += htmlStr;
        currentIndex = limit;
        if (currentIndex >= filtered.length) loadMoreBtn.classList.add('hidden');
    }

    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.grid-item');
        if (!item) return;

        const type = item.getAttribute('data-type');
        const url = item.getAttribute('data-url');
        const title = item.getAttribute('data-title');

        if (type === 'video') {
            const videoId = url.split('id=')[1].split('&')[0]; 
            const previewUrl = `https://drive.google.com/file/d/${videoId}/preview`;
            
            lightboxImg.style.display = 'none';
            lightboxVid.style.display = 'block';
            lightboxVid.innerHTML = `<iframe src="${previewUrl}" style="width:100%; height:80vh; border:none;" allow="autoplay"></iframe>`;
        } else {
            lightboxVid.style.display = 'none';
            lightboxVid.innerHTML = '';
            lightboxImg.style.display = 'block';
            lightboxImg.src = url;
        }

        lightboxModal.style.display = 'flex';
        document.getElementById('lightboxCaption').textContent = title;
        document.body.style.overflow = 'hidden';
    });

    document.getElementById('closeLightbox').addEventListener('click', () => {
        lightboxModal.style.display = 'none';
        lightboxVid.innerHTML = '';
        document.body.style.overflow = 'auto';
    });

    filterItems.forEach(btn => {
        btn.addEventListener('click', function() {
            filterItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderGallery(true);
        });
    });

    loadMoreBtn.addEventListener('click', () => renderGallery());
    loadImageData();
})();
