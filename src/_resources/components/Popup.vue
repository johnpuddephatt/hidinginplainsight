<template>
  <div class="popup-container" :class="{'audio-active': audio_active   }">
    <div class="mobile-popup">
      <div class="image">
        <img v-if="cinema.image_small" :src="cinema.image_small" />
        <span v-else>?</span>
      </div>
      <div class="popup-text">
        <div class="popup-header">
          <button @click="$emit('close')" aria-label="Close popup" class="close-button">&times;</button>
          <h3 class="cinema-title" v-html="cinema.title"></h3>
          <p v-if="cinema.address" class="cinema-address">{{ cinema.address.split(',')[0] }}</p>
        </div>
        <div class="popup-footer">
          <router-link class="" :to="{ name: 'cinema', params: { slug: cinema.slug } }">View</router-link>
          <button v-if="is_tour && cinema.audio" @click="$emit('start-audio', cinema.audio)">Play audio</button>
          <a v-if="is_tour && cinema.location" target="_blank" :href="googleMapsDirections(cinema)">Get directions</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: ['cinema', 'is_tour', 'audio_active'],
  components: {},
  data() {
    return {
    }
  },
  watch: {

  },
  methods: {
    googleMapsDirections: function(cinema) {
      return `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${cinema.location.coordinates[1]}%2C${cinema.location.coordinates[0]}`;
    }
  },
  mounted() {}
}
</script>

<style lang="scss">

@import '../styles/base.scss';

.popup-container {
  z-index: 999999;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transition: transform 0.5s, bottom 0.5s;
  
  @media screen and (orientation: landscape) and (min-width: 800px) {
    left: $sidebar-width;
    bottom: ms(-2);
  }

  &.audio-active {
    bottom: 3rem;
    @media screen and (orientation: landscape) and (min-width: 800px) {
    bottom: calc(#{ms(-2)} + 3rem);
    }
  }
}

.mobile-popup {
  width: 800px;
  position: relative;
  max-width: 100%;
  border-top: 1px solid $medium-gray;
  background-color: white;
  margin: 0 auto;
  @media screen and (orientation: landscape) and (min-width: 800px) {
    box-shadow: $box-shadow;
  }
  display: flex;
  flex-direction: row;

  .image {
    flex: 0 0 100px;
    display: block;
    width: 100px;
    height: 100px;
    background-color: $cream;
    position: relative;

    img {
      margin-left: auto;
      margin-right: auto;
      object-fit: contain;
      object-position: center;
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

  .cinema-title {
    font-size: ms(1);
    font-weight: 700;
  }

  .cinema-address {
    font-size: ms(-1);
    line-height: 1;
    color: $gray;
    margin-left: 0.75em;

    &::before {
      content: '';
      display: inline-block;
      background-image: url(/assets/images/marker-icon-red.svg);
      width: 0.75em;
      margin-left: -1em;
      height: 1.25em;
      margin-right: .25em;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: left bottom;
    }
  }

  p {
    margin-bottom: 0;
  }

  .close-button {
    position: absolute;
    right: ms(-3);
    top: 0;
    font-size: ms(2);
    color: $gray;
  }

  .popup-text {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .popup-header {
    padding: ms(-1) ms(-2) ms(-3);
  }

  .popup-footer {
    margin-top: auto;
    border-top: 1px solid $light-gray;
    font-size: ms(-1);
    display: flex;
    flex-direction: row;

    > * {
      padding: ms(-3) ms(-4);
      flex: 1 1 auto;
      text-align: center;
      color: $gray;

      + * {
        border-left: 1px solid $light-gray;
      }
    }

    .button {
      display: block;
      text-align: center;
    }
  }
}

</style>