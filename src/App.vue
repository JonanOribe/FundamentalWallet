<template>
  <div id="app">
      <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
      <NavBarComponent/>
  <TableInputComponent/>
  <StocksComponent/>
  </div>

</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import NavBarComponent from './components/NavBarComponent.vue'
import StocksComponent from './components/StocksComponent.vue'
import TableInputComponent from './components/TableInputComponent.vue'

export default {
  name: 'App',
  components: {
    //HelloWorld,
    NavBarComponent,
    TableInputComponent,
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
}
</style>
