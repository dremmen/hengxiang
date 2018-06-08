<template>
  <div>
    <div class="designOrder">
      <tab>
        <tab-item :selected='all' @on-item-click="_designOrder('')">全部</tab-item>
        <tab-item :selected='state_new' @on-item-click="_designOrder('state_new')">待付款</tab-item>
        <tab-item :selected='state_pay' @on-item-click="_designOrder('state_pay')">设计中</tab-item>
        <tab-item :selected='state_submit' @on-item-click="_designOrder('state_submit')">待确认</tab-item>
        <tab-item :selected='state_noeval' @on-item-click="_designOrder('state_noeval')">待评价</tab-item>
      </tab>
      <div class="listAll">
        <scroller class="designOrderList"  
          :on-refresh="refresh"
          :on-infinite="infinite"
          ref="my_scroller">
          <div class="con_list" v-for="(item, index) in designOrderLists" :key="index">
            <group>
              <cell :title="'订单编号 '+item.order_sn" :value="item.order_status" class="order_status" is-link></cell>
            </group>     
            <group>
              <cell title="小区" :value="item.extend_demand.rei_name" is-link></cell>
            </group>     
            <group>
              <cell title="委托人" :value="item.member_name" is-link></cell>
            </group>     
            <group>
              <cell title="面积" :value="item.extend_demand.house_area+'㎡'" is-link></cell>
            </group>    
            <group>
              <cell title="户型" :value="item.extend_demand.house_type_name" is-link></cell>
            </group> 
            <group>
              <cell title="类型" :value="item.is_price" is-link></cell>
            </group>
            <group>
              <cell title="成交时间" :value="item.endTime" is-link></cell>
            </group>
            <group>
              <cell title="设计费用" class="budget" :value="'￥'+item.pay_amount" is-link></cell>
            </group>
            <span @click="hrefDetails(item.order_id)">查看</span>
            <router-link to="" v-if="(item.order_state == '10')">去支付</router-link>
            <router-link :to="{ path: 'designOrderDetails', query: { order_id: item.order_id }}" v-if="(item.order_state == '30' && item.refund_list.length == '0')">确认</router-link>
            <router-link :to="{ path: 'designOrderEva', query: { order_id: item.order_id }}" v-if="(item.order_state=='40' && item.evaluation_state=='0')">评价</router-link>
            <router-link :to="{ path: 'refundDetails', query: { order_id: item.order_id }}" v-if="(item.refund_list.length>0)">退款详情</router-link>
            <router-link :to="{ path: 'refundApplication', query: { order_id: item.order_id }}" v-if="(item.order_state=='30' && item.lock_state == '0' || item.order_state=='20' && item.lock_state == '0')">申请退款</router-link>
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>

<script>

  import { Tab, TabItem, Group, Cell } from 'vux'
  import {designOrderList} from '../../api/api'

  export default {
    components: {
      Tab,
      TabItem,
      Group, 
      Cell
    },
    data () {
      return {
        index: 0,
        designOrderLists: [],
        type: '',
        curpage: 1,
        page_total: 11111,
        is_bool: false,
        all: false,
        state_new: false,
        state_pay: false,
        state_submit: false,
        state_noeval: false,
      }
    },
    created() {
      if(this.$route.query.state_type){
        this.all = false
        this.state_type = this.$route.query.state_type
        this.type = '&state_type='+this.state_type
        switch (this.state_type) {

          case 'state_new':
            this.state_new = true
          break

          case 'state_pay':
            this.state_pay = true
          break
          
          case 'state_submit':
            this.state_submit = true
          break
          
          case 'state_noeval':
            this.state_noeval = true
          break          

        }  
      }else{
        this.all = true
      }
      this._designOrderList()
    },
    methods: {
      refresh: function (done) {
        setTimeout(function () {
          done();
        }, 1500)
      },

      infinite: function (done) {
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
            _this._designOrderList()
            _this.$refs.my_scroller.resize();              
          }
          done();
        }, 1500)
      },
      _designOrder (type) {
        this.type = (type == '') ? type : '&state_type='+type
        this.designOrderLists = []
        this._designOrderList()
      },
      _designOrderList () {
        designOrderList(this.type, this.curpage).then((res) => {
          if(res.data.status == 'false'){
            this.page_total = 0
            return
          }
          this.is_bool = false
          this.page_total = res.data.page_total
          for(var i in res.data.items){
            res.data.items[i].endTime = this.timeStamp(res.data.items[i].create_time)
            res.data.items[i].is_price = this.is_price(res.data.items[i].order_type)
            res.data.items[i].order_status = this.order_status(res.data.items[i].order_state)
            this.designOrderLists.push(res.data.items[i])
          }
        })
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
      order_status (num) {
        switch(num){

            case '0':
                return '已取消';
            break;

            case '10':
                return '待付款';
            break;

            case '20':
                return '待设计';
            break;

            case '30':
                return '待确认';
            break;

            case '40':
                return '已完成';
            break;
        }
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
      hrefDetails (order_id) {
        this.$router.push({path: 'designOrderDetails', query: { order_id: order_id }});
      }
    }
  }
</script>

<style type="text/css" scoped>
  .vux-tab .vux-tab-item.vux-tab-selected {color: #37beb7!important;border-bottom: 3px solid #37beb7!important;}
  .designOrderList{background-color: #fff;margin-bottom: 5rem;position: relative!important;height: calc(100vh - 9rem)!important;}
  .con_list{padding: 0 1.2rem;overflow: hidden;border-bottom: 1rem solid #f0f0f0;}
  .con_list>p{line-height: 4.4rem;font-size: 1.6rem;color: #5e5e5e;background-color: #fff;border-bottom: .05rem solid #eee;color: #333;}
  .con_list>a{float: right;height: 2.5rem;background-color: #3cc3bf;color: #fff;font-size: 1.4rem;text-align: center;line-height: 2.5rem;border-radius: 10000px;margin: 1rem 0;padding: 0 3rem;text-decoration-line: none;margin-left: .5rem;}
  .con_list>span{float: right;height: 2.5rem;background-color: #3cc3bf;color: #fff;font-size: 1.4rem;text-align: center;line-height: 2.5rem;border-radius: 10000px;margin: 1rem 0;padding: 0 3rem;text-decoration-line: none;margin-left: .5rem;}
</style>
