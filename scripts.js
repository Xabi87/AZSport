window.addEventListener('load', () => {
    const { createApp, ref, onMounted, watch, onBeforeUnmount } = Vue;
    
    const app = createApp({
        setup() {
            // State initialization
            const menuOpen = ref(false);
            const searchOpen = ref(false);
            const searchQuery = ref('');
            const activeSubMenu = ref('');
            const showModal = ref(false);
            const selectedProduct = ref({
                name: 'Loading...',
                price: '',
                description: 'Please wait while we load the product details.',
                image: '',
            });
            const autoplay = ref(true);
            const cartCount = ref(0);
            const products = ref([
                {
                    name: 'Product 1',
                    price: '$120',
                    image: './images/car1.png',
                    imageSmall: './images/car1.png',
                    description: 'High-performance running shoes with responsive cushioning.',
                    badge: 'New'
                },
                {
                    name: 'Product 2',
                    price: '$180',
                    image: './images/car2.png',
                    imageSmall: './images/car2.png',
                    description: 'Boost cushioning technology for maximum comfort.'
                },
                {
                    name: 'Product 3',
                    price: '$90',
                    image: './images/car3.png',
                    imageSmall: './images/car3.png',
                    description: 'Lightweight and breathable running shoes for everyday use.',
                    badge: 'On Sale'
                },
                {
                    name: 'Product 4',
                    price: '$110',
                    image: './images/car4.png',
                    imageSmall: './images/car4.png',
                    description: 'Designed for high-intensity crossfit training.'
                },
                {
                    name: 'Product 5',
                    price: '$130',
                    image: './images/car5.png',
                    imageSmall: './images/car5.png',
                    description: 'Provides a zero-gravity feel to maintain energy return.'
                },
            ]);
            const categories = ref([{name:"Mens",image:"images/menscat.png"},{name:"Womens",image:"images/womenscat.png"},{name:"Kids",image:"images/kidscat.png"},{name:"Sale",image:"images/salecat.png"},{name:"Latest",image:"images/latestcat.png"},]);
            const rotationAngle = ref(0);
            const activeIndex = ref(0);
            const autoplayInterval = ref(null);
            const isDragging = ref(false);
            const startX = ref(0);
            const isMobile = ref(window.innerWidth<=768);

            const toggleMenu = () => {
                menuOpen.value = !menuOpen.value;
                if(menuOpen.value){
                    document.body.classList.add('menu-open');
                    const firstFocusable = document.querySelector('#mobile-menu a, #mobile-menu .close-menu');
                    firstFocusable && firstFocusable.focus()
                } else {
                    document.body.classList.remove('menu-open');
                    document.getElementById('hamburger').focus()
                }
            };

            const toggleSearch = () => {
                searchOpen.value = !searchOpen.value
            };

            const performSearch = () => {
                if(searchQuery.value.trim() !== ''){
                    alert(`Searching for "${searchQuery.value}"`);
                    searchQuery.value = '';
                    searchOpen.value = false
                }
            };

            const toggleSubMenu = (menu) => {
                activeSubMenu.value = activeSubMenu.value === menu ? '' : menu
            };

            const scrollToSection = (hash) => {
                const element = document.querySelector(hash);
                if(element){
                    window.scrollTo({
                        top: element.offsetTop - 60,
                        behavior: 'smooth'
                    });
                    if(menuOpen.value){
                        toggleMenu()
                    }
                }
            };

            const scrollToTop = () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                if(menuOpen.value){
                    toggleMenu()
                }
            };

            const getItemStyle = (index) => {
                const angle = (360/products.value.length)*index + rotationAngle.value;
                const zIndex = Math.round((Math.cos(angle*Math.PI/180)+1)*5);
                return {
                    transform: `rotateY(${angle}deg) translateZ(300px)`,
                    zIndex
                }
            };

            const rotateCarousel = (direction) => {
                rotationAngle.value += direction*(360/products.value.length);
                activeIndex.value = (activeIndex.value + direction + products.value.length) % products.value.length;
                updateSelectedProduct()
            };

            const handleMouseWheel = (event) => {
                event.preventDefault();
                rotateCarousel(event.deltaY > 0 ? 1 : -1)
            };

            const startDrag = (event) => {
                isDragging.value = true;
                startX.value = event.clientX || (event.touches && event.touches[0].clientX) || 0
            };

            const endDrag = () => {
                isDragging.value = false
            };

            const onDrag = (event) => {
                if(!isDragging.value) return;
                const currentX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
                const delta = currentX - startX.value;
                if(Math.abs(delta) > 50){
                    rotateCarousel(delta > 0 ? -1 : 1);
                    startX.value = currentX
                }
            };

            const startAutoplay = () => {
                autoplayInterval.value = setInterval(() => {
                    rotateCarousel(1)
                }, 3000)
            };

            const pauseAutoplay = () => {
                clearInterval(autoplayInterval.value)
            };

            const resumeAutoplay = () => {
                if(autoplay.value) startAutoplay();
            };

            const toggleAutoplay = () => {
                autoplay.value = !autoplay.value;
                autoplay.value ? startAutoplay() : pauseAutoplay()
            };

            const buyNow = (product) => {
                addToCart(product);
                alert(`Proceeding to purchase ${product.name} for ${product.price}.`)
            };

            const addToCart = (product) => {
                cartCount.value += 1;
                const cartIcon = document.querySelector('.cart-icon a');
                if(cartIcon){
                    cartIcon.setAttribute('data-count', cartCount.value)
                }
                alert(`${product.name} has been added to your cart.`)
            };

            const openModal = (product) => {
                selectedProduct.value = product;
                showModal.value = true
            };

            const closeModal = () => {
                showModal.value = false
            };

            const handleKeyDown = (event) => {
                if(event.key === 'ArrowRight'){
                    rotateCarousel(1)
                } else if(event.key === 'ArrowLeft'){
                    rotateCarousel(-1)
                }
            };

            const updateIsMobile = () => {
                isMobile.value = window.innerWidth <= 768
            };

            const debounce = (func, delay) => {
                let timeout;
                return () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(func, delay)
                }
            };

            const updateSelectedProduct = () => {
                if(products.value.length > 0){
                    selectedProduct.value = products.value[activeIndex.value]
                }
            };

            onMounted(() => {
                try {
                    updateSelectedProduct();
                    if (autoplay.value) startAutoplay();
                    
                    if (typeof gsap !== 'undefined') {
                        gsap.to('.hero-content', {
                            opacity: 1,
                            y: 0,
                            duration: 1
                        });
                    }
                    
                    if (typeof particlesJS !== 'undefined') {
                        particlesJS('particles-js', {"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#1E90FF"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false}},"size":{"value":3,"random":true,"anim":{"enable":false}},"line_linked":{"enable":true,"distance":150,"color":"#1E90FF","opacity":0.4,"width":1},"move":{"enable":true,"speed":2,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":140,"line_linked":{"opacity":1}},"push":{"particles_nb":4}}},"retina_detect":true});
                    }
                } catch (error) {
                    console.warn('Component initialization:', error);
                }
            });

            onBeforeUnmount(() => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('resize', updateIsMobile);
                clearInterval(autoplayInterval.value)
            });

            watch(activeIndex, () => {
                updateSelectedProduct()
            });
            
            // Make sure to return all refs and methods
            return {
                menuOpen,
                searchOpen,
                searchQuery,
                activeSubMenu,
                showModal,
                selectedProduct,
                autoplay,
                cartCount,
                products,
                categories,
                rotationAngle,
                activeIndex,
                toggleMenu,
                toggleSearch,
                performSearch,
                toggleSubMenu,
                scrollToSection,
                scrollToTop,
                getItemStyle,
                handleMouseWheel,
                startDrag,
                endDrag,
                onDrag,
                buyNow,
                addToCart,
                openModal,
                closeModal
            }
        }
    });
    
    app.mount('#app');
});

const addHoverEffects = () => {
    gsap.to('.product-card', {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
    });
}

const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
            }
        });
    });
}

// Add at the end of your window.load event handler
document.getElementById('app').classList.add('loaded');
