<template>
  <div class="sidebar">
    <h2 class="sidebar--title">Cinemas</h2>
    <nav class="sidebar-menu" @mouseleave="mouseoverCancel()">
      <router-link :to="{ name: 'cinema', params: { slug: cinema.slug } }" class="sidebar-menu--item" :ref="cinema.slug" @mouseover.self.native.self="mouseoverStart($event, cinema.slug)" v-for="cinema in cinemas" :key="cinema.slug">
        <img :src="cinema.image" />
        <h3 class="sidebar-menu--title" v-html="cinema.title"></h3>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: ['cinemas','hovered'],
  components: {},
  data() {
    return {
      currentlyHovered: ''
    }
  },
  watch: {
    hovered: function (hovered) {
      if(hovered) {
        let hoveredMenuElement = this.$refs[hovered][0].$el;
        this.clearActiveMenuElement();
        if(hoveredMenuElement) {
          hoveredMenuElement.classList.add('active');
          if(!this.currentlyHovered) {
            hoveredMenuElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
          }
        }
      }
    }
  },
  methods: {
    clearActiveMenuElement() {
      let activeMenuElement = document.querySelectorAll('.sidebar-menu .active');
      if(activeMenuElement.length)
      activeMenuElement.forEach((elem) => {
        elem.classList.remove('active');
      });
    },
    mouseoverStart(event, slug) {
      this.currentlyHovered = slug;
      setTimeout(() => {
        if(this.currentlyHovered === slug ) {
          this.clearActiveMenuElement();
          this.$refs[slug][0].$el.classList.add('active');
          this.$emit('menu-hovered',slug);
        }
      },1000);
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
  overflow-y: auto;
  background-color: white;
  padding: ms(6) ms(2);
  height: calc(100vh - 100vw);

  @media screen and (orientation: landscape) {
    border-right: 1px solid darken($light-blue, 4%);
    width: $sidebar-width;
    height: calc(100vh - #{3 * ms(1)});
  }
}

.sidebar--title {
  font-weight: 700;
  font-size: ms(1);
  margin-bottom: ms(0);
}

.sidebar-menu--item {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: background-color $base-timing $base-duration, border $base-timing $base-duration;
  margin-left: -(ms(0)/2);
  padding: 0 ms(0)/2 0 0;
  border-left: ms(0)/2 solid white;
  margin-bottom: ms(0);

  &:hover {
    background-color: $light-blue;
  }

  &.active,
  &.router-link-exact-active {
    border-left-color: $orange;
  }

  img {
    display: block;
    width: 75px;
    height: 75px;
    background-color: $cream;
    margin-right: ms(0);
  }


}

</style>