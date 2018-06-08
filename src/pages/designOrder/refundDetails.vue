<template>
  <div class="refund">
    <div class="refundDetails">
    	<icon type="success"></icon>
    	<p>退款完成</p>
    </div>
    <div class="cons">
    	<p class="title">退款处理</p>
    	<div class="cons_p">
    		<div class="cons_l"></div>
    		<div class="cons_r">
    			<p>{{refund_list.member_name}}于{{extend_demand.createTime}}创建了退款申请。</p>
    			<p>退款原因：{{refund_list.reason_info}}</p>
    			<p>退款金额：￥{{refund_list.refund_amount}}</p>
    			<p>退款描述：{{refund_list.member_message}}</p>
    		</div>
    	</div>
    	<div class="cons_p">
    		<div class="cons_l"></div>
    		<div class="cons_r">
    			<p>{{refund_list.designer_name}}于{{refund_list.addTime}}同意了退款申请。</p>
    			<p>设计师备注：{{refund_list.designer_message}}</p>
    		</div>
    	</div>
    	<div class="cons_p">
    		<div class="cons_l"></div>
    		<div class="cons_r">
    			<p>平台于{{refund_list.addTime}}退款给买家￥{{refund_list.refund_amount}}元</p>
    		</div>
    	</div>
    </div>
    <div class="refund_con">
    	<p class="title">退款信息</p>
    	<div class="refund_p">
    		<div class="refund_l">户型</div>
    		<div class="refund_r">{{extend_demand.house_type_name}}</div>
    	</div>
    	<div class="refund_p">
    		<div class="refund_l">面积</div>
    		<div class="refund_r">{{extend_demand.house_area}}㎡</div>
    	</div>
    	<div class="refund_p">
    		<div class="refund_l">风格</div>
    		<div class="refund_r">{{extend_demand.house_style}}</div>
    	</div>
    	<div class="refund_p">
    		<div class="refund_l">类型</div>
    		<div class="refund_r" v-if="is_charge == '1'">收费</div>
        <div class="refund_r" v-else>免费</div>
    	</div>
    	<div class="refund_p">
    		<div class="refund_l">设计师</div>
    		<div class="refund_r">{{refund_list.designer_name}}</div>
    	</div>
    	<div class="refund_p" v-if="extend_item.length > 0">
    		<div class="refund_l">服务项</div>
    		<div class="refund_r">
    			<p v-for="(item, index) in extend_item">{{item.item_name}} : {{item.account_rate}}% X {{order_info.pay_amount}} = {{item.price}}</p>
    		</div>
    	</div>
    	<div class="refund_p">
    		<div class="refund_l">退款原因</div>
    		<div class="refund_r">{{refund_list.reason_info}}</div>
    	</div>
    	<div class="refund_p">
    		<div class="refund_l">退款金额</div>
    		<div class="refund_r">￥{{refund_list.refund_amount}}</div>
    	</div>
    	<div class="refund_p">
    		<div class="refund_l">申请时间</div>
    		<div class="refund_r">{{extend_demand.createTime}}</div>
    	</div>
    	<div class="refund_p">
    		<div class="refund_l">退款编号</div>
    		<div class="refund_r">{{extend_demand.refund_sn}}</div>
    	</div>
    </div>
  </div>
</template>

<script>

  import { Icon } from 'vux'
  import { refundDetails } from '../../api/api'

  export default {
    components: {
    	Icon
    },
    data () {
      return {
        refund_list: {},
        extend_demand: {},
        is_charge: '',
        extend_item: [],
        yes_refund_price: '',
      }
    },
    created () {
      this.order_id = this.$route.query.order_id
      this._refundDetails()
    },
    methods: {
      _refundDetails () {
        refundDetails(this.order_id).then((res) => {
          console.log(res)
          this.order_info = res.data.items.order_info
          this.extend_demand = res.data.items.order_info.extend_demand
          this.extend_demand.createTime = this.timeStamp(res.data.items.order_info.create_time)
          this.refund_list = res.data.items.refund_list[0]
          this.refund_list.addTime = this.timeStamp(this.refund_list.add_time)    
          this.is_charge = res.data.items.order_info.order_type      
          for(var i in this.extend_demand.house_styles_list){
            this.extend_demand.house_style += this.extend_demand.house_styles_list[i].tag_name+' '
          }
          var not_refund_price = 0
          for(var i in this.order_info.extend_item){
            if(this.order_info.extend_item[i].item_state == '20'){
              this.extend_item.push(this.order_info.extend_item[i])           
              this.order_info.extend_item[i].price = this.order_info.extend_item[i].account_rate / 100 * this.order_info.pay_amount
              not_refund_price += this.order_info.extend_item[i].price
            }
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
    }
  }
</script>

<style type="text/css" scoped>
	.refund{background-color: #f0f0f0;height: 100%;min-height: 100vh;margin-bottom: 5rem;}
	.refundDetails{margin-bottom: 1rem;background-color: #fff;padding-bottom: 1rem;}
	.refundDetails .weui-icon-success{font-size: 4.6rem;position: relative;left: 50%;margin-top: 1.5rem;margin-left: -2.3rem;}
	.refundDetails 	.weui-icon-success:before{margin: 0;}
	.refundDetails > p{text-align: center;font-size: 1.6rem;color: #000;line-height: 2.4rem;margin-top: .8rem;}

	.cons,.refund_con{background-color: #fff;border-bottom: 1rem solid #f0f0f0;}
  .cons .title,.refund_con .title{line-height: 4.4rem;height: 4.4rem;font-size: 1.4rem;border-bottom: .05rem solid #eee;padding-left: 1.2rem;}
  .cons .cons_p{overflow: hidden;margin: 0 1.2rem;border-bottom: .05rem solid #eee;line-height: 2.4rem;font-size: 1.4rem;padding: 1rem 0;}
  .cons .cons_p:nth-last-child(1){border-bottom: 0;}
  .cons .cons_l{float: left;width: 5%;}
  .cons .cons_l:after{content: "";width: .4rem;height: .4rem;border-radius: 50%;background-color: #000;position: relative;top: 1rem;left: 50%;margin-left: -.2rem;display: block;}
  .cons .cons_r{float: right;width: 95%;}
  .refund_con .refund_p{margin: 0 1.2rem;border-bottom: .05rem solid #eee;line-height: 2.4rem;font-size: 1.4rem;padding: 1rem 0;overflow: hidden;}
  .refund_con .refund_l{float: left;color: #666;}
  .refund_con .refund_r{float: right;}
</style>
