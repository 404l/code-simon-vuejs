<template>
  <div id="app">
    <SimonGame/>
  </div>
</template>

<script>
import SimonGame from './components/SimonGame.vue';

export default {
  name: 'App',

  components: {
    SimonGame,
  },
};
</script>

<style lang="scss">
  body, p, h1, h2, h3, h4, h5, h6, ul, li {
    margin: 0; padding: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    font-size: 1em;
  }
  * {
    box-sizing: border-box;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: fit-content;
    margin: 0 auto;
    border: 1px solid #000;
    border-radius: 4px;
    padding: 8px;
  }
</style>
