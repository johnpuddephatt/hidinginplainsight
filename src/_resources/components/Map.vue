<template>
  <l-map
      :zoom="zoom"
      :minZoom="12"
      :center="center"
      :options="mapOptions">
      <l-tile-layer
       :url="url"
       :attribution="attribution"
     />
     <v-icondefault :image-path="'/assets/images/'"></v-icondefault>
     <v-marker-cluster :options="clusterOptions">
      <l-marker v-for="cinema in cinemas" :key="cinema.slug" :lat-lng="getLatLng(cinema.location.coordinates)" @mouseover="mouseoverStart(cinema.slug)" @mouseleave="mouseoverCancel()" @click="$emit('marker-clicked',cinema.slug)">
        <l-popup :content="cinema.title"></l-popup>
        <l-icon :ref="cinema.slug" icon-url="/assets/images/marker-icon.png" />
      </l-marker>
    </v-marker-cluster>
  </l-map>
</template>

<script>

import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { divIcon as DivIcon, point as Point } from "leaflet";
import { latLng } from "leaflet";
import { LIconDefault,LPopup, LIcon, LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

export default {
  name: 'Map',
  props: ['cinemas','hovered'],
  components: {
    'v-icondefault': LIconDefault,
    LPopup,
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data () {
    return {
      currentlyHovered: null,
      zoom: 13,
      center: latLng(53.8125403,-1.5735477),
      // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
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
    hovered: function (hovered) {
      if(hovered) {

        let hoveredMapElement = this.$refs[hovered][0].$el;
        console.log(this.$refs[hovered][0].$el);
        // this.clearActiveMapElement();
        if(hoveredMapElement) {
          // hoveredMapElement.classList.add('active');
          // hoveredMenuElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        }
      }
    }
  },
  methods: {
    getLatLng(value) {
      let newArray = [];
      newArray.push(value[1], value[0]);
      return newArray;
    },
    mouseoverStart(slug) {
      this.currentlyHovered = slug;
      setTimeout(() => {
        if(this.currentlyHovered === slug ) {
          this.$emit('marker-hovered', slug);
        }
      },1000)
    },
    mouseoverCancel() {
      this.currentlyHovered = null;
    }
  },
}
</script>

<style>
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

</style>