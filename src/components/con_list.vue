<template>
  <div>
  	<div class="con_list" v-for="(item, index) in list" :key="index">
  		<p v-show="item.title">{{item.title}}</p>  		
	    <group v-for="(cons, indexs) in item.cons" :key="indexs">
	      <cell :title="cons.title" :value="cons.con" is-link></cell>
	    </group>
	    <router-link to="/">{{item.status}}</router-link>
  	</div>
  </div>
</template>

<script>
  import { Group, Cell } from 'vux'

  export default {
  	props: {
	    listArry: {
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
      	list: this.listArry
      }
    },
    methods: {
    },
    mounted: function () {
	  },
  }
</script>

<style type="text/css" scoped>
	.con_list{padding: 0 1.2rem;overflow: hidden;border-bottom: 1rem solid #f0f0f0;}
	.con_list > p{line-height: 4.4rem;font-size: 1.6rem;color: #5e5e5e;background-color: #fff;border-bottom: .05rem solid #eee;color: #333;}
	.con_list>a{float: right;height: 2.5rem;background-color: #3cc3bf;color: #fff;font-size: 1.4rem;text-align: center;line-height: 2.5rem;border-radius: 10000px;margin: 1rem 0;padding: 0 3rem;text-decoration-line: none;}
</style>
