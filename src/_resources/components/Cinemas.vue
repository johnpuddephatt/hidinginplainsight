<template>
  <div class="map-wrapper">
    <transition name="fade">
      <div class="dialog-wrapper" v-if="!confirmedEntrance && siteDataLoaded">
        <div class="dialog">
          <div class="dialog-inner">
            <h3>{{ site.welcome_title }}</h3>
            <p
              v-html="
                site.welcome_message
                  .replace(/(?:\r\n|\r|\n)/g, '<br />')
                  .replace('$number', cinemas.length)
              "
            ></p>
            <button
              class="button is-primary is-large"
              @click="confirmedEntrance = true"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </transition>
    <Menu
      v-if="cinemas"
      :cinemas="cinemas"
      :isLandscape="isLandscape()"
      :clicked="clicked"
      @menu-hovered="onMenuHovered"
    ></Menu>
    <Map
      v-if="cinemas"
      :cinemas="cinemas"
      :clicked="clicked"
      @marker-clicked="onMarkerClicked"
    ></Map>
    <transition name="popup">
      <Popup
        v-for="cinema in cinemas"
        :cinema="cinema"
        @close="clicked = null"
        v-if="clicked == cinema.slug"
        :key="cinema.slug"
      ></Popup>
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

export default {
  name: "Overview",
  props: [],
  components: {
    Map,
    Menu,
    Popup,
  },
  data() {
    return {
      cinemas: [],
      clicked: null,
      errored: false,
      cinemasLoaded: false,
      siteDataLoaded: false,
      confirmedEntrance: false,
    };
  },
  watch: {},
  methods: {
    onMarkerClicked: function(slug) {
      this.clicked = slug;
    },
    onMenuHovered: function(slug) {
      if (this.$router.currentRoute.name != "cinemas") {
        this.$router.push({ name: "cinemas" });
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
      .get("/api/cinemas.json")
      .then((response) => {
        this.cinemas = response.data;
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
</style>
