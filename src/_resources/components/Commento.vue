<template>
  <div>
    <div ref="commento"  id="commento"></div>
  </div>
</template>

<script>
export default {
  name: 'Commento',
  props: ['slug'],
  components: {},
  data() {
    return {
      commentoLoaded: false,
    }
  },

  watch: {
  },

  methods: {
    loadCommento() {
        let commentoScript = document.createElement('script');
        commentoScript.setAttribute('data-page-id', `/cinemas/${this.slug}`);
        commentoScript.setAttribute('data-auto-init', true);
        commentoScript.setAttribute('src', 'https://commento.jdp.org.uk/js/commento.js');
        this.$refs.commento.parentNode.appendChild(commentoScript);
    }
  },

  mounted () {
    setTimeout(() => {
      this.loadCommento();
    }, 1000);
  },
  beforeDestroy() {
    delete window.commento;
  }
}
</script>

<style lang="scss">
@import '../styles/base.scss';
</style>