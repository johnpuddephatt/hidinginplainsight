<template>
  <div class="sidebar" :class="menuOpen ? 'menu-open' : ''" @mouseleave="currentlyHovered = null">
    <div class="sidebar--header">
      <h2 class="sidebar--title"><span class="count">{{ cinemas.length}}</span> cinemas</h2>
      <button class="button" v-if="!isLandscape()" @click="menuOpen = !menuOpen" v-html="menuOpen ? 'Show map' : 'Show list'"></button>
    </div>
    <nav class="sidebar-menu">
      <router-link class="sidebar-menu--item" :to="{ name: 'cinema', params: { slug: cinema.slug } }" :ref="cinema.slug" @mouseenter.native="mouseoverStart($event, cinema.slug)" v-for="cinema in cinemas" :key="cinema.slug">
        <div class="image">
          <img :src="cinema.image_small" />
        </div>
        <h3 class="sidebar-menu--title" v-html="cinema.title"></h3>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: ['cinemas','clicked'],
  components: {},
  data() {
    return {
      menuOpen: false,
      currentlyHovered: null
    }
  },
  watch: {
    clicked: function (clicked) {
      let clickedMenuElement = this.$refs[clicked][0].$el;
      this.clearActiveMenuElement();
      if(clickedMenuElement && (this.menuOpen || this.isLandscape())) {
        clickedMenuElement.classList.add('active');
        if(!this.currentlyHovered) {
          clickedMenuElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        }
      }
    }
  },
  methods: {
    isLandscape() {
      return (document.documentElement.clientWidth > document.documentElement.clientHeight);
    },
    clearActiveMenuElement() {
      let activeMenuElement = document.querySelectorAll('.sidebar-menu .active');
      if(activeMenuElement.length) {
        activeMenuElement.forEach((elem) => {
          elem.classList.remove('active');
        });
      }
    },
    clickMenuElement(event, slug) {
      this.$router.push({ name: 'cinema', params: { slug: slug } })
      // this.clearActiveMenuElement();
      // this.$refs[slug][0].classList.add('active');
      // this.$emit('menu-clicked',slug);
    },
    mouseoverStart(event, slug) {
      if(this.$router.currentRoute.name == 'cinemas' && !this.menuOpen) {
        this.currentlyHovered = slug;
        setTimeout(() => {
          if(this.currentlyHovered === slug ) {
            this.clearActiveMenuElement();
            this.$refs[slug][0].$el.classList.add('active');
            this.$emit('menu-clicked',slug);
          }
        },750);
      }
    },
    mouseoverCancel() {
      this.currentlyHovered = null;
    }
  },
  mounted() {}
}
</script>

<style lang="scss">

@import '../styles/base.scss';

.sidebar {
  z-index: 999999;
  position: absolute;
  background-color: white;
  padding: ms(2) 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  top: calc(100% - #{2 * ms(2) + ms(4)});
  border-top: 1px solid $medium-gray;
  transition: top 1s ease, z-index 1.5s ease;

  &.menu-open {
    overflow-y: auto;
    z-index: 9999999;
    top: 0;
    transition: top 1s ease, z-index 0s ease;
  }

  @media screen and (orientation: landscape) {
    overflow-y: auto;
    position: static;
    padding: ms(8) 0;
    border-top: none;
    border-right: 2px solid $medium-gray;
    width: $sidebar-width;
    height: 100%;
  }
}

.sidebar--header {
  line-height: ms(4);
  padding: 0 ms(2) ms(2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar--title {
  font-weight: 700;
  font-size: ms(2);

  @media screen and (orientation: portrait) {
    font-size: ms(1);
  }
}

.sidebar-menu--item {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: background-color $base-timing $base-duration, border $base-timing $base-duration;
  margin-left: -(ms(-1));
  padding: ms(-2) ms(-1) ms(-2) ms(2);
  border-left: ms(-1) solid white;
  border-bottom: 1px solid $light-gray;

  &:hover {
    background-color: $light-blue;
  }

  &.active,
  &.router-link-exact-active {
    border-left-color: $orange;
  }

  .image {
    flex: 0 0 75px;
    display: block;
    width: 75px;
    height: 75px;
    background-color: $cream;
    margin-right: ms(-1);
    padding-top: 10px;

    img {
      margin-left: auto;
      margin-right: auto;
      object-fit: contain;
      object-position: center;
      display: block;
      height: 100%;
      image-rendering: -webkit-optimize-contrast;
    }
  }
}

.sidebar-menu--title {
  font-weight: 400 !important;
}

</style>