<template>
    <div class="cinema-panel">
      <loading v-if="!cinemaLoaded"></loading>
      <div v-else class="container">
        <router-link class="back-link" :to="{ name: 'cinemas'}">&larr; Back to map</router-link>
        <div v-if="cinema.image" class="image-container">
          <transition name="slide-from-right">
            <img :class="imageClass" v-show="isImageLoaded ":src="cinema.image" @load="imageLoaded($event)" />
          </transition>
        </div>
        <div class="panel">
          <h2 class="cinema-title"><span>{{ cinema.title }}</span> <small>{{ cinema.date_open || 'unknown' }} – {{ cinema.date_close || 'unknown'}}</small></h2>
          <a target="_blank" :href="googleMapsLink" v-if="cinema.address" class="cinema-address">{{ cinema.address }}</a>
          <div class="cinema-description" v-html="cinema.description"></div>
          <details v-if="cinema.description_extended">
            <summary>Read more</summary>
            <div class="summary-content" v-html="cinema.description_extended"></div>
          </details>
        </div>
        <!-- <div class="panel">
          <h3 class="panel-heading">Photos</h3>
        </div> -->
        <div class="panel">
          <h3 class="panel-heading">Share your memories</h3>
          <commento :slug="slug"></commento>
        </div>
      </div>
    </div>
</template>

<script>
import Commento from './Commento.vue';
import Loading from './Loading.vue';

export default {
  name: 'Cinema',
  props: ['slug'],
  components: {
    Commento,
    Loading
  },
  data() {
    return {
      cinemaLoaded: false,
      cinema: {},
      errored: false,
      isImageLoaded: false,
      imageClass: null
    }
  },
  watch: {
    slug: function (slug) {
      this.getCinema(slug)
    }
  },
  computed: {
    googleMapsLink: function() {
      return `https://www.google.com/maps/search/?api=1&query=${this.cinema.location.coordinates[1]},${this.cinema.location.coordinates[0]}`;
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
    },
    imageLoaded($event) {
      let ratio = $event.target.naturalWidth/$event.target.naturalHeight;
      console.log(ratio);
      if(ratio >= 1.6) {
        this.imageClass = 'is-x-wide';
      }
      else if(ratio >= 1.35) {
        this.imageClass = 'is-wide';
      }
      else if(ratio <= 0.5) {
        this.imageClass = 'is-x-tall';
      }
      else if(ratio <= 0.8) {
        this.imageClass = 'is-tall';
      }
      else {
        this.imageClass = 'is-square';
      }
      this.isImageLoaded = true;
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
  left: 0;
  position: absolute;
  overflow-y: auto;
  padding: 0 ms(2) ms(2);
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999999;
  background-color: white;

  @media screen and (orientation: landscape) {
    padding: 0 ms(4) ms(2);
    left: $sidebar-width;
  }

  .container {
    max-width: 800px;
    margin: ms(8) auto;
  }

  .panel {
    margin-top: ms(0);
    padding-top: ms(0);
    border-top: 1px solid $medium-gray;
    @media screen and (orientation: landscape) {
      margin-top: ms(4);
      padding-top: ms(4);
    }
  }

  .panel-heading {
    font-size: ms(2);
    font-weight: 700;
  }

  .cinema-title {
    font-size: ms(3);
    @media screen and (orientation: landscape) {
      font-size: ms(5);
    }
    font-weight: 700;
    margin-bottom: 0;

    span {
      @media screen and (orientation: landscape) {
        display: inline-block;
        margin-right: ms(1);
      }
    }

    small {
      font-weight: 400;
      display: block;
      color: $gray;
      font-size: ms(2);
      vertical-align: baseline;
      @media screen and (orientation: landscape) {
        display: inline-block;
      }
    }
  }

  .cinema-address {
    font-size: ms(0);
    margin-top: ms(-4);

    &::before, &::after {
      content: '';
      display: inline-block;
      background-image: url(/assets/images/marker-icon-red.svg);
      width: 0.75em;
      height: 1em;
      margin-right: .25em;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: left bottom;
    }

    &::after {
      background-image: url(/assets/images/external_link.svg);
      margin-left: 0.25em;
    }
  }

  .cinema-description {
    margin-top: ms(2);
    margin-bottom: ms(2);
  }

  .image-container {
    position: relative;
    background-image: linear-gradient(to top, $blue 30%, white 30%);
    margin-bottom: ms(2);
    padding-bottom: ms(4);
    height: calc(100vw - #{2 * ms(2)});
    @media screen and (orientation: landscape) {
      height: 0.5 * 800px;
      background-image: linear-gradient(to top, $blue 40%, white 40%);
    }

    img {
      margin: 0 auto;
      height: 100%;
      width: 75vw;
      object-fit: contain;
      object-position: center bottom;

      @media screen and (orientation: landscape) {
        height: 0.5 * 800px;
        width: 0.5 * 800px;
        padding-bottom: ms(2);
      }
      &.is-square {

        @media screen and (orientation: landscape) {
          padding-left: ms(6);
          padding-right: ms(6);
        }
      }

      &.is-x-wide {
        width: calc(100vw - 3 * ms(2));

        @media screen and (orientation: landscape) {
          width: 0.65 * 800px;
        }
      }

      &.is-x-tall {
        // height: 60vw;

        @media screen and (orientation: landscape) {
          height: 0.575 * 800px;
          transform: translateY(#{-0.075 * 800px});
        }
      }
    }
  }
}

summary {
  cursor: default;
  padding-right: 1em;
  display: inline-block;
  font-weight: 700;
  &:focus {
    outline: 2px solid $medium-gray;
  }
}

.summary-content {
  margin-top: ms(-2);
}

.back-link {
  color: $gray;
  display: inline-block;

  @media screen and (orientation: portrait) {
    margin-bottom: ms(0);
  }
}
</style>