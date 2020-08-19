<template>
  <div v-if="cinemasLoaded" v-show="imagesAllLoaded" class="loading-wrapper">
    <div ref="loadingInner" class="loading-inner">
      <div class="welcome">
        <p class="pre-title">The Hyde Park Picture House presents</p>
        <h1>Hiding in<br> Plain Sight</h1>
        <p class="post-title">Discovering the lost cinemas of Leeds</p>
        <router-link class="enter-link button is-primary is-large" :to="{ name: 'cinemas'}">Enter</router-link>
      </div>
      <div class="funders">
        <img src="/assets/images/hpph.png"/>
        <img src="/assets/images/lottery.png"/>
        <img src="/assets/images/leedsinspired.png"/>
        <img src="/assets/images/AAAB.png"/>
        <img src="/assets/images/letsdance.png"/>
      </div>
      <div class="double-width no-delay"><img @load="imageLoaded" :src="getCinemaImageBySlug('showcase-cinema-de-lux')"></div>
      <div class="double-width no-delay"><img @load="imageLoaded" :src="getCinemaImageBySlug('princess-theatre')"></div>
      <div class="no-delay"><img @load="imageLoaded" :src="getCinemaImageBySlug('star-cinema')"></div>
      <div class="double-width no-delay"><img @load="imageLoaded" :src="getCinemaImageBySlug('savoy-cinema')"></div>
      <div class="double-height no-delay"><img @load="imageLoaded" :src="getCinemaImageBySlug('rex-cinema')"></div>
      <div class="no-delay"><img @load="imageLoaded" :src="getCinemaImageBySlug('ritz-cinema')"></div>
      <div class="no-delay"><img @load="imageLoaded" :src="getCinemaImageBySlug('pudsey-picture-house')"></div>
      <div class="double-width"><img @load="imageLoaded" :src="getCinemaImageBySlug('capitol')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('scala')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('shaftesbury-cinema')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('strand-cinema')"></div>
      <div class="double-width"><img @load="imageLoaded" :src="getCinemaImageBySlug('odeon-merrion-centre')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('news-theatre')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('malvern-picture-palace')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('theatre-de-luxe')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('abbey-picture-house')"></div>
      <div class="double-width"><img @load="imageLoaded" :src="getCinemaImageBySlug('hyde-park-picture-house')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('olympia-picture-hall')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('newtown-picture-palace')"></div>
      <div class="double-height"><img @load="imageLoaded" :src="getCinemaImageBySlug('kingsway-cinema')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('tivoli-cinema')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('majestic-cinema')"></div>
      <div class="double-width"><img @load="imageLoaded" :src="getCinemaImageBySlug('cosy-cinema')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('tower-cinema')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('lyric-picture-house')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('electra-lounge-cinema')"></div>
      <div class="double-width"><img @load="imageLoaded" :src="getCinemaImageBySlug('lyceum-picture-house')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('palace-picture-hall')"></div>
      <div class="double-height"><img @load="imageLoaded" :src="getCinemaImageBySlug('the-coliseum')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('paramount-theatre')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('victoria-picture-hall')"></div>
      <div class="double-width"><img @load="imageLoaded" :src="getCinemaImageBySlug('haddon-hall-picture-house')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('odeon-luxe')"></div>
      <div></div>
      <div class="double-height"><img @load="imageLoaded" :src="getCinemaImageBySlug('empire-palace-theatre')"></div>
      <div></div>
      <div class="double-width"><img @load="imageLoaded" :src="getCinemaImageBySlug('imperial-picture-house')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('western-talkie-theatre')"></div>
      <div><img @load="imageLoaded" :src="getCinemaImageBySlug('victory-picture-palace')"></div>
      <div></div>
      <div class="double-width"><img @load="imageLoaded" :src="getCinemaImageBySlug('holbeck-picture-house')"></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  <loading class="loading-panel__home" v-else></loading>


</template>

<script>
import inView from '../inc/inView';
import Loading from './Loading.vue';

export default {
  name: 'Intro',
  props: [],
  components: {
    Loading
  },
  data () {
    return {
      cinemas: [],
      cinemasLoaded: false,
      imagesAllLoaded: false,
      errored: false,
      imagesLoaded: 0,
      calculatedRowHeight: null
    }
  },
  watch: {
    imagesLoaded: function (count) {
      if(count == 38) {
        this.imagesAllLoaded = true;
        this.$refs.loadingInner.classList.add('animate');
        inView('.loading-inner div', 0.5);
      }
    }
  },
  mounted() {

    axios
      .get('/api/cinemas.json')
      .then(response => {
        this.cinemas = response.data
      })
      .catch(error => {
        this.errored = true
      })
      .finally(() => {
        this.cinemasLoaded = true;

        var ua = window.navigator.userAgent;
        var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        var iOSSafari = iOS && !ua.match(/CriOS/i);

        if(iOSSafari) {
          this.$nextTick(() => {
            let loadingInner = document.querySelector('.loading-inner');
            this.calculatedRowHeight = document.body.clientHeight/9;
            loadingInner.style.gridAutoRows = `${this.calculatedRowHeight}px`;
          });
        }
      });


  },
  methods: {
    getCinemaImageBySlug(slug) {
      let cinema = this.cinemas.filter(cinema => cinema.slug == slug)[0];
      return cinema.image_thumb ;
    },
    imageLoaded($event) {
      this.imagesLoaded++;
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/base.scss';

  .loading-panel__home {
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background-color: white;
    z-index: 99999999;
  }

  .loading-wrapper {
    position: fixed !important;
    top: 0;
    left: 0;
    border: 0.5vw solid white;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
    height: -webkit-fill-available;
    width: 100vw;
    overflow: hidden;
    background-color: white;
    z-index: 99999999;
  }

  .loading-inner {
    &.animate {
      animation: downScroll 6s forwards cubic-bezier(.11,0,.92,.98);

      @media screen and (orientation: landscape) and (min-width: 800px) {
        animation: sideScroll 7s forwards cubic-bezier(.11,0,.92,.98);
      }
    }
    position: absolute;
    display: grid;
    top: 0;
    grid-auto-rows: 11.11vh;
    grid-template-columns: repeat(5, 11.11vh);
    grid-auto-flow: row dense;

    @media screen and (orientation: landscape) and (min-width: 800px) {
      top: auto;
      bottom: auto;
      direction: rtl;
      right: 0;
      grid-auto-columns: 10vw;
      grid-auto-rows: none;
      grid-template-columns: none;
      grid-template-rows: repeat(5, 10vw);
      grid-auto-flow: column dense;
    }

    &.intersection-observer-active {
      div {
        opacity: 0;
        transition: opacity 0s ease-in;
        transition-delay: 0s;
      }
    }

    div {
      position: relative;
      border: 0.5vw solid white;
      transition: opacity 0.75s ease-in;
      transition-delay: 0s !important;

      img {
        position: absolute;
        top: 10%;
        left: 10%;
        right: 10%;
        bottom: 10%;
        height: 80% ;
        width: 80%;
        object-position: center;
        object-fit: contain;
        image-rendering: pixelated;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: -moz-crisp-edges;
      }

      &.out-of-view {
        transition: opacity 0s ease-in;
        opacity: 0;
      }

      &.double-height {
        grid-row-end: span 2;
      }

      &.double-width {
        grid-column-end: span 2;
      }

      &:nth-child(12n + 4),
      &:nth-child(12n + 7),
      &:nth-child(12n + 11){
        background-color: $blue;
      }

      &:nth-child(12n + 2),
      &:nth-child(12n + 6),
      &:nth-child(12n + 10){
        background-color: $orange;
      }

      &:nth-child(12n + 1),
      &:nth-child(12n + 12),
      &:nth-child(12n + 5),
      &:nth-child(12n + 9){
        background-color: $cream;
      }

      &:nth-child(12n + 8),
      &:nth-child(12n + 3){
        background-color: $red;
      }

      &.no-delay {
        transition-delay: 0s !important;
        opacity: 1 !important;
      }

      &:empty {
        opacity: 0 !important;
      }

      &:nth-child(4n + 2) {
        transition-delay: .2s
      }
      &:nth-child(4n + 3) {
        transition-delay: .8s
      }
      &:nth-child(4n + 4) {
        transition-delay: 1.6s
      }

      &.welcome {
        direction: ltr;
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        align-items: center;
        grid-column-end: span 3;
        grid-column-start: 2;
        grid-row-start: 3;
        grid-row-end: span 5;
        background-color: white !important;
        padding: ms(-2);
        transition: all 0.75s 2s ease-in;
        transition-delay: 2s !important;
        transform: translateY(#{ms(-4)});

        &.in-view {
          transform: scale(1);
        }

        @media screen and (orientation: landscape) and (min-width: 800px) {
          grid-column-end: span 6;
          grid-column-start: 3;
          grid-row-start: 2;
          grid-row-end: span 3;
          transition-delay: 1.5s !important;
        }

        h1 {
          font-family: mikado;
          font-weight: 900;
          font-style: italic;
          margin-bottom: ms(-4);
          font-size: ms(4);
          @media screen and (orientation: landscape) and (min-width: 800px) {
            font-size: ms(8);
          }
          @media screen and (min-width: 1400px) {
              font-size: ms(10);
          }

        }

        .post-title {
          margin-top: ms(0);
          margin-bottom: 0;
          font-size: ms(-1);
          max-width: 12em;
          @media screen and (orientation: landscape) and (min-width: 800px) {
            max-width: none;
            font-size: ms(0);
          }
          line-height: 1.2;
        }

        .pre-title {
          // color: $gray;
          font-size: ms(-3);
          margin-top: ms(0);
          margin-bottom: ms(-2);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          @media screen and (orientation: landscape) and (min-width: 800px) {
            font-size: ms(-1);
          }
        }
      }
      &.funders {
        text-align: center;
        direction: ltr;
        display: flex;
        background-color: $cream;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding: ms(-4);
        grid-column-end: span 5;
        grid-column-start: 1;
        grid-row-start: 9;
        grid-row-end: span 1;
        transition: all 1s 2.25s ease-in;
        @media screen and (orientation: landscape) and (min-width: 800px) {
          padding: ms(0) ms(2);
          grid-column-end: span 4;
          grid-column-start: 4;
          grid-row-start: 5;
          grid-row-end: span 1;
          transition: all 0.75s 2.5s ease-in;
        }

        img {
          position: static;
          display: block;
          width: 3.5em;
          height: auto;
          flex: 0 1 16%;
          image-rendering: auto;

          @media screen and (orientation: landscape) and (min-width: 800px) {
            width: 5em;
          }
        }
      }
    }

    .enter-link {
      display: inline-block;
      margin-top: ms(2);
      font-weight: 700;

      // &::after {
      //   display: inline-block;
      //   margin-left: .5em;
      //   content: '→';
      // }
    }
  }


  @keyframes sideScroll {
    0% {
      transform: translateX(100%)
    }
    100% {
      transform: translateX(0%)
    }
  }

  @keyframes downScroll {
    0% {
      transform: translateY(-100%)
    }
    100% {
      transform: translateY(0%)
    }
  }

</style>