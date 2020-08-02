<template>
  <div class="loading-wrapper">
    <div class="loading-inner">
      <div class="welcome">
        <h1>Hiding in<br> Plain Sight</h1>
        <p>Discovering the lost cinemas of Leeds</p>
        <router-link class="enter-link" :to="{ name: 'cinemas'}">Enter</router-link>
      </div>
      <div class=""></div>
      <div class="double-width no-delay"></div>
      <div></div>
      <div></div>
      <div class="double-height"></div>
      <div></div>
      <div></div>
      <div class="double-width"></div>
      <div></div>
      <div></div>
      <div></div>
      <div class="double-width"></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div class="double-width"></div>
      <div></div>
      <div></div>
      <div class="double-height"></div>
      <div></div>
      <div></div>
      <div class="double-width"></div>
      <div></div>
      <div></div>
      <div></div>
      <div class="double-width"></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div class="double-width"></div>
      <div></div>
      <div class="empty"></div>
      <div class="double-height"></div>
      <div class="empty"></div>
       <div class="double-width"></div>
      <div></div>
      <div></div>
      <div class="empty"></div>
      <div class="double-width"></div>
      <div class="empty"></div>
      <div class="empty"></div>
    </div>
  </div>
</template>

<script>
import inView from '../inc/inView';

export default {
  name: 'Loading',
  props: [],
  components: {
  },
  data () {
    return {
      value: 'foo'
    }
  },
  mounted() {
    inView('.loading-inner div', 0.5);
  }
}
</script>

<style lang="scss">
  @import '../styles/base.scss';

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
    width: 100vw;
    overflow: hidden;
    background-color: white;
  }

  .loading-inner {
    position: absolute;
    display: grid;
    top: 0;
    grid-auto-rows: 14.28vh;
    grid-template-columns: repeat(4, 14.28vh);
    grid-auto-flow: row dense;
    animation: downScroll 8s forwards cubic-bezier(.11,0,.92,.98);
    transform: translateY(-105%);

    @media screen and (orientation: landscape) {
      top: auto;
      bottom: auto;
      direction: rtl;
      right: 0;
      grid-auto-columns: 10vw;
      grid-auto-rows: none;
      grid-template-columns: none;
      grid-template-rows: repeat(5, 10vw);
      grid-auto-flow: column dense;
      animation: sideScroll 8s forwards cubic-bezier(.11,0,.92,.98);
      transform: translateX(105%);
    }


    div {
      position: relative;
      border: 0.5vw solid white;
      opacity: 0;
      transition: opacity 0.5s ease-in;

      &::after {
        position: absolute;
        top: 10%;
        left: 10%;
        right: 10%;
        bottom: 10%;
        content: "";
        background-image: url('https://res.cloudinary.com/hpph/image/upload/v1595964823/hidinginplainsight/abbeypicturehouse.svg');
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
      }

      &.in-view {
        opacity: 1;

        &::after {
          opacity: 1;
        }
      }

      &.double-height {
        grid-row-end: span 2;
      }

      &.double-width {
        grid-column-end: span 2;
      }

      &:nth-child(12n + 1),
      &:nth-child(12n + 4),
      &:nth-child(12n + 7),
      &:nth-child(12n + 11){
        background-color: #FEF8E3;
      }

      &:nth-child(12n + 2),
      &:nth-child(12n + 6),
      &:nth-child(12n + 10){
        background-color: #FCD88E;
      }

      &:nth-child(12n + 12),
      &:nth-child(12n + 5),
      &:nth-child(12n + 9){
        background-color: #AED3EE;
      }

      &:nth-child(12n + 8),
      &:nth-child(12n + 3){
        background-color: #EB7841;
      }

      &.empty {
        opacity: 0 !important;
      }

      &.empty::after {
        display: none;
      }

      &.no-delay {
        transition-delay: 0 !important;
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
        grid-column-end: span 4;
        grid-column-start: 1;
        grid-row-start: 3;
        grid-row-end: span 3;
        background-color: white !important;
        transition-delay: 3.5s;

        @media screen and (orientation: landscape) {
          grid-column-end: span 6;
          grid-column-start: 3;
          grid-row-start: 2;
          grid-row-end: span 3;
        }

        &::after {
          content: none;
        }

        h1 {
          font-family: mikado;
          font-weight: 900;
          font-style: italic;
          font-size: ms(9);
          margin-bottom: ms(1);
        }
      }
    }

    .enter-link {
      display: inline-block;
      margin-top: 1em;
      font-weight: 700;
      font-size: ms(2);

      &::after {
        display: inline-block;
        margin-left: .5em;
        content: '→';
      }
    }
  }


  @keyframes sideScroll {
    100% {
      transform: translateX(0%)
    }
  }

  @keyframes downScroll {
    100% {
      transform: translateY(0%)
    }
  }

</style>