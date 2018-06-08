<template>
  <div>
  	<div class="about_top">
      <div class="bg-top"><img :src="baseURL+'/'+aboutCon.designer_background"></div>
  		<div class="head_img"><img :src="baseURL+'/'+aboutCon.designer_avatar"></div>
  		<h2>{{aboutCon.designer_name}}</h2>
  		<p class="tip">{{aboutCon.introduction}}</p>
  		<div class="design_tags">
  			<span v-for="(item, index) in aboutCon.designer_style" :key="index">{{item.tag_name}}</span>
  		</div>
  		<div class="design_icon">
  			<span class="design_level">Lv.{{aboutCon.level}}</span>
  			<span class="design_icon" v-for="(tag, index) in aboutCon.tag_list" :key="index"><img :src="tag.tag_img_url"></span>
  		</div>
  		<p class="price">
  			<span>设计：{{aboutCon.designer_money}}元/㎡</span>
  			<span>监理：{{aboutCon.supervisor_money}}元/㎡</span>
  		</p>
  	</div>
    <div class="tab">

      <tab v-model="index">
        <tab-item class="vux-center" :selected="about_con === item" v-for="(item, index) in listAbout" @click="about_con = item" :key="index">{{item}}</tab-item>
      </tab>
      <div class="tab-swiper vux-center" :class="index === 0 ? 'block':'none'">
        <ul class="about_al">
          <li v-for="(atlas, index) in atlasList" :key="index">
            <router-link :to="{ path: 'atlasDetails', query: { atlas_id: atlas.atlas_id, designer_id: designer_id }}">              
              <img v-if="atlas.atlas_img.length > 0" :src="baseURL+'/'+atlas.atlas_img[0].atlas_img_path">
              <img v-else src="">
              <div class="about_tags">
                <span>{{atlas.atlas_style}}</span>
              </div>
              <p>{{atlas.atlas_introduction}}</p>
            </router-link>
          </li>
          <router-link :to="{path: 'designAppointment', query: { designer_id: designer_id }}">立即预约</router-link>
        </ul>
      </div>
      <div class="tab-swiper vux-center" :class="index === 1 ? 'block':'none'">            
        <div class="about_con">
          <div class="about_person">
            <h3>个人介绍</h3>
            <p>{{aboutCon.introduction}}</p>
          </div>
          <div class="about_honour">
            <h3>荣誉与证书</h3>
            <ul class="about_honour_ul">
              <li v-for="(honor, index) in aboutCon.honor_list" :key="index">{{honor.honor_name}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="tab-swiper vux-center" :class="index === 2 ? 'block':'none'">
        <div class="about_evaluate">
          <p>评价（{{evaluateConL}}）</p>
          <evaluate-components :evaluateCons='evaluateCon'></evaluate-components>
          <p class="add_evaluate" @click="add_evaluate()">加载更多</p>
          <ul class="trade_ul">
            <p>交易记录（{{designerOrderL}}）</p>
            <li v-for="(designerOrder, index) in designerOrderList" :key="index">
              <span>{{designerOrder.status}}</span>
              <span>{{designerOrder.order_name}}</span>
              <span>{{designerOrder.time}}</span>
            </li>
            <p class="add_designerOrder" @click="add_designerOrder()">加载更多</p>
          </ul>
        </div>
      </div>
    </div>
    <div class="about_btn" :class="index === 1 ? 'block':'none'">
      <router-link :to="{path: 'designAppointment', query: { designer_id: designer_id }}">预约设计</router-link>
      <router-link :to="{path: 'designAppointment', query: { designer_id: designer_id }}">预约监理</router-link>
    </div>
  </div>
</template>

<script>

import { Tab, TabItem, AlertModule } from 'vux'
import evaluateComponents from '../../components/evaluateComponents'
import { baseURL, designAtlas, designAbout, designEvaluate, getDesignerOrder } from '../../api/api'
const list = () => ['图集', '关于他', '评价']

export default {
  components: {
    Tab,
    TabItem,
    evaluateComponents
  },
  data () {
    return {
      index: 0,
      listAbout: list(),
      about_con: '图集',
      atlasList: [],
      baseURL,
      aboutCon: {},
      evaluateCon: [],
      evaluateConL: '',
      designerOrderList: [],
      designerOrderL: '',
      designerOrderCurpage: 1,
      evaluateConCurpage: 1,
    }
  },
  created() {
    this.designer_id = this.$route.query.designer_id
    this._designAtlas()
    this._designAbout()
    this._designEvaluate()
    this._getDesignerOrder()
  },
  methods: {
    _designAtlas () {
      designAtlas(this.designer_id).then((res) => {
        this.atlasList = res.data.items
      })
    },
    _designAbout () {
      designAbout(this.designer_id).then((res) =>{
        this.aboutCon = res.data.items
      })
    },
    _designEvaluate () {
      designEvaluate(this.designer_id, this.evaluateConCurpage).then((res) => {
        if(res.data.data){
          return;
        }
        this.evaluateConL = res.data.items.count
        for(var i in res.data.items.designer_eval_list){
          this.evaluateCon.push(res.data.items.designer_eval_list[i])
        }
      })
    },
    _getDesignerOrder () {
      getDesignerOrder(this.designer_id, this.designerOrderCurpage).then((res) => {
        if(res.data.data){
          return
        }
        var designerOrderListL = res.data.items.designer_order_list
        this.designerOrderL = res.data.items.count
        for(var i in designerOrderListL){
          if(designerOrderListL[i].order_state == '40'){
            designerOrderListL[i].status = '已完成'
          }else{
            designerOrderListL[i].status = '进行中'
          }
          designerOrderListL[i].time = this.timeStamp(designerOrderListL[i].create_time)
          this.designerOrderList.push(designerOrderListL[i])
        }
      })
    },  
    add_evaluate () {
      this.evaluateConCurpage++
      if(this.evaluateCon.length>=this.evaluateConL){
        AlertModule.show({
          title: '系统提示',
          content: '没有更多数据...'
        })
        return;
      }
      this._designEvaluate()
    },
    add_designerOrder () {
      this.designerOrderCurpage++
      if(this.designerOrderList.length>=this.designerOrderL){
        AlertModule.show({
          title: '系统提示',
          content: '没有更多数据...'
        })
        return;
      }
      this._getDesignerOrder()
    }, 
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
  img{width: 100%;height: 100%;display: block;}
  a{text-decoration-line: none;}
  .vux-tab .vux-tab-item.vux-tab-selected {color: #37beb7;border-bottom: 3px solid #37beb7!important;}
  .vux-slider > .vux-swiper > .vux-swiper-item {position: static;}
  .tab-swiper{display: none;}
  .tab-swiper.block,.about_btn.block{display: block;}
  .tab{margin-bottom: 5rem;}

  .about_top{height: 22.5rem;width: 100%;background-size: 100% 100%;text-align: center;position: relative;}
  .about_top .bg-top{position: absolute;top: 0;width: 100%;height: 22.5rem;z-index: -1;}
  .head_img{width: 5rem;height: 5rem;border-radius: 4px;display: inline-block;margin-top: 2.5rem;}
  .about_top h2{margin-top: .5rem;font-size: 1.8rem;color: #fff;font-weight: 400;}
  .about_top p.tip{color: #fff;font-size: 1.4rem;position: relative;top: -.3rem;}
  .design_tags span{padding: 0 1rem;height: 1.9rem;display: inline-block;color: #fff;background-color: #fdb926;line-height: 1.9rem;border-radius: 10000px;margin-bottom: .5rem;font-size: 1.2rem;margin-top: .8rem;margin-right: .5rem;}
  .design_icon span.design_level{width: 3.5rem;height: 1.3rem;background-color: #35c3bc;color: #fff;display: inline-block;line-height: 1.3rem;border-radius: 4px;}
  .design_icon span.design_icon{width: 1.3rem;height: 1.3rem;display: inline-block;position: relative;top: .3rem;}

  .about_al{background-color: #f0f0f0;padding: 1rem 1.2rem;overflow: hidden;}
  .about_al li{float: left;width: 49%;margin-right: 2%;background-color: #fff;margin-bottom: 2%;}
  .about_al li img{height: 17rem;}
  .about_al li:nth-child(2n){margin-right: 0;}
  .about_al li span{padding: 0 1rem;height: 1.9rem;display: inline-block;color: #fff;background-color: #fdb926;line-height: 1.9rem;border-radius: 10000px;margin-bottom: .5rem;font-size: 1.2rem;margin-top: .8rem;text-align: center;}
  .about_al li div{padding-left: .25rem;}
  .about_al li p{line-height: 2.0rem;font-size: 1.4rem;color: #000;padding-left: .25rem;width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;}
  .about_al>a{width: 100%;height: 4.3rem;float: left;line-height: 4.3rem;text-align: center;color: #fff;font-size: 1.8rem;background-color: #12c098;border-radius: 10000px;}

  .about_con{margin-bottom: 10.4rem;}
  .about_top .price{color: #fff;font-size: 1.4rem;margin-top: 5px;}
  .about_con>div{border-bottom: 1rem solid #f0f0f0;}
  .about_con h3{line-height: 3.75rem;font-size: 1.6rem;color: #999;font-weight: 400;border-bottom: .05rem solid #efefef;padding: 0 1.2rem;}
  .about_con p{font-size: 1.4rem;color: #333;padding: 1.2rem;}
  .about_con .about_honour_ul{padding: .8rem 1.2rem;list-style: none;}
  .about_con .about_honour_ul li{line-height: 2.4rem;font-size: 1.4rem;color: #333;line-height: 1.2rem 0;}
  .about_btn{position: fixed;width: 100%;overflow: hidden;text-align: center;bottom: 5rem;display: none;}
  .about_btn a{width: 50%;height: 4.5rem;float: left;font-size: 1.6rem;color: #fff;background-color: #feba34;line-height: 4.5rem;}
  .about_btn a:nth-child(2){background-color: #fe5146;}

  .about_evaluate > p,.trade_ul > p{line-height: 3.75rem;font-size: 1.6rem;color: #5e5e5e;padding-left: 1.2rem;border-bottom: .05rem solid #efefef;border-top: 1rem solid #f0f0f0;}
  .about_evaluate > .add_evaluate,.trade_ul .add_designerOrder{line-height: 3.75rem;font-size: 1.6rem;color: #5e5e5e;text-align: center;border: none;}
  .trade_ul{border-bottom: 1rem solid #f0f0f0;}
  .trade_ul li{line-height: 3.8rem;height: 3.8rem;color: #5e5e5e;border-bottom: 1px solid #eee;margin: 0 1.2rem;font-size: 1.2rem;}
  .trade_ul li:nth-last-child(1){margin-bottom: 0;}
  .trade_ul li span{color: #5e5e5e;position: relative;padding: 0 1.2rem;}
  .trade_ul li span:nth-child(1):before{position: absolute;height: 84%;border-right: 1px solid #e6e6e6;content: "";right: 0;top: 8%;}
  .trade_ul li span:nth-child(3){float: right;}
</style>