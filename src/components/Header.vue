<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import IconChevron from './icons/IconChevron.vue';

// Move links to an array to allow programmatic moving to the dropdown
const allLinks = [
    { to: "/", text: "Home" },
    { to: "/schedule", text: "Schedule" },
    { to: "/records", text: "Records" },
    { to: "/coaches", text: "Coaches" },
    { to: "/sponsors", text: "Sponsors" },
    { to: "/off-season-training", text: "Off-Season Training" },
    { to: "/boosters", text: "Boosters" },
    { to: "/handbook", text: "Handbook" }
];

const menuOpen = ref(false);       // Mobile menu state
const chevronOpen = ref(false);    // Desktop chevron dropdown state
const animate = ref(false);
const isDesktop = ref(false);      // Track if we are above the 768px breakpoint

const visibleLinks = ref([...allLinks]);
const dropdownLinks = ref([]);

function triggerAnimation() {
    animate.value = false;
    setTimeout(() => {
        animate.value = true;
    }, 0);
}

// 1. Calculate the space between the end of the logo and the rest of the header
function calculateRemainingSpace() {
    const header = document.querySelector('header');
    const logo = document.querySelector('.logo');
    if (!header || !logo) return 0;

    const headerStyle = window.getComputedStyle(header);
    const paddingLeft = parseFloat(headerStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(headerStyle.paddingRight) || 0;

    const headerWidth = header.clientWidth;
    const logoWidth = logo.getBoundingClientRect().width;

    // Remaining space = Total width - Logo space - Header horizontal paddings
    return headerWidth - logoWidth - paddingLeft - paddingRight;
}

// 2. The recursive function that continually works until the links fit
async function adjustLinksRecursively() {
    const navLinksEl = document.querySelector('.nav_links');
    if (!navLinksEl || visibleLinks.value.length <= 1) return;

    // Step A: Calculate current nav_links width
    const navLinksWidth = navLinksEl.offsetWidth;
    
    // Step B: Calculate remaining space
    const remainingSpace = calculateRemainingSpace();

    // Step C: Check lengths. If longer, add one link to dropdown and repeat.
    if (navLinksWidth > remainingSpace) {
        addToDropdown();
        
        // Wait for Vue to update the DOM layout width before checking lengths again
        await nextTick(); 
        await adjustLinksRecursively();
    }
}

// 3. Move a single link from the visible row to the dropdown array
function addToDropdown() {
    if (visibleLinks.value.length > 0) {
        const linkToMove = visibleLinks.value.pop();
        dropdownLinks.value.unshift(linkToMove); // Push to the top of the dropdown list
    }
}

// Main orchestrator called on mount and window resize
async function handleLayoutAdjustment() {
    isDesktop.value = window.innerWidth >= 768;

    if (!isDesktop.value) {
        // Reset everything if on mobile layout
        visibleLinks.value = [...allLinks];
        dropdownLinks.value = [];
        return;
    }

    // Reset layout arrays to default before calculating clean desktop spacing
    visibleLinks.value = [...allLinks];
    dropdownLinks.value = [];
    chevronOpen.value = false;

    // Wait for the DOM to render all links inline horizontally
    await nextTick();
    await adjustLinksRecursively();
}

// Close desktop chevron dropdown when clicking anywhere else
function closeChevronOutside(e) {
    const chevronContainer = document.querySelector('.chevron_dropdown');
    if (chevronContainer && !chevronContainer.contains(e.target)) {
        chevronOpen.value = false;
    }
}

onMounted(() => {
    handleLayoutAdjustment();
    window.addEventListener('resize', handleLayoutAdjustment);
    window.addEventListener('click', closeChevronOutside);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleLayoutAdjustment);
    window.removeEventListener('click', closeChevronOutside);
});
</script>

<template>
<header> 
    <div class="logo"> 
        <RouterLink to="/" @click="menuOpen = false"> 
            <img src="../assets/mgxc_logo.svg" alt=""> 
            <h1>MAPLE GROVE<br>CROSS COUNTRY</h1> 
        </RouterLink> 
    </div> 
    <nav> 
        <button class="nav_button" @click="menuOpen = !menuOpen; triggerAnimation()"> 
            <img class="nav_logo" src="../assets/mgxc_hamburger.svg" alt="Navigate" :class="{ animate }"> 
        </button> 
        <div class="overlay" @click="menuOpen = false" v-show="menuOpen"></div> 
        
        <Transition name="nav-slide"> 
            <div class="nav_links" v-show="menuOpen || isDesktop" @click="!isDesktop ? menuOpen = false : null"> 
                
                <template v-if="isDesktop">
                    <RouterLink v-for="link in visibleLinks" :key="link.to" :to="link.to">
                        {{ link.text }}
                    </RouterLink>

                    <div v-if="dropdownLinks.length > 0" class="chevron_dropdown" @click.stop>
                        <button class="chevron_trigger" @click="chevronOpen = !chevronOpen">
                            <span class="chevron_icon"><IconChevron class="icon"/></span>
                        </button>
                        <div class="chevron_menu" v-show="chevronOpen">
                            <RouterLink v-for="link in dropdownLinks" :key="link.to" :to="link.to" @click="chevronOpen = false">
                                {{ link.text }}
                            </RouterLink>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <RouterLink v-for="link in allLinks" :key="link.to" :to="link.to">
                        {{ link.text }}
                    </RouterLink>
                </template>

            </div> 
        </Transition> 
    </nav> 
</header> 
</template> 

<style scoped> 
header { 
    background-color: var(--color-primary); 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 10px; 
} 

.logo { 
    display: flex; 
    z-index: 1; 
    img { 
        width: 65px; 
        padding-right: 10px; 
    } 
    h1 { 
        margin: 0; 
    } 
     h1{ 
        font-size: 2rem; 
        color: var(--color-secondary); 
    } 
    a { 
        display: flex; 
        text-decoration: none !important; 
    } 

    @media screen and (max-width: 340px) { 
        img { 
            display: none; 
        } 
    } 
} 

nav { 
    height: fit-content; 
    z-index: 10; 

    button { 
        background: none; 
        border: none; 
        outline: none; 
        padding: 0; 
        position: relative; 
        z-index: 1; 
    } 
} 

.nav_links { 
    position: absolute; 
    display: flex; 
    flex-direction: column; 
    right: 0; 
    top: 0; 
    padding: 20px; 
    padding-top: 80px; 
    box-sizing: border-box; 
    border-radius: 30px 0 0 30px; 
    background: var(--color-primary); 
    a { 
        color: var(--color-secondary); 
        font-size: 3rem; 
        padding: 10px 0; 
        text-decoration: none; 
        text-align: right; 
    } 
} 

.router-link-exact-active { 
    text-decoration: underline !important; 
    text-decoration-thickness: 2px !important; 
    text-underline-offset: 3px !important; 
} 

.nav-slide-enter-active, 
.nav-slide-leave-active { 
    transition: all 0.3s ease-out; 
} 

.nav-slide-enter-from, 
.nav-slide-leave-to { 
  transform: translateX(100%); 
} 

.overlay { 
    z-index: 0; 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    background-color: var(--color-background); 
    opacity: .3; 
} 

.animate { 
    animation: wobble 0.3s ease-in-out; 
} 

.icon {
    fill: var(--color-secondary);
    width: 30px;
}

@media screen and (min-width: 768px) { 
    .logo h1 { 
        display: none; 
    } 
    .nav_button { 
        display: none; 
    } 
    .nav_links { 
        display: flex; 
        flex-direction: row;
        white-space: nowrap;
        align-items: center;
        position: relative; 
        padding: 0; 

        a { 
            font-size: 2rem; 
            margin: 0 15px; 
            padding: 0; 
            position: relative; 
        } 
        a::after { 
            content: ''; 
            position: absolute; 
            bottom: 0px; 
            left: 50%; 
            transform: translateX(-50%); 
            width: 0; 
            height: 1px; 
            background-color: currentColor; 
            transition: width 0.3s ease; 
        } 
        a:hover::after { 
          width: 98%; 
        } 
    } 

    /* Chevron Dropdown Mechanical Styles */
    .chevron_dropdown {
        position: relative;
        display: inline-block;
    }

    .chevron_trigger {
        background: none;
        border: none;
        color: var(--color-secondary);
        font-size: 1.8rem;
        cursor: pointer;
        padding: 0 10px;
        display: flex;
        align-items: center;
    }

    .chevron_menu {
        position: absolute;
        top: 100%;
        right: -10px;
        background-color: var(--color-primary);
        border-radius: 0 0 0 12px;
        padding: 10px 0;
        min-width: 180px;
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        z-index: 100;

        a {
            text-align: right;
            padding: 10px 20px;
            margin: 0;
            font-size: 1.6rem;
        }
        a::after {
            display: none;
        }
        a:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }
} 

/* animations */ 
@keyframes wobble { 
    0%   { transform: scale(1)    rotate(0deg); } 
    25%  { transform: scale(0.9)  rotate(-15deg); } 
    75%  { transform: scale(0.9)  rotate(15deg); } 
    100% { transform: scale(1)    rotate(0deg); } 
} 
</style>