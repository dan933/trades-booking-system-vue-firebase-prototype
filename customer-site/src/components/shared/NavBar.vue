<template>
  <nav :class="`nav ${scrollPosition > 0 ? 'nav-sticky' : ''}`">
    <div class="site-title-container">
      <a class="site-header" href="#">Easy Booking</a>
    </div>
    <ul class="nav-links">
      <li @click="() => { handleNavClick(menuItem) }" v-for="menuItem in menuList" :key="menuItem.name">
        <a :class="`nav-item ${currentLink === menuItem?.name?.toLowerCase?.() && 'active'}`" :href="menuItem.link">{{
          menuItem.name }}</a>
      </li>
    </ul>
    <button :class="`burger ${activeMobileMenu ? 'play' : ''}`" @click="() => { activeMobileMenu = !activeMobileMenu }">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
  </nav>
  <div :class="`${activeMobileMenu ? 'mobile-menu-visible' : 'mobile-menu-hidden'}`">
    <ul class="mobile-menu-links">
      <li @click="() => { handleNavClick(menuItem) }" v-for="menuItem in menuList" :key="menuItem.name">
        <a :class="`nav-item ${currentLink === menuItem?.name?.toLowerCase?.() && 'active'}`" :href="menuItem.link">{{
          menuItem.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const activeMobileMenu = ref(false);
const scrollPosition = ref(0);
const navMenuChange = ref(false);

const handleNavClick = (menuItem) => {
  navMenuChange.value = true
  props.navFunctions.setCurrentLink(menuItem?.name?.toLowerCase?.())

  navMenuChange.value = false


}

const handleScroll = () => {
  scrollPosition.value = window.scrollY || window.pageYOffset;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});


const props = defineProps({
  menuList: {
    type: Array,
    default: () => [
      { name: 'Home', link: '#home' },
      { name: 'About', link: '#about' },
      { name: 'Booking', link: '#services' },
      { name: 'Contact', link: '#contact' }
    ]
  },
  scrollPosition: {
    type: Number,
    default: 0
  },
  currentLink: {
    type: String,
    default: 'home'
  },
  navFunctions: {
    type: Object
  }

})

</script>

<style scoped>
.site-header {
  color: #ffffff;
  font-family: 'Rubik', sans-serif;
}

.site-title-container {
  font-weight: 700;
}

a {
  text-decoration: none;
  outline: none;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  color: #ffffff;
  font-size: 20px;
  font-family: 'Rubik', sans-serif;
}

.nav {
  position: sticky;
  top: 0;
  width: 100%;
  max-width: 1900px;
  height: 80px;
  z-index: 1000;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  justify-self: center;
  align-items: center;
  padding: 0 20px;
  flex-wrap: wrap;
}

.nav-sticky {
  background-color: #7d37e1;
  position: sticky;
  top: 0;
  transition: all ease-in-out 700ms;
}

.nav-links {
  display: flex;
  gap: 2px;
  list-style: none;
  margin-bottom: 5px;

  .opacity-zero {
    opacity: 0;
  }


  .nav-item {
    padding: 15px;
    display: block;
    font-family: 'Josefin Sans', sans-serif;
    position: relative;
    font-size: 18px;
    font-weight: 400;

  }

  .nav-item:after {
    content: "";
    position: absolute;
    height: 2px;
    bottom: 0;
    left: 0;
    transition: 0.3s;
    width: 0;
    background-color: white;
  }

  .nav-item:hover:after {
    width: 100%;
  }

  .active::after {
    width: 100%;
  }
}

.burger {
  display: none;
  border: none;
  margin: 0;
  padding: 0;
  background: none;
  width: 30px;
  right: 30px;
  top: 30px;
  z-index: 1000;
  display: none;
  cursor: pointer;

  .bar {
    background-color: #ffffff;
    width: 30px;
    height: 3px;
    display: block;
    margin-bottom: 6px;
    border-radius: 10px;
    position: relative;
    right: 0;
    top: 0;
    opacity: 1;
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: 0.3s;
    transition: 0.3s;
    -webkit-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  }

  &.play {
    .bar:nth-child(1) {
      top: 9px;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }

    .bar:nth-child(2) {
      right: 20px;
      opacity: 0;
    }

    .bar:nth-child(3) {
      top: -9px;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }
  }
}

.mobile-menu-visible {
  display: flex;
  justify-content: center;
  width: 100%;
  list-style-type: none;
  position: absolute;
  top: 80px;
  position: fixed;
  z-index: 9999;

  .mobile-menu-links {
    list-style-type: none;
    padding: 5px;
    background-color: white;
    width: 80%;
    background: #ffffff;
    padding: 30px;
    border-radius: 5px;

    a {
      color: black;
    }
  }
}

.mobile-menu-hidden {
  display: none;
}

@media screen and (max-width: 650px) {
  .nav-links {
    display: none;
  }

  .burger {
    display: block;
  }

  .nav {
    background-color: #7a18f2;

    a {
      font-size: 18px;
      line-height: 0;
    }
  }
}

@media screen and (min-width: 650px) {
  .mobile-menu-visible {
    display: none;
  }
}
</style>
