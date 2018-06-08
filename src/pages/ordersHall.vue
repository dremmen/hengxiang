<template>
  <div>
    <div class="ordersHall">      
      <tab>
        <tab-item @click.native="orderHall('0', $event)" selected>全部</tab-item>
        <tab-item @click.native="orderHall('1', $event)" class="triangle" :class="time">发布时间</tab-item>
        <tab-item @click.native="orderHall('2', $event)" class="triangle" :class="amount">设计预算</tab-item>
      </tab>
      <scroller class="orderHallList"  
        :on-refresh="refresh"
        :on-infinite="infinite"
        ref="my_scroller">
        <div class="hallCons" v-for="(orders, index) in orders_list" :key="index" @click = "hrefFn(orders.bid_id)">
          <p>{{orders.rei_name}}{{orders.house_type_name}}</p>
          <ul>
            <li>
              <span class="icon_orderhall"><img src="../assets/img/ordersHall1.png"></span>
              <span>房屋类型：</span>
              <span>{{orders.house_type_name}}</span>
            </li>
            <li>
              <span class="icon_orderhall"><img src="../assets/img/ordersHall2.png"></span>
              <span>风格类型：</span>
              <span><span v-for="(house_styles, index) in orders.house_styles_list" :key="index" class="house_styles">{{house_styles.tag_name}}</span></span>
            </li>
            <li>
              <span class="icon_orderhall"><img src="../assets/img/ordersHall3.png"></span>
              <span>发布时间：</span>
              <span>{{orders.time}}</span>
            </li>
          </ul>
          <div class="price_con">
            <p class="area">{{orders.house_area}}㎡</p>
            <p class="price">￥{{orders.amount}}</p>
          </div>
        </div>
      </scroller>
      <router-link to="/fabiao">我要发标</router-link>
    </div>
  </div>
</template>

<script>

  import { Tab, TabItem } from 'vux'
  import { baseURL, ordersHall } from '../api/api'

  export default {
    components: {
      Tab,
      TabItem,
    },
    data () {
      return {
        index: 0,
        page: 6,
        orders_list: [],
        curpage: 1,
        page_total: 11111,
        is_bool: false,
        data: '',
        time: 'triangle_desc',
        amount: 'triangle_desc'
      }
    },
    created() {
      this._ordersHall()
    },
    methods: {
      refresh (done) {
        setTimeout(function () {
          done();
        }, 1500)
      },

      infinite (done) {
        var _this = this
        if(_this.curpage >= _this.page_total) {
          this.$refs.my_scroller.finishInfinite(true)
          return
        }
        setTimeout(function () {
          if(!_this.is_bool){
            _this.is_bool = true
          }else{
            _this.curpage++
            _this._ordersHall()
            _this.$refs.my_scroller.resize();              
          }
          done();
        }, 1500)
      },
      _ordersHall () {
        ordersHall(this.page, this.curpage, this.data).then((res) => {
          this.is_bool = false
          this.page_total = res.data.page_total
          for(var i in res.data.items){
            res.data.items[i].time = this.timeStamp(res.data.items[i].start_time)
            this.orders_list.push(res.data.items[i])
          }
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
      hrefFn (bid) {
        this.$router.push({path: '/biaoshuDetails',query:{ bid: bid}});
      },
      orderHall (type, $event) {
        var data_class = $event.target.className
        console.log(data_class)
        this.orders_list = []
        if(type == '0'){
          this.time = 'triangle_desc'
          this.amount = 'triangle_desc'
          this.data = ''
        }else if(type == '1'){
          this.amount = 'triangle_desc'
          if(data_class.indexOf('triangle_asc') > -1){
            this.time = 'triangle_desc'  
            this.data = '&order=start_time desc'      
          }else {
            this.time = 'triangle_asc'  
            this.data = '&order=start_time asc'          
          }
        }else if(type == '2'){
          this.time = 'triangle_desc'
          if(data_class.indexOf('triangle_asc') > -1){
            this.amount = 'triangle_desc'  
            this.data = '&order=amount desc'      
          }else {
            this.amount = 'triangle_asc'   
            this.data = '&order=amount asc'            
          }       
        }
        this._ordersHall()
      }
    }
  }
</script>

<style type="text/css" scoped>
  a{text-decoration-line: none;}
  .vux-tab .vux-tab-item.vux-tab-selected {color: #37beb7!important;border-bottom: 3px solid #37beb7!important;}
  .ordersHall{background-color: #f0f0f0;height: 100%;min-height: 100vh;padding-bottom: 11.3rem;box-sizing: border-box;}
  .hallCons{background-color: #fff;margin-top: 1rem;padding: 1rem 1.2rem;position: relative;}
  .hallCons>p{line-height: 3.4rem;color: #333;font-size: 1.4rem;}
  .hallCons li{line-height: 2.4rem;color: #666;font-size: 1.2rem;}
  .price_con{position: absolute;bottom: 1rem;right: 1.2rem;}
  .price_con .area{color: #666;font-size: 1.6rem;text-align: right;}
  .price_con .price{color: #fe5146;font-size: 1.8rem;}
  .ordersHall > a{height: 4.3rem;line-height: 4.3rem;color: #fff;font-size: 1.6rem;text-align: center;background-color: #fe5146;display: block;width: 93%;position: fixed;left: 3.5%;border-radius: 1000px;bottom: 6rem;}
  .house_styles{margin-right: .5rem;}
  .icon_orderhall{display: inline-block;position: relative;top: .2rem;}
  .orderHallList{position: relative!important;height: calc(100vh - 15rem)!important;}

  .vux-tab .vux-tab-item{position: relative;}
  .triangle:after{position: absolute;border-color: transparent;border-width: 7px;content: "";top: 15px;right: 1rem;border-style: solid}
  .triangle.vux-tab-selected.triangle_desc:after {top: 1.5rem;border-color: #35c4bb transparent transparent transparent;}
  .triangle.vux-tab-selected.triangle_asc:after {border-color: transparent transparent #35c4bb transparent;top: 1rem;}
  .triangle.triangle_desc:after {top: 1.5rem;border-color: #999 transparent transparent transparent;}
  
</style>
