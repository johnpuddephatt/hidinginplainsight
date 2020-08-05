<template>
  <div class="mobile-popup">
    <div class="image">
      <img v-if="cinema.image_small" :src="cinema.image_small" />
      <span v-else>?</span>
    </div>
    <div class="popup-header">
      <h3 class="cinema-title" v-html="cinema.title"></h3>
      <p v-if="cinema.address" class="cinema-address">{{ cinema.address }}</p>
    </div>
    <div class="popup-footer">
      <button @click="$emit('close')" class="button">Close</button>
      <router-link class="button is-primary" :to="{ name: 'cinema', params: { slug: cinema.slug } }">View</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: ['cinema'],
  components: {},
  data() {
    return {
    }
  },
  watch: {

  },
  methods: {

  },
  mounted() {}
}
</script>

<style lang="scss">

@import '../styles/base.scss';

.mobile-popup {
  @media screen and (orientation: landscape) {
    display: none;
  }

  border-top: 1px solid $medium-gray;
  position: fixed;
  z-index: 999999;
  background-color: white;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ms(0);
  margin: 0;
  display: flex;
  flex-direction: row;

  .image {
    flex: 0 0 75px;
    display: block;
    width: 75px;
    height: 75px;
    background-color: $cream;
    margin-right: ms(-1);
    padding-top: 10px;
    position: relative;

    img {
      margin-left: auto;
      margin-right: auto;
      object-fit: contain;
      object-position: center;
      display: block;
      height: 100%;
      image-rendering: -webkit-optimize-contrast;
    }

    span {
      font-size: ms(3);
      color: $red;
      font-weight: 700;
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }

  .cinema-title {
    font-size: ms(1);
    font-weight: 700;
    margin-bottom: ms(-4);
  }

  .cinema-address {
    font-size: ms(-1);
    line-height: 1;
    color: $gray;
    margin-left: 0.75em;

    &::before {
      content: '';
      display: inline-block;
      background-image: url(/assets/images/marker-icon-red.svg);
      width: 0.75em;
      margin-left: -1em;
      height: 1.25em;
      margin-right: .25em;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: left bottom;
    }
  }

  p {
    margin-bottom: 0;
  }

  .popup-footer {
    margin-left: auto;
    padding-left: ms(-2);

    .button {
      display: block;
      text-align: center;
    }

    .button + .button {
      margin-top: ms(-8);
    }
  }
}

</style>