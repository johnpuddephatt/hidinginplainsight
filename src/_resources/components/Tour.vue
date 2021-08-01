<template>
  <div class="map-wrapper">
    <transition name="fade">
      <div class="dialog-wrapper" v-if="!confirmedEntrance && siteDataLoaded">
        <div class="dialog text-center">
          <div class="dialog-inner">
            <h3>{{ tour.title }}</h3>
            <div class="dialog-content" v-html="tour.introduction"></div>
            <button
              autofocus
              class="button is-primary is-large"
              @click="confirmedEntrance = true"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="tour-links">
      <div v-for="page in tour.pages" :key="page.slug">
        <button
          class="button has-shadow is-primary"
          @click="currentDialog = page.slug"
        >
          {{ page.name }}
        </button>
        <transition name="fade">
          <div class="dialog-wrapper" v-if="currentDialog == page.slug">
            <div class="dialog">
              <div class="dialog-inner">
                <h3>{{ page.name }}</h3>
                <div class="dialog-content" v-html="page.content"></div>
                <button
                  autofocus
                  class="button is-primary is-large"
                  @click="currentDialog = null"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <Menu
      :audio_active="audio_active"
      :tour_title="tour.title"
      v-if="tour.title"
      :cinemas="tour.stops"
      :isLandscape="isLandscape()"
      :clicked="clicked"
      @menu-hovered="onMenuHovered"
    ></Menu>
    <Map
      :is_tour="true"
      v-if="tour.title"
      :geojson="tour.geojson"
      :poi="tour.poi"
      :cinemas="tour.cinemas"
      :stops="tour.stops"
      :clicked="clicked"
      @marker-clicked="onMarkerClicked"
    ></Map>

    <transition name="popup">
      <Popup
        :secondary_popup_active="audio_active || nextStop"
        :is_tour="true"
        v-for="cinema in tour.cinemas"
        :cinema="cinema"
        @close="clicked = null"
        @start-audio="onStartAudio"
        v-if="clicked == cinema.slug"
        :key="cinema.slug"
      ></Popup>
    </transition>

    <transition name="popup">
      <Popup
        :secondary_popup_active="audio_active || nextStop"
        :is_tour="true"
        v-for="stop in tour.stops"
        :cinema="stop"
        @close="clicked = null"
        @start-audio="onStartAudio"
        v-if="clicked == stop.slug"
        :key="stop.slug"
      ></Popup>
    </transition>

    <transition name="popup">
      <AudioPlayer
        :key="audio_active.slug"
        :autoplay="true"
        v-if="audio_active"
        playerid="1"
        @audio-ended="audioEnded"
        :url="audio_active.audio"
        :is_tour="true"
      ></AudioPlayer>
    </transition>

    <transition name="popup">
      <div class="popup-container" v-if="clicked && nextStop && !audio_active">
        <button @click="clicked = nextStop" class="next-popup">
          Go to the next stop &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="width: 1em; height: 1em"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </transition>

    <transition name="slide">
      <router-view :key="$route.params.slug"></router-view>
    </transition>
  </div>
</template>

<script>
import Map from "./Map.vue";
import Menu from "./Menu.vue";
import Popup from "./Popup.vue";
import AudioPlayer from "./AudioPlayer.vue";

export default {
  name: "Overview",
  props: [],
  components: {
    AudioPlayer,
    Map,
    Menu,
    Popup,
  },
  data() {
    return {
      tour: {},
      currentDialog: null,
      clicked: null,
      errored: false,
      nextStop: null,
      cinemasLoaded: false,
      siteDataLoaded: false,
      confirmedEntrance: false,
      audio_active: null,
    };
  },
  watch: {
    clicked: function(clicked) {
      this.nextStop = null;
    },
  },
  methods: {
    audioEnded() {
      this.audio_active = null;
      this.findNextStop();
    },

    findNextStop() {
      let currentStop = this.tour.stops.findIndex(
        (stop) => stop.slug == this.clicked
      );
      if (currentStop + 1 <= this.tour.stops.length) {
        this.nextStop = this.tour.stops[currentStop + 1].slug;
      }
    },

    // goToStop(stop){
    //   this.clicked = stop;
    //   this.nextStop = null;
    // },

    onStartAudio: function(audio) {
      this.audio_active = audio;

      console.log(audio);
      this.$gtag.event("Playing audio", {
        event_category: "audio",
        event_label: audio,
      });
    },
    onMarkerClicked: function(slug) {
      this.clicked = slug;
    },
    onMenuHovered: function(slug) {
      if (this.$router.currentRoute.name != "tour") {
        this.$router.push({ name: "tour" });
      }
      this.clicked = slug;
    },
    isLandscape() {
      return (
        document.documentElement.clientWidth >
        document.documentElement.clientHeight
      );
    },
  },
  created() {},
  mounted() {
    axios
      .get("/api/site.json")
      .then((response) => {
        this.site = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.siteDataLoaded = true));
    axios
      .get(`/api/tour/${this.$route.params.tourslug}.json`)
      .then((response) => {
        this.tour = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.cinemasLoaded = true));
  },
};
</script>

<style lang="scss">
@import "../styles/base.scss";

.tour-links {
  position: fixed;
  top: 5em;
  right: 2em;
  z-index: 9999999;
  display: flex;
  gap: 0.5em;

  @media (orientation: portrait) {
    top: 0.75em;
    right: 4.5em;
    gap: 0.25em;

    .button {
      font-size: ms(-1);
    }
  }
}

@keyframes popup {
  0% {
    transform: translate(-50%, -40%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
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

.next-popup {
  width: 540px;
  height: 3rem;
  position: relative;
  max-width: 100%;
  border-top: 1px solid $medium-gray;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: $blue;
  font-weight: bold;

  @media screen and (orientation: landscape) and (min-width: 800px) {
    box-shadow: $box-shadow;
  }
}
</style>
