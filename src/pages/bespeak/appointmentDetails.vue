<template>
	<div class="appointmentDetails">	
		<p class="time">预约时间：{{appointmentDetails.start_time}}</p>
		<div class="eduit">
		    <group>
		      <cell title="预约服务" :value="appointmentDetails.appointment_type" is-link></cell>
		      <cell title="设计费用预算" :value="appointmentDetails.amount+'元'" is-link></cell>
		      <cell title="设计师" :value="appointmentDetails.designer_name" is-link></cell>
		      <cell title="房屋类型" :value="appointmentDetails.house_condition" is-link></cell>
		      <cell title="面积" :value="appointmentDetails.house_area+'㎡'" is-link></cell>
		      <cell title="户型" :value="appointmentDetails.house_type_name" is-link></cell>
		      <cell title="居住小区" :value="appointmentDetails.rei_name" is-link></cell>
		      <cell title="装饰风格" v-if="appointment_type === '1'" :value="appointmentDetails.house_style" is-link></cell>
		    </group>
		    <div class="service_items" v-if="appointment_type === '2'">
		    	<p>服务项目</p>
		    	<checklist disabled :options="commonList" v-model="service_model"></checklist>
		    </div>
		    <div class="style_images" v-if="appointment_type === '1'">
		    	<span class="style_hx">户型图</span>
		    	<span class="style_img"><img :src="appointmentDetails.house_type_img"></span>
		    </div>
		    <div class="mask_explain">
		    	<p class="explain">备注说明</p>
		    	<p class="explain_con">{{appointmentDetails.remark}}</p>
		    </div>
		</div>
		<p class="price" v-if="order_types>0">
			<span class="left">设计师报价</span>
			<span class="right">{{appointmentDetails.amount}}元</span>
		</p>
				
	</div>
</template>

<script type="text/javascript">
	import { Group, Cell, Checklist } from 'vux'
  import { baseURL, appointmentDetails } from '../../api/api'
	
	export default {
	  components: {
	    Group,
	    Cell,
	    Checklist
	  },
    data () {
      return {
      	appointmentDetails: {},
      	type: '',
      	order_types: '',
      	commonList: [],
      	service_model: [],
      }
    },
    created() {
    	this.appointment_id = this.$route.query.appointment_id
    	this.appointment_type = this.$route.query.appointment_type
      this._appointmentList()
    },
	  methods: {
      _appointmentList(){
        appointmentDetails(this.appointment_id).then((res) => {
          if(res.data.data){return}
          this.appointmentDetails = res.data.items
        	this.appointmentDetails.start_time = this.timeStamp(this.appointmentDetails.start_time)
        	this.appointmentDetails.appointment_type = this.is_designer(this.appointmentDetails.appointment_type)
        	this.appointmentDetails.house_condition = this.is_new(this.appointmentDetails.house_condition)
        	this.appointmentDetails.house_style = ''
        	for(var i in this.appointmentDetails.house_styles_list){
            this.appointmentDetails.house_style += this.appointmentDetails.house_styles_list[i].tag_name+' '
          }
          for(var i in this.appointmentDetails.service_items_list){
            this.commonList.push(this.appointmentDetails.service_items_list[i].item_name)
          }
          this.service_model = this.commonList
          this.order_types = this.appointmentDetails.order_type
        	console.log(this.appointmentDetails)
        })
      },
      is_designer (num) {
        switch(num){
          case '1':
              return '设计师';
          break;

          case '2':
              return '监理';
          break;
        }
      },
      is_new (num) {
        switch(num){
          case '1':
              return '新房';
          break;

          case '2':
              return '旧房';
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
    }
	}
</script>

<style type="text/css" scoped>
	.appointmentDetails{padding-bottom: 5rem;}
	.time{line-height: 4.4rem;color: #333;font-size: 1.4rem;padding-left: 1.2rem;background-color: #fff;border-bottom: .05rem solid #efefef;height: 4.4rem;}
	.eduit{padding: 0 1.2rem;background-color: #fff;padding-bottom: 1rem;}
	.style_images{padding: 1rem 0;background-color: #fff;overflow: hidden;border-bottom: .05rem solid #efefef;}
	.style_images .style_hx{font-size: 1.4rem;color: #666;float: left;line-height: 10rem;}
	.style_images .style_img{width: 10rem;height: 10rem;float: right;}
	.mask_explain p.explain{line-height: 4.4rem;color: #666;height: 4.4rem;font-size: 1.4rem;}
	.mask_explain p.explain_con{background-color: #eee;padding: 0 1rem;color: #666;border-radius: 4px;line-height: 2rem;letter-spacing: .1rem;min-height: 12rem;}
	.price{overflow: hidden;line-height: 4.4rem;padding: 0 1.2rem;margin: 1rem 0;background-color: #fff;font-size: 1.4rem;}
	.price .left{float: left;color: #666;}
	.price .right{float: right;color: #999;}

	.service_items>p{line-height: 2.4rem;height: 2.4rem;color: #666;font-size: 1.4rem;padding-top: 1rem;}
</style>

		