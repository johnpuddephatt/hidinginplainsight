<template>
  <l-map
    id="map"
    ref="map"
    :zoom="zoom"
    :minZoom="12"
    :center="center"
    :options="mapOptions"
    :inertia="true"
    :zoomAnimation="true"
    :noBlockingAnimations="true"
    @mouseenter="mapActive = true"
    @mouseleave="mapActive = false">
    <l-control-zoom :position="'bottomright'" />
    <l-tile-layer :url="url" :attribution="attribution" />
    <v-icondefault :image-path="'/assets/images/'"></v-icondefault>
    <l-geo-json
        v-if="geojson"
        :geojson="geojson"
        :options-style="{
          weight: 4,
          color: '#d17d47',
          fillOpacity: 0
        }"
      />
    <v-marker-cluster :options="clusterOptions">
      <l-marker :ref="cinema.slug" v-for="cinema in cinemas" :key="cinema.slug" :lat-lng="getLatLng(cinema.location.coordinates)" @click="markerClicked($event, cinema.slug)">
        <l-popup :options="{offset: [0, -34], closeButton: false}">
          <div class="popup-header">
            <h3 class="cinema-title" v-html="cinema.title"></h3>
            <p class="cinema-address" v-if="cinema.address">{{ cinema.address }}</p>
          </div>
          <div class="cinema-audio" v-if="cinema.audio">
            <audio controls :src="cinema.audio" />
          </div>
          <div class="popup-footer">
            <a v-if="tour" class="button" :href="googleMapsDirections(cinema)" target="_blank">Get directions</a>
            <button class="button" v-if="" @click="currentPopup.closePopup()">Close</button>
            <router-link class="button is-primary" :to="tour ? { name: 'tourcinema', params: { slug: cinema.slug } } : { name: 'cinema', params: { slug: cinema.slug } }">View</router-link>
          </div>
        </l-popup>
        <l-icon
          :iconSize="clicked == cinema.slug ? [50,82] : [25,41]"
          :icon-anchor="clicked == cinema.slug ? [25,82] : [12.5,41]"
          :popupAnchor="[0,-37]"
          :className="clicked == cinema.slug ? 'large' : ''"
          :icon-url="clicked == cinema.slug ? '/assets/images/marker-icon-red.svg' : '/assets/images/marker-icon.svg'" />
      </l-marker>
    </v-marker-cluster>
  </l-map>

</template>

<script>

import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { divIcon as DivIcon, point as Point } from "leaflet";
import { latLng } from "leaflet";
import { LIconDefault,LPopup, LIcon, LMap, LTileLayer, LGeoJson, LMarker, LControlZoom } from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

export default {
  name: 'Map',
  props: ['tour','geojson','cinemas','clicked'],
  components: {
    'v-icondefault': LIconDefault,
    LPopup,
    LMap,
    LTileLayer,
    LGeoJson,
    LMarker,
    LIcon,
    LControlZoom,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data () {
    return {
      zoom: this.tour ? 16 : 13,
      center: this.tour ? latLng(53.7993475,-1.5432696) : latLng(53.8125403,-1.5735477),
      // url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      mapOptions: {
        zoomSnap: 0.5,
        zoomControl: false
      },
      showMap: true,
      mapActive: false,
      currentPopup: null,
      clusterOptions: {
        spiderLegPolylineOptions: { weight: 4, color: '#aecdeb', opacity: 0.75 },
        // Create our custom cluster icon replacement with the `iconCreateFunction` api
        // See: https://github.com/Leaflet/Leaflet.markercluster#customising-the-clustered-markers
        iconCreateFunction: cluster => {
          var childCount = cluster.getChildCount();
          return new DivIcon({
            html: "<div><span>" + childCount + "</span></div>",
            className: "marker-cluster my-marker-cluster-" + ((childCount < 6) ? 'small' : 'large'),
            iconSize: new Point(40, 40)
          });
        }
      }
    }
  },
  mounted() {
  },
  computed: {
    styleFunction() {
     return () => {
       return {
         weight: 2,
         color: "#ff0000",
         opacity: 1,
         fillOpacity: 0
       };
     };
    },
  },
  watch: {
    clicked: function (clicked) {
      if((this.$router.currentRoute.name == 'cinemas' || this.$router.currentRoute.name == 'tour') && clicked) {

        // if !mapActive, then we're interacting with the sidebar so should flyTo.
        if(!this.mapActive) {
          this.$refs.map.mapObject.flyTo(this.$refs[clicked][0].latLng, 17);
          var marker = this.$refs[clicked][0].mapObject;
          this.$refs.map.mapObject.on('zoomend', function () {
            marker.openPopup();
          });
        }

        // otherwise map is active, don't flyTo just open the popup
        else {
          this.$refs[clicked][0].mapObject.openPopup();
        }

        this.currentPopup = this.$refs[clicked][0].mapObject;
      }
    }
  },
  methods: {
    getLatLng(value) {
      let newArray = [];
      newArray.push(value[1], value[0]);
      return newArray;
    },

    markerClicked($event, slug) {
      this.$emit('marker-clicked', slug);
      this.currentlyClicked = slug;
    },

    googleMapsDirections: function(cinema) {
      return `https://www.google.com/maps/dir/?api=1&destination=${cinema.location.coordinates[1]}%2C${cinema.location.coordinates[0]}`;
    }
  },
}
</script>

<style lang="scss">
  @import '../styles/base.scss';

  .leaflet-container {
    width: 100%;
    height: auto !important;
    flex: 1;

    @media screen and (orientation: landscape) and (min-width: 800px) {
      width: calc(100vw - #{$sidebar-width}) !important;
      // height: 100% !important;
    }
  }


  .leaflet-marker-icon {
    // margin-top: -41px !important;
    // margin-left: -12.5px !important;
    // width: 25px !important;
    // height: 41px !important;
    //
    // &.large {
    //   width: 50px !important;
    //   height: 82px !important;
    //   margin-top: -82px !important;
    //   margin-left: -25px !important;
    // }
  }

  .marker-cluster,
  .marker-cluster div {
    border-radius: 500px;
  }

  .marker-cluster.active {
    outline: 2px solid yellow;
  }

  .marker-cluster div {
    height: 30px;
    width: 30px;
    margin: 5px;
    text-align: center;
    line-height: 30px;
  }

  /* Small */
  .my-marker-cluster-small {
    background-color: $blue;
    box-shadow: 9px 9px 12px -7px rgba(0,0,0,0.25) !important;
  }

  .my-marker-cluster-small div {
    background-color: white;
  }

  /* Medium */
  .my-marker-cluster-large {
    background-color: darken($blue,15%);
    box-shadow: 9px 9px 12px -7px rgba(0,0,0,0.25) !important;
  }
  .my-marker-cluster-large div {
    background-color: white;
  }

  // Popup
  .leaflet-container a.leaflet-popup-close-button {
    width: 30px;
    height: 24px;
    font: 30px/17px Tahoma, Verdana, sans-serif;
  }

  .leaflet-popup-content-wrapper {
      max-width: $sidebar-width;
      width: 100vw;
      font-size: 1rem !important;
      padding: ms(0) ms(-2);
      border-radius: 0 !important;
      box-shadow: 13px 19px 12px -7px rgba(0,0,0,0.2) !important;

      .cinema-title {
        font-size: ms(1);
        font-weight: 700;
        margin-bottom: 0.25em;
      }

      .cinema-address {
        font-size: ms(-1);
        color: $gray;

        &::before {
          content: '';
          display: inline-block;
          background-image: url(/assets/images/marker-icon-red.svg);
          width: 0.75em;
          height: 1em;
          margin-right: .25em;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: left;
        }
      }

      .cinema-audio {
        audio {
          width: 100%;
          margin-bottom: ms(0);
        }
      }

      p {
        margin: 0 0 ms(1);
      }
  }

  @media screen and (orientation: portrait) {
    .leaflet-popup {
      display: none;
    }
  }
  //
  // .leaflet-overlay-pane svg path {
  //   stroke: $red !important;
  //   fill: transparentize($red, 0.5) !important;
  // }

</style>