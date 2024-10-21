const { createApp, ref, onMounted, watch, onBeforeUnmount } = Vue;
createApp({
    setup() {
        // Reactive Variables
        const menuOpen = ref(false);
        const navItems = ref([
            { name: 'Home', path: '#home', icon: 'fas fa-home' },
            { name: "Men's Collection", path: '#mens-collection', icon: 'fas fa-male' },
            { name: "Women's Collection", path: '#womens-collection', icon: 'fas fa-female' },
            { name: "Kids' Collection", path: '#kids-collection', icon: 'fas fa-child' },
            { name: 'New Arrivals', path: '#new-arrivals', icon: 'fas fa-tags' },
            { name: 'Sale', path: '#sale', icon: 'fas fa-percent' },
            { name: 'Contact Us', path: '#contact', icon: 'fas fa-envelope' },
        ]);

        const products = ref([
            { 
                name: 'Nike Air Zoom Pegasus', 
                price: '$120', 
                image: 'https://via.placeholder.com/200x380.webp', 
                imageSmall: 'https://via.placeholder.com/200x380.webp', 
                imageMedium: 'https://via.placeholder.com/200x380.webp',
                description: 'High-performance running shoes with responsive cushioning.', 
                badge: 'New' 
            },
            { 
                name: 'Adidas Ultraboost 21', 
                price: '$180', 
                image: 'https://via.placeholder.com/200x380.webp', 
                imageSmall: 'https://via.placeholder.com/200x380.webp', 
                imageMedium: 'https://via.placeholder.com/200x380.webp',
                description: 'Boost cushioning technology for maximum comfort.' 
            },
            { 
                name: 'Puma Running Shoes', 
                price: '$90', 
                image: 'https://via.placeholder.com/200x380.webp', 
                imageSmall: 'https://via.placeholder.com/200x380.webp', 
                imageMedium: 'https://via.placeholder.com/200x380.webp',
                description: 'Lightweight and breathable running shoes for everyday use.', 
                badge: 'On Sale' 
            },
            { 
                name: 'Reebok Crossfit Nano', 
                price: '$110', 
                image: 'https://via.placeholder.com/200x380.webp', 
                imageSmall: 'https://via.placeholder.com/200x380.webp', 
                imageMedium: 'https://via.placeholder.com/200x380.webp',
                description: 'Designed for high-intensity crossfit training.' 
            },
            { 
                name: 'Under Armour Hovr', 
                price: '$130', 
                image: 'https://via.placeholder.com/200x380.webp', 
                imageSmall: 'https://via.placeholder.com/200x380.webp', 
                imageMedium: 'https://via.placeholder.com/200x380.webp',
                description: 'Provides a zero-gravity feel to maintain energy return.' 
            },
        ]);

        const rotationAngle = ref(0);
        const activeIndex = ref(0);
        const showModal = ref(false);
        const selectedProduct = ref({});
        const autoplay = ref(true);
        const isMobile = ref(window.innerWidth <= 768);
        let autoplayInterval;
        let isDragging = false;
        let startX = 0;

        // Function to update isMobile based on window width
        const updateIsMobile = () => {
            isMobile.value = window.innerWidth <= 768;
        };

        // Event Listener for Window Resize
        window.addEventListener('resize', updateIsMobile);

        // Watch for menuOpen to toggle body class
        watch(menuOpen, (newVal) => {
            document.body.classList.toggle('menu-open', newVal);
        });

        // Menu Toggle Function
        const toggleMenu = () => { menuOpen.value = !menuOpen.value; };

        // Close Menu Function
        const closeMenu = () => { menuOpen.value = false; };

        // Close Modal Function
        const closeModal = () => { showModal.value = false; };

        // Scroll to Section Function
        const scrollToSection = (hash) => {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                menuOpen.value = false;
            }
        };

        // Get Menu Item Style Function
        const getMenuItemStyle = (index) => {
            if (isMobile.value) return { transform: 'none' };
            const total = navItems.value.length;
            const angle = (360 / total) * index - 90;
            const radius = 200;
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            return { transform: `translate(${x}px, ${y}px)` };
        };

        // Get Carousel Item Style Function
        const getItemStyle = (index) => {
            const angle = (360 / products.value.length) * index + rotationAngle.value;
            const zIndex = Math.round((Math.cos(angle * Math.PI / 180) + 1) * 5);
            return { transform: `rotateY(${angle}deg) translateZ(300px)`, zIndex };
        };

        // Rotate Carousel Function
        const rotateCarousel = (direction) => {
            rotationAngle.value += direction * (360 / products.value.length);
            activeIndex.value = (activeIndex.value + direction + products.value.length) % products.value.length;
            selectedProduct.value = products.value[activeIndex.value];
        };

        // Handle Mouse Wheel for Carousel
        const handleMouseWheel = (event) => {
            event.preventDefault();
            rotateCarousel(event.deltaY > 0 ? 1 : -1);
        };

        // Drag Functions for Carousel
        const startDrag = (event) => {
            isDragging = true;
            startX = event.clientX || event.touches[0].clientX;
        };
        const endDrag = () => { isDragging = false; };
        const onDrag = (event) => {
            if (!isDragging) return;
            const currentX = event.clientX || event.touches[0].clientX;
            const delta = currentX - startX;
            if (Math.abs(delta) > 50) {
                rotateCarousel(delta > 0 ? -1 : 1);
                startX = currentX;
            }
        };

        // Autoplay Functions
        const startAutoplay = () => {
            autoplayInterval = setInterval(() => { rotateCarousel(1); }, 3000);
        };
        const pauseAutoplay = () => { clearInterval(autoplayInterval); };
        const resumeAutoplay = () => { if (autoplay.value) startAutoplay(); };
        const toggleAutoplay = () => {
            autoplay.value = !autoplay.value;
            autoplay.value ? startAutoplay() : pauseAutoplay();
        };

        // Buy Now Function
        const buyNow = (product) => {
            addToCart(product);
            alert(`Proceeding to purchase ${product.name} for ${product.price}.`);
        };

        // Add to Cart Function
        const addToCart = (product) => {
            alert(`${product.name} has been added to your cart.`);
        };

        // Handle Mouse Move for Radial Menu
        const handleMouseMove = (event) => {
            const x = (event.clientX / window.innerWidth) * 100 - 50;
            const y = (event.clientY / window.innerHeight) * 100 - 50;
            const radialMenu = document.querySelector('.radial-menu');
            radialMenu.style.transform = `translate(-50%, -50%) perspective(800px) rotateY(${x / 10}deg) rotateX(${-y / 10}deg)`;
        };

        // Keyboard Navigation for Carousel
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                rotateCarousel(1);
            } else if (event.key === 'ArrowLeft') {
                rotateCarousel(-1);
            }
        };

        // Animate Carousel Container with anime.js
        const animateContainer = () => {
            const carouselContainer = document.querySelector('.carousel-container');
            anime({
                targets: carouselContainer,
                rotateY: '+=15deg',
                duration: 10000,
                easing: 'linear',
                loop: true
            });
        };

        // Animate Carousel Item on Click
        const animateCarouselItem = (element) => {
            anime({
                targets: element,
                scale: [1, 1.05, 1],
                duration: 600,
                easing: 'easeInOutSine'
            });
        };

        // Update Selected Product Function
        const updateSelectedProduct = () => {
            selectedProduct.value = products.value[activeIndex.value];
        };

        // Lifecycle Hooks
        onMounted(() => {
            window.addEventListener('keydown', handleKeyDown);
            if (autoplay.value) startAutoplay();
            animateContainer();
            updateSelectedProduct();

            // Initialize GSAP ScrollTrigger for Hero Section
            gsap.registerPlugin(ScrollTrigger);

            // Animate Hero Background Image
            gsap.to(".hero-background", {
                scale: 1.05,
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // Fade In Animations for Hero Foreground Elements
            gsap.from(".hero-foreground h1", {
                opacity: 0,
                y: -50,
                duration: 1,
                delay: 0.5
            });

            gsap.from(".hero-foreground p", {
                opacity: 0,
                y: 50,
                duration: 1,
                delay: 1
            });

            gsap.from(".hero-foreground button", {
                opacity: 0,
                scale: 0.8,
                duration: 1,
                delay: 1.5
            });
        });

        onBeforeUnmount(() => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', updateIsMobile);
            clearInterval(autoplayInterval);
        });

        return {
            menuOpen, navItems, products, toggleMenu, getMenuItemStyle, getItemStyle,
            handleMouseWheel, startDrag, endDrag, onDrag, buyNow, addToCart,
            showModal, selectedProduct, autoplay, toggleAutoplay,
            handleMouseMove, scrollToSection, closeMenu, closeModal,
            animateCarouselItem, rotateCarousel, updateSelectedProduct
        };
    }
}).mount('#app');
