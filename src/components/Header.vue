<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import IconChevron from './icons/IconChevron.vue';

const allLinks = [
    { to: "/", text: "Home" },
    { to: "/schedule", text: "Schedule" },
    { to: "/records", text: "Records" },
    { to: "/coaches", text: "Coaches" },
    { to: "/sponsors", text: "Sponsors" },
    { to: "/off-season-training", text: "Summer Training" },
    { to: "/boosters", text: "Boosters" },
    { to: "/handbook", text: "Handbook" }
];

const menuOpen = ref(false);
const chevronOpen = ref(false);
const animate = ref(false);
const isDesktop = ref(false);

const visibleLinks = ref([...allLinks]);
const dropdownLinks = ref([]);

function triggerAnimation() {
    animate.value = false;
    setTimeout(() => {
        animate.value = true;
    }, 0);
}

function calculateRemainingSpace() {
    const header = document.querySelector('header');
    const logo = document.querySelector('.logo');
    if (!header || !logo) return 0;

    const headerStyle = window.getComputedStyle(header);
    const paddingLeft = parseFloat(headerStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(headerStyle.paddingRight) || 0;

    const headerWidth = header.clientWidth;
    const logoWidth = logo.getBoundingClientRect().width;

    return headerWidth - logoWidth - paddingLeft - paddingRight;
}

async function adjustLinksRecursively() {
    const navLinksEl = document.querySelector('.nav_links');
    if (!navLinksEl || visibleLinks.value.length <= 1) return;

    const navLinksWidth = navLinksEl.offsetWidth;
    const remainingSpace = calculateRemainingSpace();

    if (navLinksWidth > remainingSpace) {
        addToDropdown();
        await nextTick(); 
        await adjustLinksRecursively();
    }
}

function addToDropdown() {
    if (visibleLinks.value.length > 0) {
        const linkToMove = visibleLinks.value.pop();
        dropdownLinks.value.unshift(linkToMove);
    }
}

async function handleLayoutAdjustment() {
    isDesktop.value = window.innerWidth >= 768;

    if (!isDesktop.value) {
        visibleLinks.value = [...allLinks];
        dropdownLinks.value = [];
        return;
    }

    visibleLinks.value = [...allLinks];
    dropdownLinks.value = [];
    chevronOpen.value = false;

    await nextTick();
    await adjustLinksRecursively();
}

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
        
        <Transition name="nav-dropdown"> 
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

<div class="overlay" @click="menuOpen = false" v-show="menuOpen && !isDesktop"></div>
</template> 

<style scoped> 
header { 
    background-color: var(--color-primary); 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 10px; 
    position: relative;
    z-index: 20;
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
    left: 0; 
    top: 100%; 
    width: 100%;
    padding: 15px 20px; 
    box-sizing: border-box; 
    background: var(--color-primary); 
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-height: 500px;
    
    a { 
        color: var(--color-secondary);  
        padding: 12px 0; 
        text-decoration: none; 
        text-align: center; 
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);

        &:last-child {
            border-bottom: none;
        }
    } 
} 

.router-link-exact-active { 
    text-decoration: underline !important; 
    text-decoration-thickness: 2px !important; 
    text-underline-offset: 3px !important; 
} 

/* Height-based expanding animation starting directly from the bottom edge */
.nav-dropdown-enter-active, 
.nav-dropdown-leave-active { 
    transition: max-height 0.25s ease-in-out, padding 0.25s ease-in-out; 
} 

.nav-dropdown-enter-from, 
.nav-dropdown-leave-to { 
    max-height: 0; 
    padding-top: 0;
    padding-bottom: 0;
} 

.overlay { 
    z-index: 5; 
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
        width: auto;
        box-shadow: none;
        max-height: none;
        overflow: visible;

        a { 
            font-size: 2rem; 
            margin: 0 15px; 
            padding: 0; 
            position: relative; 
            text-align: left;
            border-bottom: none;
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

@keyframes wobble { 
    0%   { transform: scale(1)    rotate(0deg); } 
    25%  { transform: scale(0.9)  rotate(-15deg); } 
    75%  { transform: scale(0.9)  rotate(15deg); } 
    100% { transform: scale(1)    rotate(0deg); } 
} 
</style>