<template>
  <div>
  	<div class="bidCon">
  		<h1>招标书</h1>  		
      <div class="cons" v-for="(item, index) in bidCon" :key="index">
        <span class="title">{{item.title}}</span>
        <span class="img" v-if="item.type"><img :src="item.cons"></span>
        <span v-else class="con">{{item.cons}}</span>
      </div>
  	</div>
  </div>
</template>

<script>
  import { Group, Cell } from 'vux'

  export default {
  	props: {
      bidCons: {
        type: Array, 
        default: [] 
      }
	  },
    components: {
      Group,
      Cell
    },
    data () {
      return {
        bidCon: this.bidCons
      }
    },
    methods: {
    },
    mounted: function () {
	  },
  }
</script>

<style type="text/css" scoped>
	.bidCon{margin: 0 1.2rem;margin-bottom: 1rem;padding: 3rem 2rem;border: 1rem solid #fff;}
	.bidCon > h1{font-size: 1.6rem;color: #000;margin-bottom: 2.5rem;text-align: center;}
  .cons{overflow: hidden;margin-bottom: .5rem;} 
  .bidCon .cons span{font-size: 1.4rem;color: #333;line-height: 2.4rem;float: left;}
  .bidCon .cons .title{width: 33%;text-align: right;}
  .bidCon .cons .con{width: 65%;}
  .bidCon .cons .img{width: 8.4rem;height: 8.4rem;}
</style>
