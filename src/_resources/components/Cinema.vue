<template>
  <div class="cinema-panel">
    <div v-if="!cinemaLoaded">
      Loading...
    </div>
    <div v-else>
      <img :src="cinema.image" />
      <h2>{{ cinema.title }}</h2>
      <div v-html="cinema.description"></div>
      <details v-if="cinema.description_extended">
        <summary>Details</summary>
        <div v-html="cinema.description_extended"></div>
      </details>
      <commento :slug="slug"></commento>
    </div>
  </div>
</template>

<script>
import Commento from './Commento.vue';

export default {
  name: 'Cinema',
  props: ['slug'],
  components: {
    Commento
  },
  data() {
    return {
      cinemaLoaded: false,
      cinema: {},
      errored: false
    }
  },
  watch: {
    slug: function (slug) {
      this.getCinema(slug)
    }
  },
  methods: {
    getCinema(slug) {
      axios
        .get(`/api/cinema/${ slug }.json`)
        .then(response => {
          this.cinema = response.data;
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => {
          this.cinemaLoaded = true;
        })
    }
  },
  mounted () {
    this.getCinema(this.slug);
  }
}
</script>

<style lang="scss">
@import '../styles/base.scss';

.cinema-panel {
  position: fixed;
  overflow-y: auto;
  padding: ms(2) ms(4);
  top: 3 * ms(1);
  height: calc(100vh - #{3 * ms(1)}) !important;
  left: $sidebar-width;
  right: 0;
  background-color: $cream;
  z-index: 9999;

}
</style>