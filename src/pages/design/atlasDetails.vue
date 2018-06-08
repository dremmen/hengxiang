<template>
  <div class="con">
  	<div class="atlas_top">
  		<div class="mask"></div>
  		<div class="atlas_top_con">
	  		<p class="atlas_area">{{atlasList.atlas_title}}</p>
	  		<p class="atlas_size">三室两厅 80㎡</p>
	  		<p class="atlas_tags">
  				<span v-for="(item, index) in aboutCon.designer_style" :key="index">简约</span>
  			</p>
  		</div>
  	</div>
  	<div class="atlas_person">
		<div class="atlas_person_headimg">
			<img :src="baseURL+'/'+aboutCon.designer_avatar">
		</div>
		<div class="atlas_person_con">
			<h4 class="atlas_person_title">{{aboutCon.designer_name}}</h4> 
			<p class="atlas_person_desc">
				<span class="design_level">Lv.{{aboutCon.level}}</span>
				<span class="design_icon" v-for="(tag, index) in aboutCon.tag_list" :key="index"><img :src="tag.tag_img_url"></span>
			</p>
			<p class="atlas_person_title">
				<span>设计：{{aboutCon.designer_money}}元/㎡</span>
				<span>监理：{{aboutCon.supervisor_money}}元/㎡</span>
			</p>
		</div>
  	</div>
	<div class="atlas_detail_con">
      <div class="atlas_detail_person">
        <h3>详情介绍</h3>
        <p>{{atlasList.atlas_introduction}}</p>
        <img v-for="(atlasImg, index) in atlasList.img" :key="index" :src="baseURL+'/'+atlasImg.atlas_img_path">
      </div>
    </div>	
    <router-link to="./designAppointment">立即预约</router-link>
  </div>
</template>

<script>	
	
	import { baseURL, atlasDetails, designAbout } from '../../api/api'

	export default {
	  components: {
	  },
	  data () {
	    return {
	    	atlasList: {},
	    	baseURL,
	    	aboutCon: {},
	    }
	  },
  	created() {
    	this.atlas_id = this.$route.query.atlas_id
    	this.designer_id = this.$route.query.designer_id
  		this._atlasDetails()
  		this._designAbout()
  	},
	  methods: {
	  	_atlasDetails () {
	  		atlasDetails(this.atlas_id).then((res) => {
	        console.log(res)
	  			this.atlasList = res.data.items
	  		})
	  	},
	    _designAbout () {
	      designAbout(this.designer_id).then((res) =>{
	        this.aboutCon = res.data.items
	      })
	    },
	  }
	}
</script>

<style type="text/css" scoped>
	a{text-decoration-line: none;}
	.con{width: 100%;height: 100%;background-color: #f0f0f0;padding-bottom: 11.5rem;}
	.atlas_top{height: 10rem;background-image: url(../../assets/img/c-big.png);background-size: cover;position: relative;}
	.atlas_top .mask,.atlas_top .atlas_top_con{position: absolute;width: 100%;height: 100%;background-color: rgba(0,0,0,.2);z-index: 1;}
	.atlas_top .atlas_top_con{z-index: 2;}
	.atlas_top .atlas_area{padding-top: 1.8rem;}
	.atlas_tags span{width: 3.75rem;height: 1.9rem;display: inline-block;color: #fff;background-color: #fdb926;line-height: 1.9rem;border-radius: 10000px;font-size: 1.2rem;text-align: center;}
	.atlas_top p{line-height: 2.4rem;height: 2.4rem;font-size: 1.3rem;color: #fff;padding-left: 1.2rem;}

	.atlas_detail_con{background-color: #fff;padding-bottom: 1.2rem;}
	.atlas_person{overflow: hidden;padding: 1rem;border-bottom: 1rem solid #f0f0f0;background-color: #fff;}
	.atlas_person div{float: left;}
	.atlas_person_headimg{width: 6.6rem;height: 6.6rem;margin-right: .8em;border-radius: 4px;overflow: hidden;}
	.atlas_person_con{width: 74%;}
	.atlas_person_desc{height: 1.6rem;line-height: 1.6rem;overflow: hidden;}
	.atlas_person_desc .design_level{width: 4rem;height: 1.6rem;line-height: 1.6rem;font-size: 1.2rem;color: #fff;background-color: #35c3bc;border-radius: 4px;position: relative;text-align: center;float: left;}
	.atlas_person_desc .design_icon{float: left;position: relative;top: .01rem;margin-left: .5rem;width: 1.6rem;height: 1.6rem;border-radius: 50%;overflow: hidden;}
	.atlas_person_title{font-weight: 400;font-size: 1.6rem;width: auto;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;word-wrap: normal;word-wrap: break-word;word-break: break-all;color: #000;}

	.atlas_detail_con h3{line-height: 3.75rem;font-size: 1.6rem;color: #999;font-weight: 400;border-bottom: .05rem solid #efefef;padding: 0 1.2rem;}
	.atlas_detail_con p{font-size: 1.4rem;color: #333;padding: 1.2rem;}
	.atlas_detail_person img{overflow: hidden;padding: 0 1.2rem;box-sizing: border-box;margin-bottom: .5rem;}
	.con>a{width: 100%;height: 4.3rem;float: left;line-height: 4.3rem;text-align: center;color: #fff;font-size: 1.8rem;background-color: #12c098;border-radius: 10000px;position: fixed;bottom: 6rem;}

</style>