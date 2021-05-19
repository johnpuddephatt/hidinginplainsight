<template>
  <div class="map-wrapper">

    <transition name="fade">
      <div class="dialog-wrapper" v-if="!confirmedEntrance && siteDataLoaded">
        <div class="dialog">
          <div class="dialog-inner">
            <h3>{{ tour.title }}</h3>
            <div v-html="tour.introduction"></div>
            <button class="button is-primary is-large" @click="confirmedEntrance = true">Start</button>
          </div>
        </div>
      </div>
    </transition>

    <Menu :audio_active="audio_active" :tour_title="tour.title" v-if="tour.title" :cinemas="tour.stops" :isLandscape="isLandscape()" :clicked="clicked" @menu-hovered="onMenuHovered"></Menu>
    <Map :is_tour="true" v-if="tour.title" :geojson="tour.geojson" :poi="tour.poi" :cinemas="tour.cinemas" :stops="tour.stops" :clicked="clicked" @marker-clicked="onMarkerClicked"></Map>

    <transition name="popup">
      <Popup :audio_active="audio_active" :is_tour="true" v-for="cinema in tour.cinemas" :cinema="cinema" @close="clicked = null" @start-audio="onStartAudio" v-if="clicked == cinema.slug" :key="cinema.slug"></Popup>
    </transition>

    <transition name="popup">
      <Popup :audio_active="audio_active" :is_tour="true" v-for="stop in tour.stops" :cinema="stop" @close="clicked = null" @start-audio="onStartAudio" v-if="clicked == stop.slug" :key="stop.slug"></Popup>
    </transition>

    <transition name="popup">
      <!-- <Audio v-if="audio_active" @audio-ended="audio_active = null" :audio_active="audio_active" :is_tour="true"></Audio> -->
      <AudioPlayer :key="audio_active.slug" :autoplay="true" v-if="audio_active" playerid="1" @audio-ended="audio_active = null" :url="audio_active.audio" :is_tour="true"></AudioPlayer>
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
import Audio from './Audio.vue';
import AudioPlayer from './AudioPlayer.vue';

export default {
  name: 'Overview',
  props: [],
  components: {
    Audio,
    AudioPlayer,
    Map,
    Menu,
    Popup
  },
  data () {
    return {
      tour: {},
      clicked: null,
      errored: false,
      cinemasLoaded: false,
      siteDataLoaded: false,
      confirmedEntrance: false,
      audio_active: null,
    }
  },
  watch: {

  },
  methods: {
    onStartAudio: function(audio) {
      this.audio_active = audio;
    },
    onMarkerClicked: function(slug) {
      this.clicked = slug;
    },
    onMenuHovered: function(slug) {
      if(this.$router.currentRoute.name != 'tour') {
        this.$router.push({ name: 'tour' })
      }
      this.clicked = slug;
    },
    isLandscape() {
      return (document.documentElement.clientWidth > document.documentElement.clientHeight);
    },

  },
  created() {

  },
  mounted () {
    axios
      .get('/api/site.json')
      .then(response => {
        this.site = response.data
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.siteDataLoaded = true)
    axios
      .get(`/api/tour/${this.$route.params.tourslug}.json`)
      .then(response => {
        this.tour = response.data
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

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 9999999999;
  background-color: rgba(255,255,255,0.95);
  padding: ms(8) ms(4);
  border-radius: ms(0);
  animation: popup 1s forwards;
  width: 100%;
  max-width: 680px;
  text-align: center;

  .dialog-inner {
    max-width: 400px;
    margin: 0 auto;
  }

  h3 {
    font-family: mikado;
    font-size: ms(6);
    font-weight: 900;
    font-style: italic;
    margin-bottom: ms(2);
  }

  .button {
    margin-top: ms(3);
  }
}

@keyframes popup {
  0% {
    transform: translate(-50%,-40%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%,-50%);
    opacity: 1;
  }
}

.dialog-wrapper {
  position: fixed;
  z-index: 9999999998;
  background-color: rgba(0,0,0,0.5);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.map-wrapper {
  position: relative;
  overflow: hidden;
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;

  @media screen and (orientation: landscape) and (min-width: 800px) {
    flex-direction: row;
  }
}
</style>