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
					<span>设计师：{{extend_designer.designer_name}}</span>
				</p>
				<p class="cons">
					<span>金额：<span class="color_red">￥{{extend_demand.amount}}</span>元</span>
				</p>
			</div>
			<div class="order_eva">
				<p>整体评价<rater active-color="#36c3bf" v-model="evaluation_star"></rater></p>
				<p>服务态度<rater active-color="#36c3bf" v-model="service_star"></rater></p>
				<p>描述相符<rater active-color="#36c3bf" v-model="describe_star"></rater></p>
			</div>
			<x-textarea :max="120" placeholder="请在此描述您的问题" v-model="comment"></x-textarea>
			<div class="img">				
				<input type="file" name="file" id="avatar" class="testinput" @change="addFile" accept="image/jpeg,image/jpg,image/png">
	      <label for="avatar" class="testdemo">
	      </label>
	      <div v-for="(item, index) in imageArr" :key="index" class="img_div">
	      	<img :src="item.file_url" class="img-avatar">
	      	<span class="close" @click="close(index)"></span>
	      </div>
			</div>
			<!-- <p class="orderDetails niming">
				<span class="order_num"><input type="radio" name="">匿名</span>
				<span class="time">您写的评价会已匿名的形式展现</span>
			</p> -->
		</div>
		<span class="btn" @click="upload()">提交</span>
	</div>
</template>

<script type="text/javascript">
	import { Rater, XTextarea, AlertModule } from 'vux'
	import { evaluate, supervisionOrderDetails, supervisionOrderEvaluate } from '../../api/api'
	import qs from 'qs'

	export default {
	  components: {
	    Rater,
	    XTextarea
	  },
	  data () {
	  	return {
	  		evaluation_star: 0,
	  		service_star: 0,
	  		describe_star: 0,
	  		imageUrl: '',
	  		imageArr: [],
	  		imageNames: '',
	  		hookflag: false, 
	  		imgFileData: new FormData(),
	  		comment: '',
	  		order_info: {},
	  		extend_demand: {},
	  		extend_designer: {},
	  	}
	  },
	  created () {
			this.order_id = this.$route.query.order_id
			this._supervisionOrderDetails()
	  },
	  methods: {
	  	_supervisionOrderDetails () {
	  		supervisionOrderDetails(this.order_id).then((res) => {
	  			this.order_info = res.data.items.order_info
	  			this.extend_demand = this.order_info.extend_demand
	  			this.extend_designer = this.order_info.extend_designer
	  			this.order_info.startTime = this.timeStamp(this.order_info.extend_demand.start_time)
	  			this.order_info.extend_demand.style = ''
	  			for(var i in this.order_info.extend_demand.house_styles_list){
	  				this.order_info.extend_demand.style += this.order_info.extend_demand.house_styles_list[i].tag_name + ' '
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
      upload () {
      	var _this = this
      	var imageNames = this.imageNames.substr(0, this.imageNames.length-1);
      	var jsonData = {
      		order_id: this.order_id,      		
			overall_satisfaction_scores: this.evaluation_star,
			service_attitude_scores: this.service_star,
			description_consistent_scores: this.describe_star,
			comment: this.comment,
			evaluate_image: imageNames
      	}
      	supervisionOrderEvaluate(qs.stringify(jsonData)).then((res) =>  {
      		AlertModule.show({
	          title: '系统提示',
	          content: res.data.msg,
		        onHide () {
		          _this.$router.push({path: 'supervisionOrder'})
		        }
	        })	
      	})
      }
	  }
	}
</script>

<style type="text/css" scoped>
	.designOrderEva{height: 100%;background-color: #f0f0f0;height: 100vh;}
	.designOrderEva_con{background-color: #fff;}
	.designOrderEva_con>p{overflow: hidden;line-height: 4.4rem;height: 4.4rem;font-size: 1.4rem;color: #333;padding: 0 1.2rem;}
	.designOrderEva_con>p span.order_num{float: left;}
	.designOrderEva_con>p span.time{float: right;}
	.orderDetails_con{margin: 0 1.2rem;background-color: #eee;padding: 1rem 0;}
	.orderDetails_con .cons{overflow: hidden;padding: 0 1rem;}
	.orderDetails_con .cons span{float: left;width: 48%;line-height: 2.4rem;font-size: 1.4rem;color: #999;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin-right: 2%;}
	.orderDetails_con .cons span .color_red{color: #f80001;float: none;}
	.order_eva{border-bottom: .05rem solid #efefef;margin: 0 2.2rem;margin-top: 1rem;padding-bottom: .5rem;}
	.order_eva > p{font-size: 1.4rem;color: #999;}
	.order_eva .vux-rater{margin-left: 1rem;}
	.weui-cell{margin: 0 2.2rem;height: 13.8rem;background-color: #eee;border-radius: 4px;margin-top: 1rem;}
	.weui-cell textarea{background-color: #eee;width: 100%;height: 13.8rem;font-size: 1.4rem;padding: 0 1rem;box-sizing: border-box;}
	.weui-cell .weui-textarea-counter{display: none;}
	.img{padding: 1.8rem 2.2rem;}
	.img img{width: 20vw;height: 20vh;vertical-align: middle;}
	#avatar{display: none;}
	.testdemo{width: 3.9rem;height: 3.4rem;background-image: url(../../assets/img/upload_img.png);display: inline-block;vertical-align: middle;margin-right: 1.5rem;background-size: 100% 100%;}
	.img .img_div{display: inline-block;margin-left: .5rem;vertical-align: middle;position: relative;}
	.img_div .close{position: absolute;right: 0;top: 0;width: 1.6rem;height: 1.6rem;background-image: url(../../assets/img/close.png);background-size: 100% 100%;}
	.designOrderEva_con>p span.order_num input{margin-right: .5rem;position: relative;top: .2rem;}
	.designOrderEva_con>p.niming{margin: 0 2.2rem;border-top: .05rem solid #eee;padding: 0;}
	.btn{position: fixed;bottom: 6rem;height: 4.3rem;width: 97%;margin: 0 1.5%;border-radius: 1000px;color: #fff;text-align: center;line-height: 4.3rem;background-color: #12c098;font-size: 1.6rem;cursor: pointer;}
</style>