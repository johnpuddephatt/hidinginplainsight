<template>
  <div class="cinema-panel">
    <div v-if="!cinemaLoaded">
      Loading...
    </div>
    <div v-else>
      <h2>{{ cinema.title }}</h2>
      <p>{{ cinema.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cinema',
  props: ['slug'],
  components: {},
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
          this.cinema = response.data
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => this.cinemaLoaded = true)
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
  padding: ms(2) ms(4);
  top: 3 * ms(1);
  height: calc(100vh - #{3 * ms(1)}) !important;
  left: $sidebar-width;
  right: 0;
  background-color: $cream;
  z-index: 9999;

}
</style>