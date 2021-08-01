<template>
  <div class="popup-container">
    <div class="audio-popup">
      <audio
        :loadedmetadata="initSlider"
        @canplay="audioLoaded = true"
        @pause="pauseListener"
        @ended="endListener"
        preload="auto"
        style="display:none"
        ref="player"
        :id="playerid"
      >
        <source :src="url" type="audio/mpeg" />
      </audio>

      <svg
        @click="toggleAudio()"
        v-show="!isPlaying"
        class="play-button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        @click="toggleAudio()"
        v-show="isPlaying"
        class="play-button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>

      <div class="audio-popup--progress">
        <input
          v-model="playbackTime"
          type="range"
          min="0"
          :max="audioDuration"
          class="audio-popup--slider"
          name="position"
        />

        <div v-show="!audioLoaded">
          &nbsp;Loading...&nbsp;
        </div>

        <div v-show="audioLoaded" class="audio-popup--time">
          <span v-html="elapsedTime()"> 00:00 </span>
          <span v-html="totalTime()"> 00:00 </span>
        </div>

        <svg
          @click="endListener"
          class="stop-button"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="2 1 21 21"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["url", "playerid", "autoplay"],
  /**
   * playbackTime = local var that syncs to audio.currentTime
   * audioDuration = duration of audio file in seconds
   * isPlaying = boolean (true if audio is playing)
   *
   **/
  data() {
    return {
      playbackTime: 0,
      audioDuration: 999,
      audioLoaded: false,
      isPlaying: false,
    };
  },
  methods: {
    //Set the range slider max value equal to audio duration
    initSlider() {
      var audio = this.$refs.player;
      if (audio) {
        this.audioDuration = Math.round(audio.duration);
        audio.addEventListener("canplay", () => {
          this.audioDuration = Math.round(audio.duration);
        });
      }
    },
    //Convert audio current time from seconds to min:sec display
    convertTime(seconds) {
      const format = (val) => `0${Math.floor(val)}`.slice(-2);
      var hours = seconds / 3600;
      var minutes = (seconds % 3600) / 60;
      return [minutes, seconds % 60].map(format).join(":");
    },
    //Show the total duration of audio file
    totalTime() {
      var audio = this.$refs.player;
      if (audio) {
        var seconds = audio.duration;
        return this.convertTime(seconds);
      } else {
        return "00:00";
      }
    },
    //Display the audio time elapsed so far
    elapsedTime() {
      var audio = this.$refs.player;
      if (audio) {
        var seconds = audio.currentTime;
        return this.convertTime(seconds);
      } else {
        return "00:00";
      }
    },
    //Playback listener function runs every 100ms while audio is playing
    playbackListener(e) {
      var audio = this.$refs.player;
      //Sync local 'playbackTime' var to audio.currentTime and update global state
      this.playbackTime = audio.currentTime;
    },
    //Function to run when audio is paused by user
    pauseListener() {
      this.isPlaying = false;
      this.listenerActive = false;
      this.cleanupListeners();
    },
    //Function to run when audio play reaches the end of file
    endListener() {
      this.$emit("audio-ended");
      this.isPlaying = false;
      this.listenerActive = false;
      this.cleanupListeners();
    },
    //Remove listeners after audio play stops
    cleanupListeners() {
      var audio = this.$refs.player;
      if (audio) {
        audio.removeEventListener("timeupdate", this.playbackListener);
        audio.removeEventListener("ended", this.endListener);
        audio.removeEventListener("pause", this.pauseListener);
      }
      //console.log("All cleaned up!");
    },
    toggleAudio() {
      var audio = this.$refs.player;
      //var audio = document.getElementById("audio-player");
      if (audio.paused) {
        audio.play();
        this.isPlaying = true;
      } else {
        audio.pause();
        this.isPlaying = false;
      }
    },
  },
  mounted: function() {
    // nextTick code will run only after the entire view has been rendered
    this.$nextTick(function() {
      var audio = this.$refs.player;

      //Wait for audio to begin play, then start playback listener function
      this.$watch("isPlaying", function() {
        if (this.isPlaying) {
          var audio = this.$refs.player;
          this.initSlider();
          console.log(this.$refs.player.currentSrc);
          this.$gtag.event("Playing audio", {
            event_category: "audio",
            event_label: this.$refs.player.currentSrc,
          });
          //prevent starting multiple listeners at the same time
          if (!this.listenerActive) {
            this.listenerActive = true;
            //for a more consistent timeupdate, include freqtimeupdate.js and replace both instances of 'timeupdate' with 'freqtimeupdate'
            audio.addEventListener("timeupdate", this.playbackListener);
          }
        }
      });
      //Update current audio position when user drags progress slider
      this.$watch("playbackTime", function() {
        var audio = this.$refs.player;
        var diff = Math.abs(this.playbackTime - this.$refs.player.currentTime);

        //Throttle synchronization to prevent infinite loop between playback listener and this watcher
        if (diff > 0.01) {
          this.$refs.player.currentTime = this.playbackTime;
        }
      });

      if (this.autoplay) {
        this.toggleAudio();
      }
    });
  },
};
</script>

<style lang="scss">
@import "../styles/base.scss";

.popup-container {
  z-index: 9999999;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  @media screen and (orientation: landscape) and (min-width: 800px) {
    left: $sidebar-width;
    bottom: ms(2);
  }
}

.audio-popup {
  width: 540px;
  height: 3rem;
  position: relative;
  max-width: 100%;
  border-top: 1px solid $medium-gray;
  background-color: white;
  margin: 0 auto;
  display: flex;
  flex-direction: row;

  @media screen and (orientation: landscape) and (min-width: 800px) {
    box-shadow: $box-shadow;
  }

  &--progress {
    flex: 1;
    display: flex;
    align-items: center;
    padding-right: ms(-4);
  }

  &--time {
    display: flex;
    color: $gray;
    margin: auto ms(-2);
    font-size: ms(-1);

    span {
      display: inline-block;

      + span {
        margin-left: ms(-4);
      }
    }
  }
}

.play-button,
.stop-button {
  height: 3rem;
  width: 3rem;
}

input[type="range"] {
  margin: auto;
  -webkit-appearance: none;
  position: relative;
  overflow: hidden;
  width: 100%;
  cursor: pointer;
  outline: none;
  border-radius: 100px;
  /* iOS */
  background: transparent;
  height: 15px;
}
input[type="range"]:focus {
  outline: none;
}
::-webkit-slider-runnable-track {
  background: transparentize($blue, 0.6);
}
/*
 * 1. Set to 0 width and remove border for a slider without a thumb
 */
::-webkit-slider-thumb {
  position: relative;
  z-index: 99;
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  // width: 0;
  /* 1 */
  // height: 20px;
  background: #fff;
  border: 2px solid black;
  box-shadow: -101vw 0 0 100vw $blue;
  border-radius: 9999px;
  // border: none;
  /* 2px solid #999; */
}
::-moz-range-track {
  height: 15px;
  background: transparentize($blue, 0.6);
}
::-moz-range-thumb {
  background: #fff;
  border: 2px solid black;
  border-radius: 9999px;
  height: 15px;
  width: 15px;
  box-shadow: -100vw 0 0 100vw $blue;
  box-sizing: border-box;
}
::-ms-fill-lower {
  background: $blue;
}
::-ms-thumb {
  background: #fff;
  border: 2px solid #999;
  height: 20px;
  width: 20px;
  box-sizing: border-box;
}
::-ms-ticks-after {
  display: none;
}
::-ms-ticks-before {
  display: none;
}
::-ms-track {
  background: transparentize($blue, 0.6);
  color: transparent;
  height: 20px;
  border: none;
}
::-ms-tooltip {
  display: none;
}
</style>
