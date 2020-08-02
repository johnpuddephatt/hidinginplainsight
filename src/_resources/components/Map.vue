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
    <v-marker-cluster :options="clusterOptions">
      <l-marker :ref="cinema.slug" v-for="cinema in cinemas" :key="cinema.slug" :lat-lng="getLatLng(cinema.location.coordinates)" @click="markerClicked($event, cinema.slug)">
        <l-popup :options="{offset: [0, -34], closeButton: false}">
          <div class="popup-header">
            <h3 class="cinema-title" v-html="cinema.title"></h3>
            <p class="cinema-address">{{ cinema.address }}</p>
          </div>
          <div class="popup-footer">
            <button class="button" v-if="" @click="currentPopup.closePopup()">Close</button>
            <router-link class="button is-primary" :to="{ name: 'cinema', params: { slug: cinema.slug } }">View</router-link>
          </div>
        </l-popup>
        <l-icon icon-url="/assets/images/marker-icon.png" />
      </l-marker>
    </v-marker-cluster>
  </l-map>

</template>

<script>

import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { divIcon as DivIcon, point as Point } from "leaflet";
import { latLng } from "leaflet";
import { LIconDefault,LPopup, LIcon, LMap, LTileLayer, LMarker, LControlZoom } from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

export default {
  name: 'Map',
  props: ['cinemas','clicked'],
  components: {
    'v-icondefault': LIconDefault,
    LPopup,
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LControlZoom,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data () {
    return {
      zoom: 13,
      center: latLng(53.8125403,-1.5735477),
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      mapOptions: {
        zoomSnap: 0.5,
        zoomControl: false
      },
      showMap: true,
      mapActive: false,
      currentPopup: null,
      clusterOptions: {
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
  watch: {
    clicked: function (clicked) {
      if(clicked) {
        if(!this.mapActive) {
          this.$refs.map.mapObject.flyTo(this.$refs[clicked][0].latLng, 17);
          var marker = this.$refs[clicked][0].mapObject;

          this.$refs.map.mapObject.on('zoomend', function () {
            marker.openPopup();
          });
        }

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
    }
  },
}
</script>

<style lang="scss">
  @import '../styles/base.scss';

  .leaflet-container {
    width: 100%;
    height: calc(100% - #{2 * ms(2) + ms(4)}) !important;

    @media screen and (orientation: landscape) {
      width: calc(100vw - #{$sidebar-width}) !important;
      height: 100% !important;
    }
  }


  .leaflet-marker-icon {
    margin-top: -41px !important;
    margin-left: -12px !important;
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
    background-color: rgba(181, 226, 140, 0.5);
  }

  .my-marker-cluster-small div {
    background-color: rgba(110, 204, 57, 1);
  }

  /* Medium */
  .my-marker-cluster-large {
    background-color: rgba(226, 181, 140, 0.5);
  }
  .my-marker-cluster-large div {
    background-color: rgba(226, 181, 140, 1);
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
      padding: ms(0) ms(-1);
      border-radius: 0 !important;
      box-shadow: 13px 19px 12px -7px rgba(0,0,0,0.2) !important;

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
        margin: 0 0 ms(1);
      }
  }

  @media screen and (orientation: portrait) {
    .leaflet-popup {
      display: none;
    }
  }

</style>