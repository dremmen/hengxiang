<template>
  <div>
    <div class="search">
      <input type="search" placeholder="请输入..." v-model="search_con">
      <span @click="_search()">搜索</span>
    </div>
    <div class="tab">
    	<tab>
	      <tab-item data-type="" class="triangle" @click.native="designClick($event)" selected>全部</tab-item>
	      <tab-item data-type="order_number" class="triangle" :class="order_number" @click.native="designClick($event)">交易量</tab-item>
	      <tab-item data-type="designer_experience" class="triangle" :class="designer_experience" @click.native="designClick($event)">好评</tab-item>
	      <tab-item v-model="show" @click.native="show = !show">筛选</tab-item>
		</tab>
    </div>
    <div class="designAl">
    	<ul class="designAl_con">
    		<li v-for="(design, index) in designLists" :key="index">
    			<router-link :to="{ path: 'designAbout', query: { designer_id: design.designer_id }}">
    				<div class="designAl_li">
    					<div class="designAl_con_headimg">
	    					<img :src="design.designer_avatar">
	    				</div>
	    				<div class="designAl_con_person">
	    					<h4 class="designAl_con_title">{{design.designer_name}}</h4> 
	    					<p class="designAl_con_desc">
	    						<span class="design_level">Lv.20</span>
	    						<span class="design_icon" v-for="(tag, index) in design.tag_list" :key="index"><img :src="tag.tag_img_url"></span>
	    					</p>
	    					<p class="designAl_con_title">
	    						<span>设计：{{design.designer_money}}元/㎡</span>
	    						<span>监理：{{design.supervisor_money}}元/㎡</span>
	    					</p>
	    				</div>
    				</div>
    				<div class="designAl_li_img">
    					<span v-for="(atlas, index) in design.atlas_img_paths" :key="index"><img :src="baseURL+'/'+atlas"></span>
    				</div>
    			</router-link>
    		</li>
    	</ul>
	  </div>
    <popup v-model="show">
      <div class="screen">     
        <span>风格类型：</span>    
        <checker v-model="screen_cons1" type="radio" default-item-class="screen_default" selected-item-class="screen_active">
          <checker-item value=" ">不限</checker-item>
          <checker-item v-for="(item, index) in style" :key="index" :value="item.tag_id">{{item.tag_name}}</checker-item>
        </checker>                
        <span>设计价格：</span> 
        <checker v-model="screen_cons2" type="radio" default-item-class="screen_default" selected-item-class="screen_active">
          <checker-item value=" ">不限</checker-item>
          <checker-item v-for="(item, index) in price" :key="index" :value="item.designer_price_id">{{item.price}}</checker-item>          
        </checker>               
        <span>是否监理：</span>  
        <checker v-model="screen_cons3" type="radio" default-item-class="screen_default" selected-item-class="screen_active">
          <checker-item value=" ">不限</checker-item>
          <checker-item value="1">是</checker-item>
          <checker-item value="0">否</checker-item>
        </checker>
      </div>
      <span class="screen_btn" @click="screen()">确认</span>
    </popup>
  </div>
</template>

<script>
import { Tab, TabItem, Panel, Popup, XSwitch, Checker, CheckerItem, AlertModule} from 'vux'
import { baseURL, designList, getRei, has_price } from '../../api/api'

export default {
  components: {
    Tab,
    TabItem,
    Panel,
    Popup, 
    XSwitch, 
    Checker, 
    CheckerItem
  },
  data () {
    return {
    	designLists: [],
    	baseURL,
    	order_number: 'triangle_desc',
    	designer_experience: "triangle_desc",
      search_con: '',
      data: '',
      show: false,
      screen_cons1: '',
      screen_cons2: '',
      screen_cons3: '',
      style: [],
      price: []
    }
  },
  created() {
    this._designList('')
    this._getRei()
    this._has_price()
  },
  methods: {
  	_designList(){
	  	designList(this.data).then((res) => {
	  		this.designLists = res.data.items
        if(!this.designLists){
          AlertModule.show({
            title: '系统提示',
            content: '没有更多数据...'
          })          
        }
	  	})
  	},
  	designClick(e){
  		var data_type = e.target.dataset.type
  		var data_class = e.target.className
  		if(data_type == 'order_number'){
        this.designer_experience = 'triangle_desc'
  			if(data_class.indexOf('triangle_asc') > -1){
  				this.order_number = 'triangle_desc'
  				this.data = '?order=order_number desc'
  			}else {
  				this.order_number = 'triangle_asc'
  				this.data = '?order=order_number asc'
  			}
  		}else if(data_type == 'designer_experience'){
        this.order_number = 'triangle_desc'
  			if(data_class.indexOf('triangle_asc') > -1){
  				this.designer_experience = 'triangle_desc'
  				this.data = '?order=evaluation_star desc'
  			}else {
  				this.designer_experience = 'triangle_asc'
  				this.data = '?order=evaluation_star asc'
  			}
  		}else if(data_type == ''){
        this.order_number = 'triangle_desc'
        this.designer_experience = 'triangle_desc'
        this.data = ""
  		}
      this._designList()
  	},
    _search () {
      // 搜索
      this.data = '?keyword='+this.search_con
      this._designList()      
    },
    screen () {
      // 判断获取筛选条件，是否有值，有就赋值，无就为空
      this.data = '?style_tag='+this.screen_cons1+'&price='+this.screen_cons2+'&is_supervisor='+this.screen_cons3
      this.show = !this.show
      this._designList()
    },
    _getRei () {
      // 获取筛选风格样式
      getRei().then((res) => {
        this.style = res.data.items.style
      })
    },
    _has_price () {
      // 获取筛选价钱
      has_price().then((res) => {
        this.price = res.data.items
      })
    }
  }
}

</script>

<style type="text/css" scoped>
	ul,li{list-style: none;}
	.search{border-bottom: 1px solid #f0f0f0;}
  .search input{border: none;outline: none;background-color: #eeeeee;height:  3rem;border-radius: 100000px;width:  80%;margin: 1rem 1.2rem;padding: 0 1rem;}
  .search span{font-size: 1.4rem;vertical-align: middle;}
  .vux-tab .vux-tab-item.vux-tab-selected {color: #37beb7;border-bottom: 3px solid #37beb7!important;}
	.vux-tab .vux-tab-item{position: relative;}

	.triangle:after{position: absolute;border-color: transparent;border-width: 7px;content: "";top: 15px;right: 7px;border-style: solid}
  .vux-tab .vux-tab-item{position: relative;}
  .triangle:after{position: absolute;border-color: transparent;border-width: 7px;content: "";top: 15px;right: 1rem;border-style: solid}
  .triangle.vux-tab-selected.triangle_desc:after {top: 1.5rem;border-color: #35c4bb transparent transparent transparent;}
  .triangle.vux-tab-selected.triangle_asc:after {border-color: transparent transparent #35c4bb transparent;top: 1rem;}
  .triangle.triangle_desc:after {top: 1.5rem;border-color: #999 transparent transparent transparent;}
  
  .designAl{margin-bottom: 5rem;border-top: .8rem solid #f0f0f0;}
	.designAl_con li{border-bottom: .83rem solid #f0f0f0;}
	.designAl_li{overflow: hidden;margin-bottom: 3.5%;}
	.designAl_li div{float: left;}
	.designAl_con_headimg{width: 6.6rem;height: 6.6rem;margin-right: .8em;}
	.designAl_con img{width: 100%;height: 100%;display: block;}
	.designAl_con_person{width: 74%;}
	.designAl_con_desc{height: 1.6rem;line-height: 1.6rem;overflow: hidden;}
	.designAl_con_desc .design_level{width: 4rem;height: 1.6rem;line-height: 1.6rem;font-size: 1.2rem;color: #fff;background-color: #35c3bc;border-radius: 4px;text-align: center;float: left;}
	.designAl_con_desc .design_icon{float: left;position: relative;top: -.01rem;margin-left: .5rem;width: 1.6rem;height: 1.6rem;border-radius: 50%;overflow: hidden;}
	.designAl_con_title{font-weight: 400;font-size: 1.6rem;width: auto;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;word-wrap: normal;word-wrap: break-word;word-break: break-all;color: #000;}
	.designAl_li_img{overflow: hidden;}
  .designAl_li_img span{float: left;width: 31%;margin-bottom: 1rem;height: 10.8rem;}
  .designAl_li_img span:nth-child(3n-1){margin: 0 3.5%;}
  .designAl_con a{display: block;padding: 3.5%;}

  .screen{padding: 1rem 0 2rem 1.2rem;background-color: #fff;}
  .screen span{margin-bottom: .5rem;font-size: 1.4rem;display: block;color: #333;}
  .screen .vux-checker-box{margin-bottom: 1rem;}
  .screen_default{padding: .5rem 1.5rem;border: 1px solid #37beb7;font-size: 1.4rem;color: #37beb7;margin-bottom: .5rem;margin-right: .5rem;}
  .screen_active{background-color: #37beb7;color: #fff;}
  .screen_btn{color: #fff;display: block;background-color: #feba34;height: 5rem;line-height: 5rem;text-align: center;font-size: 1.6rem;}
      
</style>