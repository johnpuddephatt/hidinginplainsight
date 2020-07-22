<template>
  <div id="app">
    <h1>{{ value }}</h1>
  <router-link :to="{ name: 'cinemas'}">Enter</router-link>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: [],
  components: {
  },
  data () {
    return {
      value: 'foo'
    }
  }
}
</script>

<style>
</style>