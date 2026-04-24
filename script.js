/* ── Loader ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  
  // SQA Fix: Added a 2.5-second delay to ensure the GIF animation 
  // completes its full cycle before the page fades in.
  setTimeout(() => {
    if (loader) {
      loader.classList.add('fade-out');
      // Optional: Re-enable scrolling on the body once loaded
      document.body.style.overflow = 'auto';
    }
  }, 2500); 
});
 
/* ── Custom Cursor ── */
// We use 'window.' to check if it's already there to prevent the crash
if (typeof cursorEl === 'undefined') {
    window.cursorEl = document.getElementById('cursor');
}
if (typeof cursorRing === 'undefined') {
    window.cursorRing = document.getElementById('cursor-ring');
}

// Ensure these variables aren't redeclared if the script runs twice
if (typeof mx === 'undefined') {
    window.mx = -100; window.my = -100; window.rx = -100; window.ry = -100;
}

document.addEventListener('mousemove', e => { 
    window.mx = e.clientX; 
    window.my = e.clientY; 
});

(function animCursor() {
    window.rx += (window.mx - window.rx) * 0.15; 
    window.ry += (window.my - window.ry) * 0.15;
    
    if (window.cursorEl) {
        window.cursorEl.style.left = window.mx + 'px'; 
        window.cursorEl.style.top = window.my + 'px';
    }
    if (window.cursorRing) {
        window.cursorRing.style.left = window.rx + 'px'; 
        window.cursorRing.style.top = window.ry + 'px';
    }
    requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a,button,.project-card,.skill-tag,.contact-link,.process-step').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── Scroll progress ── */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const totalScroll = document.body.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
        const scrolled = window.scrollY / totalScroll;
        if (progressBar) progressBar.style.width = (scrolled * 100) + '%';
    }
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── Mobile nav ── */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileClose = document.getElementById('mobile-close');

    // Menu Open karne ke liye
    hamburger.addEventListener('click', () => {
        mobileNav.classList.add('open');
    });

    // Menu Close karne ke liye
    mobileClose.addEventListener('click', (e) => {
        e.stopPropagation(); // Click event ko piche jane se rokta hai
        mobileNav.classList.remove('open');
    });

    // Links par click karne se menu band ho jaye
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    });
});

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ── Three.js Hero Canvas ── */
(function initThree() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;

    function resize() {
        const w = canvas.parentElement.offsetWidth;
        const h = canvas.parentElement.offsetHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // Floating torus knot
    const geo1 = new THREE.TorusKnotGeometry(1.2, 0.35, 160, 30);
    const mat1 = new THREE.MeshPhongMaterial({
        color: 0xC08552, transparent: true, opacity: 0.12,
        wireframe: true
    });
    const torusKnot = new THREE.Mesh(geo1, mat1);
    torusKnot.position.set(3, 0.2, -1);
    scene.add(torusKnot);

    // Second torus
    const geo2 = new THREE.TorusGeometry(1.8, 0.06, 16, 100);
    const mat2 = new THREE.MeshPhongMaterial({ color: 0x8C5A3C, transparent: true, opacity: 0.08, wireframe: true });
    const torus2 = new THREE.Mesh(geo2, mat2);
    torus2.position.set(4, -1, -2);
    scene.add(torus2);

    // Icosahedron
    const geo3 = new THREE.IcosahedronGeometry(0.6, 1);
    const mat3 = new THREE.MeshPhongMaterial({ color: 0x4B2E2B, transparent: true, opacity: 0.09, wireframe: true });
    const ico = new THREE.Mesh(geo3, mat3);
    ico.position.set(-0.5, 2.5, -1);
    scene.add(ico);

    // Extra floating shapes
    const extraObjects = [];
    const colors = [0xC08552, 0x8C5A3C, 0xE8C49A, 0x4B2E2B];
    const geos = [
        new THREE.TorusKnotGeometry(0.6, 0.18, 80, 12),
        new THREE.IcosahedronGeometry(0.7, 0),
        new THREE.OctahedronGeometry(0.65, 0),
        new THREE.TorusGeometry(0.6, 0.2, 16, 40),
    ];

    geos.forEach((geo, i) => {
        const mat = new THREE.MeshPhongMaterial({
            color: colors[i],
            wireframe: i % 2 === 0,
            transparent: true,
            opacity: i % 2 === 0 ? 0.25 : 0.15,
            shininess: 80,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const angle = (i / geos.length) * Math.PI * 2;
        mesh.position.set(Math.cos(angle) * 3, Math.sin(angle) * 2, Math.sin(angle) * 1.5);
        scene.add(mesh);
        extraObjects.push({ mesh, speed: 0.003 + Math.random() * 0.004, offset: i * 1.5 });
    });

    // Particles (Moved INSIDE initThree so 'scene' is defined)
    const partCount = 220;
    const positions = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i++) positions[i] = (Math.random() - 0.5) * 16;
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({ color: 0xC08552, size: 0.04, transparent: true, opacity: 0.45 });
    scene.add(new THREE.Points(partGeo, partMat));

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(3, 3, 3);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    let mx3 = 0, my3 = 0;
    document.addEventListener('mousemove', e => {
        mx3 = (e.clientX / window.innerWidth - 0.5) * 2;
        my3 = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let t = 0;
    (function animate() {
        requestAnimationFrame(animate);
        t += 0.008;
        torusKnot.rotation.x = t * 0.4;
        torusKnot.rotation.y = t * 0.6 + mx3 * 0.3;
        torus2.rotation.x = t * 0.25;
        torus2.rotation.z = t * 0.18 + my3 * 0.2;
        ico.rotation.x = t * 0.5;
        ico.rotation.y = t * 0.3;
        extraObjects.forEach(({ mesh, speed, offset }) => {
            mesh.rotation.x += speed;
            mesh.rotation.y += speed * 1.3;
            mesh.position.y += Math.sin(t + offset) * 0.003;
        });
        camera.position.x += (mx3 * 0.5 - camera.position.x) * 0.04;
        camera.position.y += (-my3 * 0.3 - camera.position.y) * 0.04;
        renderer.render(scene, camera);
    })();
})();

/* ── Projects Modal ── */
const modalData = {
    '1': { /* ... */ },
    '2': { /* ... */ },
    '3': { /* ... */ },
    '4': { /* ... */ }
}; // <-- Ensure this closing brace and semicolon are present

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const id = card.dataset.modal;
        const d = modalData[id];
        if (!d) return;
        document.getElementById('modal-badge').textContent = d.badge;
        document.getElementById('modal-title').textContent = d.title;
        document.getElementById('modal-desc').textContent = d.desc;
        document.getElementById('modal-testing').innerHTML = d.testing.map(t => `<span class="modal-tag">${t}</span>`).join('');
        document.getElementById('modal-tools').innerHTML = d.tools.map(t => `<span class="modal-tag">${t}</span>`).join('');
        document.getElementById('modal-overlay').classList.add('open');
    });
});

const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

if (modalClose) modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });
}

/* ── Contact form to WhatsApp ── */
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Get the values from the form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // 2. Your WhatsApp Number (Format: CountryCode + Number)
        // Example: 923001234567 (No +, no spaces)
        const phoneNumber = "923218557535"; 

        // 3. Create the message template
        const whatsappMessage = `*New Portfolio Inquiry*%0A%0A` + 
                                `*Name:* ${name}%0A` + 
                                `*Email:* ${email}%0A` + 
                                `*Subject:* ${subject}%0A` + 
                                `*Message:* ${message}`;

        // 4. Update Button UI
        const btn = e.target.querySelector('.form-submit');
        btn.textContent = 'Opening WhatsApp...';
        btn.disabled = true;

        // 5. Open WhatsApp
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
        window.open(whatsappURL, '_blank');

        // 6. Reset Form UI
        setTimeout(() => {
            document.getElementById('form-msg').classList.add('show');
            btn.textContent = 'Message Sent ✓';
            e.target.reset();
            btn.disabled = false;
        }, 1200);
    });
}



/* ── Parallax tilt ── */
document.querySelectorAll('.skill-category,.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        card.style.transform = `translateY(-6px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
});
// Mobile links par click karne se menu band karne ke liye
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        const mobileNav = document.getElementById('mobile-nav');
        mobileNav.classList.remove('open'); // Aapki 'open' class ka naam yahan ayega
    });
});
