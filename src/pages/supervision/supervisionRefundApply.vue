<template>
	<div class="designOrderEva">
		<div class="designOrderEva_con">
			<p class="orderDetails">
				<span class="order_num">订单编号：{{order_info.order_sn}}</span>
				<!-- <span class="time">{{order_info.startTime}}</span> -->
			</p>
			<div class="orderDetails_con">
				<p class="cons">
					<span>户型：{{extend_demand.house_type_name}}</span>
					<span>面积：{{extend_demand.house_area}}㎡</span>
				</p>
				<p class="cons">
					<span>实付款：￥{{order_info.pay_amount}}</span>
					<span>设计师：{{extend_designer.designer_name}}</span>
				</p>
			</div>
			<div class="order_eva">
				<p v-for="(item, index) in extend_item">{{item.item_name}} : {{item.item_price}}</p>
			</div>
			<div class="refund_reson">
				<popup-radio title="退款原因" :options="resons" v-model="reson"></popup-radio>
			</div>
			<div class="refund_reson">
				<p class="cons">
					<span class="cons_l">退款金额</span>
					<input class="cons_r" placeholder="请输入退款金额" v-model="refund_price" />
				</p>
			</div>
			<div class="refund_reson">
				<p class="mask">退款说明</p>
				<x-textarea class="refund" placeholder="退款说明" v-model="buyer_message" ></x-textarea>
			</div>			
			<div class="img">				
				<input type="file" name="file" id="avatar" class="testinput" @change="addFile" accept="image/jpeg,image/jpg,image/png">
	      <label for="avatar" class="testdemo">
	      </label>
	      <div v-for="(item, index) in imageArr" :key="index" class="img_div">
	      	<img :src="item.file_url" class="img-avatar">
	      	<span class="close" @click="close(index)"></span>
	      </div>
			</div>
		</div>
		<span class="btn" @click="_supervisionRefundSubmit()">提交</span>
	</div>
</template>

<script type="text/javascript">
	import { Rater, XTextarea, PopupRadio, AlertModule } from 'vux'
	import { supervisionRefund_reason, supervisionRefundDetails, supervisionRefundSubmit, evaluate } from '../../api/api'
	import qs from 'qs'
	
	export default {
	  components: {
	    Rater,
	    XTextarea,
	    PopupRadio 
	  },
	  data () {
	  	return {
	  		eva_start: 3,
	  		reson: '请选择退款理由',
	  		resons: [],
	  		order_info: {},
	  		extend_demand: {},
	  		extend_designer: {},
	  		refund_price: '',
	  		yes_refund_price: '',
	  		buyer_message: '',
	  		imageNames: '',
	  		imageArr: [],
	  		imgFileData: new FormData(),
	  		extend_item: [],
	  	}
	  },
	  created () {
			this.order_id = this.$route.query.order_id
			this._supervisionRefund_reason()
			this._supervisionRefundDetails()
	  },
	  methods: {
	  	_supervisionRefundDetails () {
	  		supervisionRefundDetails(this.order_id).then((res) => {
	  			console.log(res)
	  			this.order_info = res.data.items.order_info
	  			this.extend_demand = this.order_info.extend_demand
	  			this.extend_designer = this.order_info.extend_designer
	  			this.order_info.startTime = this.timeStamp(this.order_info.extend_demand.start_time)
	  			this.order_info.extend_demand.style = ''
	  			for(var i in this.order_info.extend_demand.house_styles_list){
	  				this.order_info.extend_demand.style += this.order_info.extend_demand.house_styles_list[i].tag_name + ' '
	  			}
	  			var not_refund_price = 0
	  			for(var i in this.order_info.extend_item){
	  				if(this.order_info.extend_item[i].item_state == '20'){
	  					this.extend_item.push(this.order_info.extend_item[i])	  					
		  				not_refund_price += this.order_info.extend_item[i].item_price
	  				}
	  			}
	  			this.yes_refund_price = this.order_info.pay_amount - not_refund_price
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
      addFile($event) {
      	if(this.imageArr.length>=3){
      		AlertModule.show({
            title: '系统提示',
            content: '最多三张图片',
          })
					return;
      	}
        this.avatar_file = $event.target.files[0]
        this.imgFileData.append('idpics', this.avatar_file)
        evaluate(this.imgFileData).then((res) => {
        	this.imageArr.push(res.data.data)
        	this.imageNames += res.data.data.file_name + ','
        })
      },
      close (index) {
      	var imgArr1 = this.imageArr.slice(0, index)
      	var imgArr2 = this.imageArr.slice(index+1, 3)
      	this.imageArr = []
      	this.imageArr = [...imgArr1, ...imgArr2]
      },
	  	_supervisionRefund_reason () {
	  		supervisionRefund_reason().then((res) => {
	  			for(var i in res.data.items){
	  				this.resons.push(res.data.items[i])
	  				this.resons[i].value = res.data.items[i].reason_info
	  				this.resons[i].key = res.data.items[i].reason_id
	  			}
	  		})
	  	},
	  	_supervisionRefundSubmit () {
	  		if(this.reson == "请选择退款理由"){
	  			AlertModule.show({
	          title: '系统提示',
	          content: '请选择退款理由'
	        })
	        return
	  		}
	  		var _this = this
      		var imageNames = this.imageNames.substr(0, this.imageNames.length-1);
	  			console.log(this.yes_refund_price, this.refund_price)
	  		if(this.refund_price <= this.yes_refund_price && this.refund_price>0){
	  			var jsonData = {
	  				order_id: this.order_id,
	  				refund_money: this.refund_price,
	  				reason_id: this.reson,
	  				buyer_message: this.buyer_message,
	  				refund_images: imageNames
	  			}
	  			supervisionRefundSubmit(qs.stringify(jsonData)).then((res) => {
	  				if(res.data.status = "true"){
	  					AlertModule.show({
			          title: '系统提示',
			          content: res.data.msg,
			          onHide () {
			          	_this.$router.push({path: 'refundDetails', query:{'order_id': this.order_id}})
			          }
			        })	
            }else{
              AlertModule.show({
			          title: '系统提示',
			          content: res.data.msg
			        })
            }  
	  			})	  		
	  		}else{
	  			AlertModule.show({
	          title: '系统提示',
	          content: '您填写的金额大余您所剩的金额！',
	        })	
	  		}
	  	}
	  }
	}
</script>

<style type="text/css" scoped>
	.designOrderEva{height: 100%;background-color: #f0f0f0;height: 100vh;padding-bottom: 10rem;}
	.designOrderEva_con{background-color: #fff;padding-bottom: 1rem;}
	.designOrderEva_con>p{overflow: hidden;line-height: 4.4rem;height: 4.4rem;font-size: 1.4rem;color: #333;padding: 0 1.2rem;}
	.designOrderEva_con>p span.order_num{float: left;}
	.designOrderEva_con>p span.time{float: right;}
	.orderDetails_con{background-color: #eee;padding: 1rem 0;margin: 0 1.2rem;}
	.orderDetails_con .cons{overflow: hidden;padding: 0 1.2rem;}
	.orderDetails_con .cons span{float: left;width: 48%;line-height: 2.4rem;font-size: 1.4rem;color: #999;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin-right: 2%;}
	.order_eva{padding: 0 1.2rem;margin-top: 1rem;padding-bottom: .5rem;border-bottom: 1rem solid #f0f0f0;}
	.order_eva > p{font-size: 1.4rem;color: #999;line-height: 2rem;}
	.order_eva .vux-rater{margin-left: 1rem;}

	.refund_reson .cons{overflow: hidden;margin: 0 1.2rem;border-bottom: .05rem solid #eee;line-height: 4.4rem;font-size: 1.4rem;color: #999;}
	.refund_reson .cons_l{float: left;color: #666;}
	.refund_reson .cons_r{float: right;}
	.refund_reson input.cons_r{line-height: 4.2rem;border: none;outline: none;height: 4.2rem;position: relative;top: .1rem;text-align: right;width: 65%;}
      
	.refund_reson > p.mask{line-height: 4.4rem;font-size: 1.4rem;color: #666;padding: 0 1.2rem;}
	.img{padding: 1.8rem 2.2rem;}
	.img img{width: 20vw;height: 20vh;vertical-align: middle;}
	#avatar{display: none;}
	.testdemo{width: 3.9rem;height: 3.4rem;background-image: url(../../assets/img/upload_img.png);display: inline-block;vertical-align: middle;margin-right: 1.5rem;background-size: 100% 100%;}
	.img .img_div{display: inline-block;margin-left: .5rem;vertical-align: middle;position: relative;}
	.img_div .close{position: absolute;right: 0;top: 0;width: 1.6rem;height: 1.6rem;background-image: url(../../assets/img/close.png);background-size: 100% 100%;}

	.btn{position: fixed;bottom: 6rem;height: 4.3rem;width: 96.8%;margin: 0 1.6%;border-radius: 1000px;color: #fff;text-align: center;line-height: 4.3rem;background-color: #12c098;font-size: 1.6rem;}
</style>