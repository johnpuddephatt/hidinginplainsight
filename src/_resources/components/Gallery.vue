<template>
  <div class="gallery-wrapper" v-if="photos">
    <div class="gallery-scroller">
      <div class="gallery-item" v-for="(photo, key) in photos" @click="open = key">
        <img :src="photo.small"/>
      </div>
    </div>

    <transition name="fade">
      <div class="lightbox" v-if="open !== null" @click.stop="open = null" @keydown.esc="open = null" >
          <img :src="photos[open].large"/>
          <div class="lightbox-controls">
            <button class="button" :disabled="open == 0" @click.stop="open--">&larr;</button>
            <button class="button" :disabled="open == (photos.length - 1)"  @click.stop="open++">&rarr;</button>
            <button class="button close-button" @click="open = null">Close</button>
          </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Gallery',
  props: ['photos'],
  components: {
  },
  data() {
    return {
      open: null
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
  },
  mounted() {
      document.addEventListener("keydown", (e) => {
          if (e.keyCode == 27) {
              this.open = null
          }
      });
  },
}
</script>

<style lang="scss">
@import '../styles/base.scss';

.lightbox {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.75);
  z-index: 999;
  padding: ms(0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    max-height: 80%;
    max-width: 100%
  }

  .button {
    display: inline-block;

    &[disabled] {
      background-color: $gray;
      cursor: not-allowed;
    }
  }
}

.lightbox-controls {
  display: flex;
  flex-direction: row;
  max-width: 640px;
  width: 100%;
  margin: ms(0) auto 0;
  .button + .button {
    margin-left: ms(-2);
  }



  .close-button {
    margin-left: auto !important;
  }
}


.gallery-wrapper {
  position: relative;
  margin: ms(-2) (-(ms(-2))) 0;

  &::after,
  &::before {
    content: "";
    pointer-events: none;
    position: absolute;
    display: block;
    left: -1px;
    top: 0;
    height: 100%;
    width: ms(0);
    @media screen and (orientation: landscape) {
      width: ms(2);
    }
    background: linear-gradient(90deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    z-index: 99;
  }

  &::after {
    left: auto;
    right: -1px;
    background: linear-gradient(270deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  }
}

.gallery-scroller {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
  position: relative;
  cursor: grab;

  &.grabbing {
    cursor: grabbing;
  }
}

.gallery-scroller::-webkit-scrollbar {
  height: 0;
}

.gallery-item {
  position: relative;
  user-select: none;
  flex: 0 0 75%;
  overflow: hidden;
  border: solid ms(-2) transparent;
  background-clip: content-box;

  @media screen and (orientation: landscape) {
    flex: 0 0 30%;
    border: solid ms(0) transparent;
  }

  &:hover img {
    opacity: 0.75;
  }

  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
    max-width: none;
    max-height: none;
    transition: opacity 0.5s ease-in-out;
  }

  a {
    pointer-events: auto;
    cursor: pointer;
  }

}
</style>