<template>
  <div id="app">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
  <StocksComponent/>
  </div>

</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import StocksComponent from './components/StocksComponent.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    StocksComponent
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
