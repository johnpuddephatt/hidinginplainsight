<template>
  <transition name="popup">
    <div class="mobile-popup">
      <div class="popup-header">
        <h3 class="cinema-title" v-html="cinema.title"></h3>
        <p class="cinema-address">{{ cinema.address }}</p>
      </div>
      <div class="popup-footer">
        <button class="button">Close</button>
        <router-link class="button is-primary" :to="{ name: 'cinema', params: { slug: cinema.slug } }">View</router-link>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Popup',
  props: ['cinema'],
  components: {},
  data() {
    return {
    }
  },
  watch: {

  },
  methods: {

  },
  mounted() {}
}
</script>

<style lang="scss">

@import '../styles/base.scss';

.mobile-popup {
  @media screen and (orientation: landscape) {
    display: none;
  }

  border-top: 1px solid $medium-gray;
  position: fixed;
  z-index: 999999;
  background-color: white;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ms(2);
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .cinema-title {
    font-size: ms(1);
    font-weight: 700;
    margin-bottom: 0;
  }

  .cinema-address {
    font-size: ms(-1);
    color: $gray;
  }

  p {
    margin-bottom: 0;
  }

  .popup-footer {
    display: flex;
    margin-left: ms(-2);
  }
}

</style>