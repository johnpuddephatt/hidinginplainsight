<template>
  <div class="map-wrapper">
    <Menu v-if="cinemas" :cinemas="cinemas" :isLandscape="isLandscape()" :clicked="clicked" @menu-hovered="onMenuHovered"></Menu>
    <Map v-if="cinemas" :cinemas="cinemas" :clicked="clicked" @marker-clicked="onMarkerClicked"></Map>
    <transition name="popup">
      <Popup v-for="cinema in cinemas" :cinema="cinema" @close="clicked = null" v-if="clicked == cinema.slug" :key="cinema.slug"></Popup>
    </transition>
    <transition name="slide">
      <router-view :key="$route.params.slug"></router-view>
    </transition>
  </div>
</template>

<script>
import Map from './Map.vue';
import Menu from './Menu.vue';
import Popup from './Popup.vue';

export default {
  name: 'Overview',
  props: [],
  components: {
    Map,
    Menu,
    Popup
  },
  data () {
    return {
      cinemas: [],
      clicked: null,
      errored: false,
      cinemasLoaded: false
    }
  },
  methods: {
    onMarkerClicked: function(slug) {
      this.clicked = slug;
    },
    onMenuHovered: function(slug) {
      if(this.$router.currentRoute.name != 'cinemas') {
        this.$router.push({ name: 'cinemas' })
      }
      this.clicked = slug;
    },
    isLandscape() {
      return (document.documentElement.clientWidth > document.documentElement.clientHeight);
    },
  },
  mounted () {
    axios
      .get('/api/cinemas.json')
      .then(response => {
        this.cinemas = response.data
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.cinemasLoaded = true)
  }
}
</script>

<style lang="scss">
@import '../styles/base.scss';

.map-wrapper {
  position: relative;
  overflow: hidden;
  flex: 1 1 100%;

  @media screen and (orientation: landscape) {
    display: flex;
    flex-direction: row;
  }
}
</style>