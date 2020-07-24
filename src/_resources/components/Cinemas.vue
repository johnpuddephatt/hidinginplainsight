<template>
  <div class="map-wrapper">
    <Menu v-if="cinemas" :cinemas="cinemas" :hovered="hovered" @menu-hovered="onMenuHovered"></Menu>
    <Map v-if="cinemas" :cinemas="cinemas"  :hovered="hovered" @marker-clicked="onMarkerClicked" @marker-hovered="onMarkerHovered"></Map>
    <router-view :key="$route.params.slug"></router-view>
  </div>
</template>

<script>
import Map from './Map.vue';
import Menu from './Menu.vue';

export default {
  name: 'Overview',
  props: [],
  components: {
    Map,
    Menu
  },
  data () {
    return {
      cinemas: [],
      hovered: null,
      errored: false,
      cinemasLoaded: false
    }
  },
  methods: {
    onMarkerClicked: function(slug) {
      if(slug != this.$route.params.slug) {
        this.$router.push({ name: 'cinema', params: { slug: slug } })
      }
    },
    onMarkerHovered: function(slug) {
      this.hovered = slug;
    },
    onMenuHovered: function(slug) {
      this.hovered = slug;
    }
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

.map-wrapper {
  display: flex;
  flex-direction: column-reverse;

  @media screen and (orientation: landscape) {
    flex-direction: row;
  }
}
</style>