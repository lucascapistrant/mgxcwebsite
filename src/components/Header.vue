<script setup>
//import "ComponentName" from './componentname.vue';
import { ref, vModelDynamic } from 'vue';

const menuOpen = ref(false);
const animate = ref(false);

function triggerAnimation() {
    animate.value = false;
    setTimeout(() => {
        animate.value = true;
    }, 0);
}

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
            <div class="nav_links" v-show="menuOpen" @click="menuOpen = false">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/test">Test</RouterLink>
                <RouterLink to="/test">Test1</RouterLink>
                <RouterLink to="/test">Test02</RouterLink>
                <RouterLink to="/test">Test3</RouterLink>
                <RouterLink to="/test">Test004</RouterLink>
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
    /* position: relative; */

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
    padding: 20px;
    box-sizing: border-box;
    border-radius: 0 0 0 30px;
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
}

.animate {
    animation: bounce 0.3s ease-in-out forwards;
}

/* Desktop */
@media screen and (min-width: 768px) {
    .logo h1 {
        display: none;
    }
    .nav_button {
        display: none;
    }
    .nav_links {
        display: block !important;
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
}

/* animations */
@keyframes bounce {
    0% { transform: scale(1) }
    25% { transform: scale(1.2) }
    50% { transform: scale(1) }
    75% { transform: scale(1.2) }
    80% { transform: scale(1) }

}
</style>

