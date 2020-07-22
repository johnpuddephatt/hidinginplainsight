<template>
  <div class="sidebar">
    <h2 class="sidebar--title">Cinemas</h2>
    <nav class="sidebar-menu">
      <router-link :to="{ name: 'cinema', params: { slug: cinema.slug } }" class="sidebar-menu--item" :ref="cinema.slug" @mouseover.native="mouseoverStart($event, cinema.slug)" @mouseleave.native="mouseoverCancel()" v-for="cinema in cinemas" :key="cinema.slug">
        <h3 class="sidebar-menu--title">{{ cinema.title }}</h3>
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
          hoveredMenuElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
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
          let hoveredMenuElement = this.$refs[slug][0].$el;
          hoveredMenuElement.classList.add('active');
          this.$emit('menu-hovered', slug);
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
}

.sidebar--title {
  font-weight: 700;
  font-size: ms(1);
  margin-bottom: ms(0);
}

.sidebar-menu--item {
  display: block;
  cursor: pointer;
  transition: background-color $base-timing $base-duration;
  margin-left: -(ms(0));
  margin-right: -(ms(0));
  padding: ms(0);

  &:hover {
    background-color: whitesmoke;
  }

  &.active,
  &.router-link-exact-active {
    outline: 1px solid $orange;
  }
}

</style>