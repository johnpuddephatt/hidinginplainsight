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
        console.log('initialising...');
        let commentoScript = document.createElement('script');
        commentoScript.setAttribute('data-page-id', `/cinema/${this.slug}`);
        commentoScript.setAttribute('data-auto-init', true);
        commentoScript.setAttribute('src', 'https://commento.letsdance.agency/js/commento.js');
        this.$refs.commento.parentNode.appendChild(commentoScript);
    }
  },

  mounted () {
    this.loadCommento();
  },
  beforeDestroy() {
    delete window.commento;
  }
}
</script>

<style lang="scss">
@import '../styles/base.scss';
</style>