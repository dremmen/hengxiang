<template>
  <div>
    <router-view></router-view>
    <foot-components></foot-components>
  </div>
</template>

<script>
import footComponents from '../components/footComponents'

  export default {
    components: {
    	footComponents
    }
  }
</script>

<style type="text/css">
</style>
