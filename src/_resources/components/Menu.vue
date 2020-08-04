<template>
  <div class="sidebar" :class="menuOpen ? 'menu-open' : ''" @mouseleave="currentlyHovered = null">
    <div class="sidebar--header">
      <h2 class="sidebar--title"> <ICountUp
      :delay="500"
      :endVal="cinemas.length"
      :options="{useEasing: false, duration: 3}"
    /> cinemas</h2>
      <button class="button" v-if="!isLandscape" @click="menuOpen = !menuOpen" v-html="menuOpen ? 'Show map' : 'Show list'"></button>
    </div>
    <nav class="sidebar-menu">
      <router-link class="sidebar-menu--item" :class="cinema.slug == clicked ? 'active' : ''" :to="{ name: 'cinema', params: { slug: cinema.slug } }" :ref="cinema.slug" @mouseenter.native="mouseoverStart($event, cinema.slug)" v-for="cinema in cinemas" :key="cinema.slug">
        <div class="image">
          <img v-if="cinema.image_small" :src="cinema.image_small" />
          <span v-else>?</span>
        </div>
        <h3 class="sidebar-menu--title" v-html="cinema.title"></h3>
      </router-link>
    </nav>
  </div>
</template>

<script>
import ICountUp from 'vue-countup-v2';

export default {
  name: 'Menu',
  props: ['cinemas','clicked', 'isLandscape'],
  components: {ICountUp},
  data() {
    return {
      menuOpen: false,
      currentlyHovered: null
    }
  },
  watch: {
    clicked: function (clicked) {
      if(clicked) {
        let clickedMenuElement = this.$refs[clicked][0].$el;
        if(clickedMenuElement && (this.menuOpen || this.isLandscape)) {
          if(!this.currentlyHovered) {
            clickedMenuElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
          }
        }
      }
    }
  },
  methods: {
    clickMenuElement(event, slug) {
      this.$router.push({ name: 'cinema', params: { slug: slug } })
    },
    mouseoverStart(event, slug) {
      if(!this.menuOpen) {
        this.currentlyHovered = slug;
        setTimeout(() => {
          if(this.currentlyHovered === slug && this.$router.currentRoute.name == 'cinemas') {
            this.$emit('menu-hovered',slug);
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
  padding: ms(-2) ms(-1) ms(-2) ms(2) * 0.75;
  border-left: ms(2)/4 solid transparent;
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
    padding: 4px 4px 0;
    position: relative;

    img {
      margin-left: auto;
      margin-right: auto;
      object-fit: contain;
      object-position: center bottom;
      display: block;
      height: 100%;
      image-rendering: -webkit-optimize-contrast;
    }

    span {
      font-size: ms(3);
      color: $red;
      font-weight: 700;
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
  &:nth-child(4n - 3) .image {
    background-color: transparentize($red,0.9);
  }
  &:nth-child(4n - 2) .image {
    background-color: transparentize($orange,0.25);
  }
  &:nth-child(4n - 1) .image {
    background-color: transparentize($blue,0.6);
  }
  &:nth-child(4n) .image {
    background-color: $cream;
  }
}

.sidebar-menu--title {
  font-weight: 400 !important;
}

</style>