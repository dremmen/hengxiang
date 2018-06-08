<template>
  <div class="orderDetails">
    <p>订单进度</p>
    <div class="progress">
      <ul class="icon">
        <li class="active"><img :src="iconSrc1"></li>
        <li :class="iconClass2"><img :src="iconSrc2"></li>
        <li :class="iconClass3"><img :src="iconSrc3"></li>
        <li :class="iconClass4"><img :src="iconSrc4"></li>
      </ul>
      <ul class="icon_zi">
        <li>创建订单</li>
        <li>支付订单</li>
        <li>提交设计</li>
        <li>确认</li>
      </ul>
    </div>
    <div class="order cons">
        <p class="title">订单详情</p>
        <p class="cons_p">
            <span class="order_l">设计师</span>
            <span class="order_r">{{designer.designer_name}}</span>
        </p>
        <p class="cons_p">
            <span class="order_l">联系电话</span>
            <span class="order_r">{{designer.designer_mobile}}</span>
        </p>
        <p class="cons_p">
            <span class="order_l">订单编号</span>
            <span class="order_r">{{supervisionOrderDetails.order_sn}}</span>
        </p>
        <p class="cons_p">
            <span class="order_l">下单时间</span>
            <span class="order_r">{{supervisionOrderDetails.createTime}}</span>
        </p>
        <p class="cons_p">
            <span class="order_l">支付方式</span>
            <span class="order_r">{{supervisionOrderDetails.payment_name}}</span>
        </p>
        <p class="cons_p">
            <span class="order_l">实付款</span>
            <span class="order_r">￥{{supervisionOrderDetails.pay_amount}}</span>
        </p>
    </div>
    <div class="zx cons">
        <p class="title">装修需求</p>
        <p class="cons_p">
            <span class="zx_l">小区</span>
            <span class="zx_r">{{demand.rei_name}}</span>
        </p>
        <p class="cons_p">
            <span class="zx_l">户型</span>
            <span class="zx_r">{{demand.house_type_name}}</span>
        </p>
        <p class="cons_p">
            <span class="zx_l">面积</span>
            <span class="zx_r">{{demand.house_area}}㎡</span>
        </p>
        <p class="cons_p">
            <span class="zx_l">类型</span>
            <span class="zx_r">{{supervisionOrderDetails.is_price}}</span>
        </p>
        <p class="cons_p">
            <span class="zx_l">房屋类型</span>
            <span class="zx_r">{{demand.is_newHouse}}</span>
        </p>
        <p class="cons_p">
            <span class="zx_l">户型图</span>
            <span class="zx_r zx_img" v-if="demand.house_type_img_id == 'null'"><img src=""></span>
        <span class="zx_r zx_img" v-else><img :src="demand.house_type_img"></span>
        </p>
        <p class="cons_p">
            <span class="zx_l">备注</span>
            <span class="zx_r zx_chang">{{demand.remark}}</span>
        </p>
    </div>
    <div class="service cons">
        <p class="title">服务项</p>
        <p class="cons_p" v-for="(item, index) in service_items" :key="index">
            <span class="service_l">{{item.item_name}}</span>
            <span class="service_r" v-if="item.item_state == '20'">已确认</span>        
        <span class="service_r" v-if="item.item_state == '10'">
          <span class="btn done" @click="service_submit(item.order_item_id, 2, supervisionOrderDetails.order_id)">不通过</span>
          <span class="btn do" @click="service_submit(item.order_item_id, 1, supervisionOrderDetails.order_id)">通过</span>
        </span>        
        <span class="service_r" v-if="item.item_state == '0'">未提交</span>
        </p>
    </div>
    <div class="track cons">
        <p class="title">上传记录</p>
      <div class="record" v-for="(item, index) in extend_item_submit" :key="index">
        <p class="cons_p">
            <span class="track_l">记录时间</span>
            <span class="track_r">{{item.createTime}}</span>
        </p>
        <p class="cons_p">
            <span class="track_l">说明</span>
            <span class="track_r track_chang">{{item.submit_desc}}</span>
        </p>
        <div class="cons_p">
            <span class="track_l">附件</span>
            <div class="track_r">
                <p v-for="(items, index) in item.file_list" :key="index">
                    <span class="track_r_l">{{items.name}}</span>
                    <a :href="items.url" class="track_r_r">下载</a>
                </p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { Tab, TabItem, AlertModule } from 'vux'
  import {BASEURL, supervisionOrderDetails, supervisionServiceSubmit} from '../../api/api'
  import qs from 'qs'

  export default {
    components: {
      Tab,
      TabItem,
    },
    data () {
      return {
        supervisionOrderDetails: [],
        designer: [],
        demand: [],
        service_items:[],
        extend_item_submit: [],
        iconSrc1: require('../../assets/img/5-3.png'),
        iconSrc2: require('../../assets/img/9-2.png'),
        iconSrc3: require('../../assets/img/7-1.png'),
        iconSrc4: require('../../assets/img/8-1.png'),
        iconClass2: '',
        iconClass3: '',
        iconClass4: '',
      }
    },
    created() {
      this.order_id = this.$route.query.order_id
      this._supervisionOrderDetails()
    },
    methods: {        
      _supervisionOrderDetails () {
        supervisionOrderDetails(this.order_id).then((res) => {
          this.icon_img(res.data.items.order_info.order_state)
          this.supervisionOrderDetails = res.data.items.order_info
          this.designer = this.supervisionOrderDetails.extend_designer
          this.demand = this.supervisionOrderDetails.extend_demand
          this.service_items = this.supervisionOrderDetails.extend_item
          this.supervisionOrderDetails.is_price = this.is_price(this.supervisionOrderDetails.order_type)
          this.supervisionOrderDetails.createTime = this.timeStamp(this.supervisionOrderDetails.create_time)
          this.demand.is_newHouse = this.is_newHouse(this.demand.house_condition)
          for(var i in this.supervisionOrderDetails.extend_item_submit){
            this.supervisionOrderDetails.extend_item_submit[i].createTime = this.timeStamp(this.supervisionOrderDetails.extend_item_submit[i].create_time)
          }
          this.extend_item_submit = this.supervisionOrderDetails.extend_item_submit
        })
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
      },
      icon_img (order_state) {
        switch(order_state){
            case '10':
            break;
            case '20':  
              this.iconSrc1 = require('../../assets/img/5-3.png')
              this.iconSrc2 = require('../../assets/img/9-3.png')
              this.iconSrc3 = require('../../assets/img/7-2.png')
              this.iconSrc4 = require('../../assets/img/8-1.png')     
              this.iconClass2 = 'active'
            break;
            case '30':    
              this.iconSrc1 = require('../../assets/img/5-3.png')
              this.iconSrc2 = require('../../assets/img/9-3.png')
              this.iconSrc3 = require('../../assets/img/7-3.png')
              this.iconSrc4 = require('../../assets/img/8-2.png')     
              this.iconClass2 = 'active'     
              this.iconClass3 = 'active'
            break;
            case '40':    
              this.iconSrc1 = require('../../assets/img/5-3.png')
              this.iconSrc2 = require('../../assets/img/9-3.png')
              this.iconSrc3 = require('../../assets/img/7-3.png')
              this.iconSrc4 = require('../../assets/img/8-3.png')     
              this.iconClass2 = 'active'     
              this.iconClass3 = 'active'                        
              this.iconClass4 = 'active'
            break;
        }
      },
      is_price (num) {
        switch(num){
          case '1':
              return '收费';
          break;

          case '2':
              return '免费';
          break;
        }
      },
      is_newHouse (num) {
        switch(num){
          case '1':
              return '新房';
          break;

          case '2':
              return '旧房';
          break;
        }
      },
      service_submit (item_id, type, order_id) {
        var _this = this
        var jsonData = {
          'item_id': item_id,
          'type': type,
          'order_id': order_id
        }
        supervisionServiceSubmit(qs.stringify(jsonData)).then((res) => {
          AlertModule.show({
            title: '系统提示',
            content: res.data.msg,
            onHide () {
              _this.$router.go(0)
            }
          })
        })
      }
    }
  }
</script>

<style type="text/css" scoped>
  .orderDetails{background-color: #f0f0f0;height: 100%;min-height: 100vh;margin-bottom: 5rem;}
  .orderDetails > p{line-height: 4.4rem;height: 4.4rem;color: #333;background-color: #fff;border-bottom: .05rem solid #eee;padding-left: 1.2rem;font-size: 1.4rem;}
  .progress ul{overflow: hidden;padding-bottom: 1.2rem;background-color: #fff;}
  .progress ul.icon_zi{margin-bottom: 1rem;}
  .progress li{float: left;width: 25%;text-align: center;font-size: 1.4rem;color: #37beb7;}
  .progress ul.icon{padding-top: 1.2rem;}
  .progress ul.icon li{box-sizing: border-box;position: relative;}
  .progress ul.icon li:after{position: absolute;top: 0;border-top: 1px dashed #999;content: '';width: 4rem;right: -2.1rem;top: 50%;}
  .progress ul.icon li.active:after{border-top: 1px dashed #37beb7;}
  .progress ul.icon li:nth-last-child(1):after{display: none;}
  .progress ul.icon li img{width: 3rem;height: 3rem;display: inline-block;vertical-align: middle;}
  a{text-decoration-line: none;}
  .cons{background-color: #fff;margin-bottom: 1rem;}
  .cons .title{line-height: 4.4rem;height: 4.4rem;font-size: 1.4rem;border-bottom: .05rem solid #eee;padding-left: 1.2rem;}
  .cons .cons_p{overflow: hidden;margin: 0 1.2rem;border-bottom: .05rem solid #eee;line-height: 4.4rem;font-size: 1.4rem;}
  .cons .cons_p:nth-last-child(1){border-bottom: 0;}
  .service .btn{height: 2.1rem;display: inline-block;padding: 0 1rem;border: 1px solid #289efd;border-radius: 10000px;color: #289efd;line-height: 2.1rem;}
  .service .btn.do{color: #fff;background-color: #289efd;}
  .cons .order_l,.cons .zx_l,.cons .service_l,.cons .track_l{float: left;color: #666;}
  .cons .order_r,.cons .zx_r,.cons .service_r,.cons .track_r{float: right;}
  .zx .cons_p .zx_l,.track .cons_p .track_l{width: 20%;}
  .zx .cons_p .zx_r,.track .cons_p .track_r{width: 78%;text-align: right;}
  .zx .cons_p .zx_r.zx_chang,.track .cons_p .track_r.track_chang{text-align: left;line-height: 2rem;padding: 1.3rem 0;}
  .zx .cons_p .zx_r.zx_img{width: 10rem;padding: 1.3rem 0;}
  .track .track_r p{overflow: hidden;line-height: 3rem;padding: .5rem 0;}
  .track .track_r .track_r_l{float: left;width: 80%;text-overflow: ellipsis;overflow: hidden;}
  .track .track_r .track_r_r{float: right;height: 2.1rem;width: 4.3rem;color: #fff;background-color: #289efd;border-radius: 1000px;text-align: center;line-height: 2.1rem;margin-top: .4rem;}
</style>
