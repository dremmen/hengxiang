<template>
	<div class="fabiao">	
		<div class="eduit">
			<group>
			  <x-input title="您的称呼" name="username" placeholder="请输入姓名" v-model="username"></x-input>
			</group>	
			<group>
			  <x-input title="手机号" placeholder="请输入手机号" v-model="phone"></x-input>
			</group>	
	    <group>
	      <popup-radio title="房屋类型" :options="house" v-model="house_type" placeholder="请选择房屋类型"></popup-radio>
	    </group>
			<group>
			  <x-input title="您的房屋面积" placeholder="单位：㎡" v-model="house_area"></x-input>
			</group>			
	    <group>
	      <popup-radio title="预约服务" :options="appointment" v-model="appointment_type" placeholder="请选择预约服务"></popup-radio>
	    </group>
			<group>
			  <x-input title="您的预算" placeholder="单位：元" v-model="budget"></x-input>
			</group>
	    <group>
	      <popup-radio title="所在小区" :options="area" v-model="house_rei" placeholder="请选择所在小区"></popup-radio>
	    </group>	
	    <group>
	      <popup-radio title="房屋户型" :options="house_hu" v-model="huxing" placeholder="请选择房屋户型" @on-hide="getImg()"></popup-radio>
	    </group>
	    <div class="service_items" v-if="appointment_type==2">
	    	<p>服务项目</p>
	    	<checklist :options="service_List" v-model="service_item"></checklist>
	    </div>
	    <div class="eduit_house_hu" v-else>
	    	<p>户型图</p>
	    	<div class="images">
	    		<span class="img_other" @click="imgClick(0, -1)" :class="{active:-1==imgspan}">其他</span>
	    		<span class="img_other" v-for="(img, index) in house_img" :key="index" :class="{active:index==imgspan}" @click="imgClick(img.house_type_img_id, index)"><img :src="img.house_type_imgs"></span>
	    	</div>
	    </div>
	    <div v-if="appointment_type==2"></div>
	    <div class="eduit_style" v-else>
	    	<p>您想要的装修风格</p>
	    	<div class="style_tags">
	    		<span v-for="(type, index) in typeAll.style" :key="index" @click="styleClick(type.tag_id, $event)">{{type.tag_name}}</span>
	    	</div>
	    </div>
	    <div class="eduit_explain">
	    	<p>备注说明</p>
		      <x-textarea placeholder="请输入..." v-model="mark" autosize></x-textarea>
	    </div>
		</div>
		<div class="btn">
			<span @click="supervisor_appointment()" v-if="appointment_type==2">提交</span>
			<span @click="design_appointment()" v-else>提交</span>
		</div>
	</div>
</template>

<script type="text/javascript">
	import { XInput, Group, PopupRadio, XTextarea, AlertModule, Checklist } from 'vux'
	import { baseURL, getRei, getHouseImg, designAppointment, serviceApi } from '../../api/api'
	import qs from 'qs'
	export default {
	  components: {
	    XInput,
	    Group,
	    PopupRadio,
	    XTextarea,
	    Checklist
	  },
	  data () {
	    return {
	      house: [{
	        key: '1',
	        value: '新房'
	      }, {
	        key: '2',
	        value: '旧房'
	      }],
	      appointment: [{
	        key: '1',
	        value: '设计'
	      }, {
	        key: '2',
	        value: '监理'
	      }],
	      service_List: [],
	      service_item: [],
	      house_hu: [],
	      area: [],
	      typeAll: {},
	      username: '',
	      phone: '',
	      house_type: '',
	      house_area: '',
	      budget: '',
	      huxing: '',
	      house_rei: '',
	      mark: '',
	      style_tag_id: [],
	      house_img: [],
	      img_id: '',
	      imgspan: -1,
	      appointment_type: '',
	    }
	  },
    created() {
    	this.designer_id = this.$route.query.designer_id
      this._getRei()
      this._getServiceItems()
    },
	  methods: {
	    supervisor_appointment () {
	    	var _this = this
	    	var rei = this.house_rei.split("+")
	    	var service_items = ''
	    	for(var i in this.service_item){
	    		service_items += (i == this.service_item.length-1) ? this.service_item[i] : this.service_item[i] + ','
	    	}
	    	var jsonData = {
	    		owner_name: this.username,
	    		owner_phone: this.phone,
	    		house_area: this.house_area,
	    		budget: this.budget,
	    		house_condition: this.house_type,
	    		rei_id: rei[0],
	    		rei_name: rei[1],
	    		house_type_id: this.huxing,
	    		remark: this.mark,
	    		appointment_type: this.appointment_type,
	    		designer_id: this.designer_id,
	    		service_items: service_items
	    	}
	    	designAppointment(qs.stringify(jsonData)).then((res) => {
	    		if(res.data.status == 'false'){
		        AlertModule.show({
		          title: '系统提示',
		          content: res.data.msg
		        })
		        return;
	    		}else{
	    			AlertModule.show({
		          title: '系统提示',
		          content: '添加成功',
			        onHide () {
			          _this.$router.push({path: 'bespeak'});
			        }
		        })		       
	    		}	    		
	    	})
	    },
	    design_appointment () {
	    	var _this = this
	    	var rei = this.house_rei.split("+")
	    	var jsonData = {
	    		owner_name: this.username,
	    		owner_phone: this.phone,
	    		house_area: this.house_area,
	    		budget: this.budget,
	    		house_condition: this.house_type,
	    		rei_id: rei[0],
	    		rei_name: rei[1],
	    		house_type_id: this.huxing,
	    		house_type_img_id: this.img_id,
	    		tag_ids: this.style_tag_id,
	    		remark: this.mark,
	    		appointment_type: this.appointment_type,
	    		designer_id: this.designer_id
	    	}
	    	designAppointment(qs.stringify(jsonData)).then((res) => {
	    		if(res.data.status == 'false'){
		        AlertModule.show({
		          title: '系统提示',
		          content: res.data.msg
		        })
		        return;
	    		}else{
	    			AlertModule.show({
		          title: '系统提示',
		          content: '添加成功',
			        onHide () {
			          _this.$router.push({path: 'bespeak'});
			        }
		        })		       
	    		}	    		
	    	})
	    },	    
	    styleClick (tag_id, event) {
	    	if(event.target.className.indexOf('active')>-1){
	    		event.target.className = ''
    			var index = this.style_tag_id.indexOf(tag_id);
					if (index > -1) {
						this.style_tag_id.splice(index, 1);
					}
	    	}else{
	    		event.target.className = 'active'
	    		this.style_tag_id.push(tag_id)
	    	}
	    },
	    imgClick (house_type_img_id, index) {
	    	this.img_id = house_type_img_id
	    	this.imgspan = index
	    },
	    _getRei () {
	    	getRei().then((res) => {
	    		this.typeAll = res.data.items	  
	    		this.house_hu = this.typeAll.house
	    		this.area = this.typeAll.rei
	    		for(var i in this.typeAll.house){
	    			this.house_hu[i].key = this.typeAll.house[i].house_type_id
	    			this.house_hu[i].value = this.typeAll.house[i].house_type_name
	    		}
	    		for(var i in this.typeAll.rei){
	    			this.area[i].key = this.typeAll.rei[i].rei_id+'+'+this.typeAll.rei[i].rei_title
	    			this.area[i].value = this.typeAll.rei[i].rei_title
	    		}
	    	})
	    },
	    getImg () {
	    	this._getHouseImg()
	    },
	    _getHouseImg () {
	    	getHouseImg(this.huxing).then((res) => {
	    		this.house_img = res.data.items
	    	})
	    },
	    _getServiceItems () {
	    	serviceApi().then((res) => {
	    		for(var i in res.data.items){
	    			this.service_List.push(res.data.items[i].item_name)
	    		}
	    	})
	    }
	  }
	}
</script>

<style type="text/css" scoped>
	.eduit{padding: 0 1.2rem;background-color: #fff;}
	.eduit_style p,.eduit_explain>p,.eduit_house_hu>p,.service_items>p{line-height: 2.4rem;height: 2.4rem;color: #666;font-size: 1.4rem;padding: 1rem 0;}
	.service_items>p{padding-bottom: 0rem;}
	.eduit_house_hu .images{overflow: hidden;margin-bottom: 1.3rem;}
	.eduit_house_hu .images .active{border-color: #0097ff;color: #0097ff;}
	.eduit_house_hu .img_other{height: 8.4rem;width: 8.4rem;border: 1px solid #f7f7f7;text-align: center;line-height: 8.4rem;font-size: 1.6rem;float: left;margin-right: 1rem;margin-bottom: .5rem;}
	.eduit_house_hu .img_other img{display: block;width: 100%;height: 100%;}
	.eduit_style .style_tags span{padding: .1rem .8rem;font-size: 1.4rem;color: #fdb03a;border: 1px solid #fdb03a;display: inline-block;margin-bottom: 1.3rem;border-radius: 10000px;margin-right: .5rem;}
	.eduit_style .style_tags span.active{background-color: #fdb03a;color: #fff;}
	.eduit_explain,.eduit_style{border-top: .05rem solid #efefef;}
	.fabiao .btn{padding: 1.2rem;background-color: #f0f0f0;width: 100%;box-sizing: border-box;height: 6.7rem;margin-top: 1rem;}
	.fabiao .btn span{width: 100%;height: 4.3rem;float: left;line-height: 4.3rem;text-align: center;color: #fff;font-size: 1.8rem;background-color: #12c098;border-radius: 10000px;text-decoration-line: none;}
</style>

		