<template>
  <div class="popup-container">
    <div class="audio-popup">
      <audio @ended="audioEnded" controls ref="audio" id="my-audio">
        <source :src="audio_active" type="audio/mpeg">=
      </audio>
      <!-- <button @click="$refs.audio.play()" id="play">play</button>
      <button @click="$refs.audio.pause()" id="pause">pause</button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Audio',
  props: ['cinema', 'is_tour', 'audio_active'],
  components: {},
  data() {
    return {
    }
  },
  watch: {
    audio_active: function(audio) {
      if(audio) {
        this.$refs.audio.play();
      }
    }
  },
  methods: {
    audioEnded() {
      this.$emit('audio-ended');
    }
  },
  mounted() {
    if(this.audio_active) {
      this.$refs.audio.play();
    }
  }
}
</script>

<style lang="scss">

@import '../styles/base.scss';

#my-audio {
  border-radius: none;
  width: 100%;
  background-color: #f1f3f4;
}

.popup-container {
  z-index: 9999999;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  @media screen and (orientation: landscape) and (min-width: 800px) {
    left: $sidebar-width;
    bottom: ms(-2);
  }
}

.audio-popup {
  width: 640px;
  height: 3rem;
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

}

</style>