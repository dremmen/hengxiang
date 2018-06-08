<template>
  <div class="evaluate">
  	<div class="evaluate_con" v-for="(evaluate, index) in evaluate_obj" :key="index">
  		<div class="evaluate_top">
	    	<span class="img"><img :src="baseURL+'/'+evaluate.deval_designer_image"></span>
	    	<span class="name">{{evaluate.deval_designer_name}}</span>
	    	<rater :max="5" active-color="#3cc3bf" disabled v-model="evaluate.deval_scores"></rater>
	    	<span class="time">{{evaluate.time}}</span>
  		</div>
  		<p>{{evaluate.deval_content}}</p>
  		<div class="evaluate_img" v-if="(evaluate.geval_image_small)">
  			<img v-for="(item, index) in evaluate.geval_image_small" :key="index" :src="item">
  		</div>
  	</div>
  </div>
</template>

<script>
	import { Rater } from 'vux'
	import { baseURL } from '../api/api'

	export default {
	  components: {
	    Rater
	  },
	  props: {
	  	evaluateCons: {
	  		type: Array,
	  		default () {
	  			return []
	  		}
	  	}
	  },
	  data () {
	  	return{
	  		evaluate_obj: {},
	  		baseURL,
	  	}
	  },
	  watch: {
	  	evaluateCons:{
        handler(curVal, oldVal){
        	this.evaluate_obj = curVal
        	for(let i=0;i<this.evaluate_obj.length;i++){
        		this.evaluate_obj[i].time = this.timeStamp(this.evaluate_obj[i].deval_addtime)
        	}
        },
        deep:true
      }
	  },
	  methods: {
      timeStamp (value) {
        function add0(m) {
            return m < 10 ? '0' + m : m
        }
        value = parseInt(value * 1000)
        var time = new Date(value)
        var y = time.getFullYear()
        var m = time.getMonth() + 1
        var d = time.getDate()
        var h = time.getHours()
        var mm = time.getMinutes()
        var s = time.getSeconds()
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
      }
	  }
	}

</script>

<style type="text/css" scoped>
	.evaluate{background-color: #fff;}
	.evaluate_con{margin: .8rem 1.2rem;border-bottom: .05rem solid #eee;margin-bottom: 0;padding-bottom: .8rem;}
	.evaluate_top{line-height: 2rem;color: #5e5e5e;font-size: 1.4rem;overflow: hidden;margin-bottom: .5rem;}
	.evaluate_top .img{width: 2rem;height: 2rem;border-radius: 50%;display: inline-block;overflow: hidden;position: relative;top: .4rem;margin-right: 1rem;}
	.evaluate_top .name{margin-right: .5rem;}
	.evaluate_top .time{float: right;position: relative;top: .25rem;}
	.evaluate_con p{color: #5a5a5a;font-size: 1.4rem;}
	.evaluate_img{overflow: hidden;margin-top: .5rem;}
	.evaluate_img img{width: calc(24% - 2px);margin-right: 1.33%;border: 1px solid #d3d2d3;float: left;margin-bottom: .25rem;}
	.evaluate_img img:nth-child(4n){margin-right: 0;}
</style>