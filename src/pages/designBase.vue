<template>
  <div>
  	<div class="designBase">
  		<swiper>
		    <swiper-item class="swiper-demo-img" v-for="(item, index) in listImg" :key="index"><img :src="item.adv_pic"></swiper-item>
		  </swiper>
  		<div class="nav_top">
  			<span class="logo"></span>
  			<div class="search">
  				<span></span>
  				<input type="search" name="search" class="search_input">
  			</div>
				<span class="news"><i>{{news}}</i></span>
  		</div>
  		<div class="boutique_atlas contents">
  			<div class="head">
  				<h2>精品图集</h2>
  				<p>Boutique Atlas</p>
  			</div>
				<scroller lock-y :scrollbar-x=false>
			    <div class="atlas_div">
			      <div class="atlas_item" v-for="(atlas, index) in atlasList" :key="index">
			      	<img :src="baseURL+'/'+atlas.cover_pic_url1[240]">
							<div class="atlas_con">
								<div class="head_img">
									<img :src="baseURL+'/'+atlas.designer_avatar">
								</div>
								<div class="atlas_pro">
									<h3>{{atlas.designer_name}}</h3>
									<p>{{atlas.case_description}}</p>
								</div>
							</div>
			      </div>
			    </div>
			  </scroller>
  		</div>
  		<div class="design_assignment contents">
  			<div class="head">
  				<h2>任务大厅</h2>
  				<p>Design assignment</p>
  			</div>
  			<div class="assignment_con">
  				<div class="assignment_item" v-for="(assignment, index) in assignmentList" :key="index">
  					<div class="item_left">
  						<h3>{{assignment.rei_name}}{{assignment.house_type_name}}</h3>
	  					<p>户型：{{assignment.house_type_name}} &nbsp 面积：{{assignment.house_area}}㎡</p>
	  					<p>风格：<span v-for="(style, _index) in assignment.house_styles_list" :key="_index">{{style.tag_name}}、</span></p>
  					</div>
  					<div class="item_right">
  						<img src="../assets/img/right.png">
  					</div>
  				</div>
  			</div>
  		</div>
  		<div class="excellent_designer contents">
  			<div class="head">
  				<h2>设计大咖</h2>
  				<p>Excellent designer</p>
  			</div>
  			<div class="designer_con">
	  			<scroller lock-y :scrollbar-x=false>
				    <div class="designer_div">
				      <div class="designer_item" v-for="(experience, index) in experienceList" :key="index">
								<img :src="experience.designer_avatar">
								<div class="designer_pro">
									<h3>{{experience.designer_name}}</h3>
								</div>
				      </div>
				    </div>
				  </scroller>
				  <div class="designer">
			      <div class="designer_item" v-for="(excellent, index) in excellentList" :key="index">
							<img :src="excellent.designer_avatar">
							<div class="designer_pro">
								<h3>{{excellent.designer_name}}</h3>
							</div>
			      </div>				  	
				  </div>
				</div>
  		</div>
  	</div>
  </div>
</template>

<script>

  import { Swiper, Scroller, SwiperItem } from 'vux'
  import { baseURL, getSwiper, boutiqueAtlas, designAssignment, excellentDesigner, designerExperience } from '../api/api'

  export default {
    components: {
      Swiper,
      Scroller,
      SwiperItem 
    },
    data () {
      return {
        listImg: [],
        atlasList: [],
        assignmentList: [],
        excellentList: [],
        experienceList: [],
        news: 8,
        baseURL,
      }
    },
    created() {
      this._getSwiper()
      this._boutiqueAtlas()
      this._designAssignment()
      this._excellentDesigner()
      this._designerExperience()
    },
    methods: { 
		  _getSwiper() {
		  	getSwiper().then((res) => {
		  		this.listImg = res.data.items.adv_list  		
		  	})
		  },
		  _boutiqueAtlas() {
		  	boutiqueAtlas().then((res) => {
		  		this.atlasList = res.data.items		
		  	})
		  },
		  _designAssignment() {
		  	designAssignment().then((res) => {
		  		this.assignmentList = res.data.items
		  	})
		  },
		  _excellentDesigner() {
		  	excellentDesigner().then((res) => {
		  		this.excellentList = res.data.items
		  	})
		  },
		  _designerExperience() {
		  	designerExperience().then((res) => {
		  		console.log(res)
		  		this.experienceList = res.data.items
		  	})
		  }
    }
  }
</script>

<style type="text/css" scoped>
	.designBase{background-color: #f0f0f0;padding-bottom: 6rem;}
	.designBase .nav_top{height: 31px;width: 100%;position: fixed;top: 10px;background-color: transparent;}
	.designBase .nav_top .logo{width: 31px;height: 31px;background-color: #fff;border-radius: 50%;position: absolute;left: 12px;top: 0;}
	.designBase .nav_top .search{width: 70%;position: absolute;left: 14%;}
	.designBase .nav_top .search .search_input{background-color: rgba(255,255,255,.5);outline: none;border: none;height: 31px;line-height: 31px;width: 100%;border-radius: 10000px;}
  .designBase .nav_top .news{width: 17px;position: absolute;background-color: #fff;height: 16px;right: 5%;top: 7.5px;}
  .designBase .nav_top .news i{position: absolute;top: -10px;left: 10px;font-style: normal;background-color: #fb4c4c;color: #fff;border-radius: 50%;width: 18px;height: 18px;font-size: 10px;text-align: center;line-height: 18px;}

  .boutique_atlas{margin-top: 2rem;}
  .contents .head h2{font-size: 2.0rem;text-align: center;font-weight: 500;}
  .contents .head p{font-size: 1.4rem;text-align: center;margin-bottom: 1rem;}
  .atlas_div{height: 27rem;position: relative;width: 91rem;overflow: hidden;padding-bottom: 1rem;}
  .atlas_item{width: 22rem;height: 27rem;margin-left: 1rem;float: left;text-align: center;padding: 1rem;background-color: #fff;box-sizing: border-box;border-radius: 10px;box-shadow: 0px 0px 7px rgba(0,0,0,.2);}
	.atlas_item:first-child {margin-left: 0;}
	.atlas_item>img{width: 20rem;height: 20rem;display: block;}
	.atlas_item .atlas_con{overflow: hidden;margin-top: 1rem;}
	.atlas_item .head_img{width: 4rem;height: 4rem;float: left;border-radius: 50%;overflow: hidden;}
	.atlas_item .atlas_pro{float: left;text-align: left;line-height: 2rem;margin-left: 1rem;}
	.atlas_item .atlas_pro p,.assignment_item .item_left p{color: #999;}

	.assignment_con,.designer_con{padding: 1rem 0;background-color: #fff;}
	.assignment_item{position: relative;margin-bottom: 1rem;}
	.assignment_item .item_left{width: 91%;display: inline-block;box-shadow: 0px 0px 7px rgba(0,0,0,.2);background-color: #fff;padding: 1rem;box-sizing: border-box;}
	.assignment_item .item_left h3{line-height: 2rem;margin-bottom: .3rem;}
	.assignment_item .item_right{background-color: #f31278;height: 7rem;top: 0px;left: 90.5%;width: 2rem;border-bottom-right-radius: 6px;border-top-right-radius: 6px;text-align: center;position: absolute;}
  .assignment_item .item_right img{width: .9rem;height: 1.5rem;position: absolute;margin: auto;left: 0;right: 0;top: 0;bottom: 0;}

  .designer_div{width: 75rem;height: 14rem;overflow: hidden;position: relative;padding: 1rem 0;}
  .designer_item{position: relative;width: 14rem;height: 14rem;margin-left: 1rem;float: left;text-align: center;background-color: #fff;box-sizing: border-box;border-radius: 10px;box-shadow: 0px 0px 7px rgba(0,0,0,.2);overflow: hidden;margin-bottom: 1rem;}
  .designer_item .designer_pro{position: absolute;width: 100%;line-height: 2.4rem;color: #fff;padding: 0 1rem;bottom: 0rem;box-sizing: border-box;background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(0,0,0,.7));}
  .designer{overflow: hidden;}
  .designer .designer_item{width: 8.25rem;height: 8.25rem;margin-bottom: 1rem;}
</style>
