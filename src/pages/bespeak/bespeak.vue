<template>
  <div>
    <div class="tab">
      <tab>
        <tab-item @on-item-click="judge_designer('')" :selected='all'>全部</tab-item>
        <tab-item @on-item-click="judge_designer('1')" :selected='design'>设计</tab-item>
        <tab-item @on-item-click="judge_designer('2')" :selected='supervison'>监理</tab-item>
      </tab>
      <div class="listAll">
        <scroller class="fabiaoList"  
          :on-refresh="refresh"
          :on-infinite="infinite"
          ref="my_scroller">
          <div class="con_list" v-for="(item, index) in appointmentLists" :key="index">
            <group>
              <cell title="预约详情" class="appointment_details" :value="item.appointmentDetails" is-link></cell>
            </group>   
            <group>
              <cell title="发标时间" :value="item.startTime" is-link></cell>
            </group>     
            <group>
              <cell title="服务类型" :value="item.is_designer" is-link></cell>
            </group>     
            <group>
              <cell title="设计师" :value="item.owner_name" is-link></cell>
            </group>     
            <group>
              <cell title="居住小区" :value="item.rei_name" is-link></cell>
            </group> 
            <group>
              <cell title="户型" :value="item.house_type_name" is-link></cell>
            </group>
            <group>
              <cell title="面积" :value="item.house_area+'㎡'" is-link></cell>
            </group>
            <group>
              <cell title="费用预算" class="budget" :value="'￥'+item.budget" is-link></cell>
            </group>
            <span @click="hrefDetails(item.appointment_id, item.appointment_type)">查看</span>
            <span v-if="(item.appointment_state == '0' || item.appointment_state == '50')" @click="responseFn('delete', item.appointment_id)">删除</span>
            <span v-if="(item.appointment_state == '10' || item.appointment_state == '20')" @click="responseFn('cancel', item.appointment_id)">取消</span>
            <span v-if="(item.appointment_state == '30')" @click="confirmFn(item.appointment_id)">确认订单</span>
            <span v-if="(item.appointment_state == '40')" @click="hrefFn( item.order_id, item.appointment_type)">查看订单</span>
          </div>
        </scroller>
      </div>
      <div class="mask" v-if="mask=='1'"></div>
      <div class="dialog" v-if="mask=='1'">
          <p>协议</p>
          <div class="cons">
              这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，这里是协议，
          </div>
          <div class="input"><input type="checkbox" v-model="check" class="checkbox_input" name="">点击同意协议</div>
          <span class="dialog_btn" @click="dialog_btn()">同意</span>
      </div>
    </div>
  </div>
</template>

<script>

  import { Tab, TabItem, Group, Cell, AlertModule } from 'vux'
  import { baseURL, appointmentList, appointmentCancel, appointmentConfirm } from '../../api/api'
  import qs from 'qs'

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
        appointmentLists: [],
        appointmentDetails: '',
        a_type: '',
        mask: '',
        check: false,
        confirm_id: '',
        curpage: 1,
        page_total: 11111,
        is_bool: false,
        all: false,
        design: false,
        supervison: false,
      }
    },
    created() {
      if(this.$route.query.type){
        this.all = false
        this.a_type = (this.$route.query.type == '1') ? '&type=1' : '&type=2'
        if(this.$route.query.type == '1') this.design = true
        if(this.$route.query.type == '2') this.supervison = true             
      }else{
        this.all = true
      }
      this._appointmentList()
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
      _appointmentList(){
        appointmentList(this.a_type).then((res) => {
          if(res.data.data){
            this.page_total = 0
            return
          }
          this.is_bool = false
          this.page_total = res.data.page_total
          var items = res.data.items
          for(var i in items){
            items[i].startTime = this.timeStamp(items[i].start_time)  
            items[i].is_designer = this.is_designer(items[i].appointment_type)       
            if(items[i].appointment_state == '20' || items[i].appointment_state == '30' || items[i].appointment_state == '40'){
              this.appointmentDetails = '同意'
            }else if(items[i].appointment_state == '50'){
              this.appointmentDetails = '拒绝'
            }else if(items[i].appointment_state == '10'){
              this.appointmentDetails = '待处理'
            }else if(items[i].appointment_state == '0'){
              this.appointmentDetails = '已取消'
            }
            items[i].appointmentDetails = this.appointmentDetails
            this.appointmentLists.push(items[i]) 
          }
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
      hrefDetails (appointment_id, appointment_type) {
        this.$router.push({path: 'appointmentDetails', query: { appointment_id: appointment_id, appointment_type: appointment_type }});
      },
      judge_designer (type) {
        this.appointmentLists = []
        this.a_type = ''
        if(type == ''){
          this.a_type = ''
        }else if(type == '1'){
          this.a_type = '&type=1'
        }else if(type == '2'){
          this.a_type = '&type=2'
        }
        this._appointmentList()
      },
      responseFn(type, appointment_id){ 
        var jsonData = {
          appointment_id: appointment_id
        }
        var _this = this
        appointmentCancel(type, qs.stringify(jsonData)).then((res) => {
          AlertModule.show({
            title: '系统提示',
            content: res.data.msg,
            onHide () {
              _this.$router.go(0);
            }
          })
        })
      },
      hrefFn(order_id, appointment_type) {
        if(appointment_type == '1'){
          this.$router.push({path: 'designOrderDetails', query: { order_id: order_id }});
        }else if(appointment_type == '2'){
          this.$router.push({path: 'supervisionOrderDetails', query: { order_id: order_id }});
        }        
      },
      confirmFn(appointment_id) {
        this.mask = '1'         
        this.confirm_id = appointment_id
        console.log(this.mask)
      },
      dialog_btn () {
          var _this = this
          this.mask = '' 
          if(this.check){ 
            var jsonData = {
              appointment_id: this.confirm_id
            }
            appointmentConfirm(qs.stringify(jsonData)).then((res) => {
              AlertModule.show({
                title: '系统提示',
                content: res.data.msg,
                onHide () {
                  _this.$router.go(0);
                }
              })
            })
          }else{
            AlertModule.show({
              title: '系统提示',
              content: '请同意协议...'
            })
          }
      }
    }
  }
</script>

<style type="text/css" scoped>
  .vux-tab .vux-tab-item.vux-tab-selected {color: #37beb7!important;border-bottom: 3px solid #37beb7!important;}
  .fabiaoList{background-color: #fff;margin-bottom: 5rem;position: relative!important;height: calc(100vh - 9rem)!important;}
  .con_list{padding: 0 1.2rem;overflow: hidden;border-bottom: 1rem solid #f0f0f0;}
  .con_list>span{float: right;height: 2.5rem;background-color: #3cc3bf;color: #fff;font-size: 1.4rem;text-align: center;line-height: 2.5rem;border-radius: 10000px;margin: 1rem 0;padding: 0 3rem;text-decoration-line: none;margin-left: .5rem;}
  .mask{position: fixed;width: 100%;height: 100%;background-color: rgba(0,0,0,.2);top: 0;left: 0;}
  .dialog{width: 80%;height: 80%;background-color: #fff;border-radius: 10px;box-shadow: 1px 3px 7px rgba(0,0,0,.3);position: fixed;top: 10%;left: 10%;padding: 2% 5%;box-sizing: border-box;z-index: 99;}
  .dialog p{line-height:  60px;text-align:  center;font-size:  24px;border-bottom:  1px solid #dedede;}
  .dialog .cons{padding:  2%;line-height:  24px;font-size:  18px;border-bottom:  1px solid #dedede;overflow-y:  auto;height: 36rem;}
  .dialog .input{display: inline-block;position: relative;left: 50%;margin-left: -48px;margin-top: 1.5rem;margin-bottom: 2rem;}
  .dialog .input input{border: 1px solid #dedede;width:  15px;height:  15px;position:  relative;top: 2px;margin-right:  10px;}
  .dialog .dialog_btn{display: block;width:  80px;font-size:  16px;color:  #fff;background-color: #36c3be;text-align:  center;line-height:  40px;border-radius: 4px;position:  relative;left:  50%;margin-left:  -40px;}

</style>
