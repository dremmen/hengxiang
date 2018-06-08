<template>
  <div class="fabiaoDetails">
    <p>售后进度</p>
    <div class="progress">
      <ul>
        <li>发标</li>
        <li>缴费</li>
        <li>审核</li>
        <li>投标</li>
        <li>通过</li>
      </ul>
    </div>
    <div class="tab">
      <tab v-model="index">
        <tab-item class="vux-center" :selected="about_con === item" v-for="(item, index) in listBid" @click="about_con = item" :key="index">{{item}}</tab-item>
      </tab>
      <div class="listAll bidcons" :class="index === 0 ? 'block':'none'">
        <bid-cons :bidCons="bidConsArry"></bid-cons>
      </div>
      <div class="listAll toubiaoList" :class="index === 1 ? 'block':'none'">
        <div class="toubiaoList fabiaoList con_list" v-for="(item, index) in fabiaoList" :key="index">
          <group>
            <cell title="设计师" :value="item.designer_name" is-link></cell>
          </group>     
          <group>
            <cell title="投标时间" :value="item.time" is-link></cell>
          </group>     
          <group>
            <cell title="联系方式" :value="item.designer_mobile" is-link></cell>
          </group>   
          <span v-if="hasBid==='2'" @click="_hasBidding(item.tender_id)">中标</span>
          <a :href="'tel:'+item.designer_mobile">联系</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { Tab, TabItem, Group, Cell, AlertModule } from 'vux'
  import bidCons from '../../components/bid_cons'
  import { baseURL, biddingListDetails, hasBidding } from '../../api/api'
  import qs from 'qs'

  const list = () => ['标书详情', '投标列表']

  
  const bidConsArry = [
    {
      title: '姓名：',
      cons: ''
    },
    {
      title: '面积：',
      cons: ''
    },
    {
      title: '新旧：',
      cons: ''
    },
    {
      title: '预算：',
      cons: ''
    },
    {
      title: '小区：',
      cons: ''
    },
    {
      title: '户型：',
      cons: ''
    },
    {
      title: '户型图：',
      cons: '',
      type: 'img'
    },
    {
      title: '风格：',
      cons: ''
    },
    {
      title: '说明：',
      cons: ''
    }
  ]

  export default {
    components: {
      Tab,
      TabItem,
      bidCons,
      Group, 
      Cell
    },
    data () {
      return {
        index: 0,
      	fabiaoList: [],
        bidConsArry: bidConsArry,
        listBid: list(),
        about_con: '标书详情',
        hasBid: 1,
      }
    },
    created: function () {
      this.bid = this.$route.query.bid_id
      this._biddingDetails()
    },
    methods: {      
      _biddingDetails () {
        biddingListDetails(this.bid).then((res) => {
          var items = res.data.items
          this.fabiaoList = items.tender_list
          var house_style = ''
          this.bidConsArry[0].cons = items.owner_name
          this.bidConsArry[1].cons = items.house_area+'㎡'
          this.bidConsArry[2].cons = (items.house_condition) ? '新房' : '旧房'
          this.bidConsArry[3].cons = items.amount + '元'
          this.bidConsArry[4].cons = items.rei_name
          this.bidConsArry[5].cons = items.house_type_name
          this.bidConsArry[6].cons = items.house_type_img
          for(var i in items.house_styles_list){
            house_style += items.house_styles_list[i].tag_name+' '
          }
          this.bidConsArry[7].cons = house_style
          this.bidConsArry[8].cons = items.remark
          for(var i in this.fabiaoList){
            this.fabiaoList[i].time = this.timeStamp(this.fabiaoList[i].create_time)
            this.fabiaoList[i].toubids_status = this.toubids_status(this.fabiaoList[i].tender_state)
            if(items.bid_state == '30' || items.bid_state == '40'){
                var tender_state = items.tender_list[i].tender_state;
                if(tender_state == '10'){
                   this.hasBid = '2'
                }                    
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
      toubids_status (num) {
        switch(num){

          case '10':
              return '已投标';
          break;

          case '20':
              return '中标';
          break;

          case '30':
              return '未中标';
          break;

          case '40':
              return '已取消';
          break;
        }
      },
      _hasBidding (tender_id) {
        var jsonData = {
          'bid_id': this.bid,
          'tender_id': tender_id
        }
        hasBidding(qs.stringify(jsonData)).then((res) => {
          if(res.data.status == 'false'){
            AlertModule.show({
              title: '系统提示',
              content: res.data.msg
            })
            return;
          }else{
            AlertModule.show({
              title: '系统提示',
              content: res.data.msg,
              onHide () {
                _this.$router.push({path: '/fabiaoList'});
              }
            })           
          }  
        })
      }
    },
  }
</script>

<style type="text/css" scoped>
  .vux-tab-warp{margin-bottom: 1rem;}
  .fabiaoDetails{background-color: #f0f0f0;height: 100%;min-height: 100vh;padding-bottom: 5rem;}
  .fabiaoDetails > p{line-height: 4.4rem;height: 4.4rem;color: #333;background-color: #fff;border-bottom: .05rem solid #eee;padding-left: 1.2rem;font-size: 1.4rem;}
  .progress ul{overflow: hidden;padding: 1.2rem 0;background-color: #fff;margin-bottom: 1rem;}
  .progress li{float: left;width: 20%;text-align: center;font-size: 1.4rem;color: #37beb7;}
  .vux-tab .vux-tab-item.vux-tab-selected {color: #37beb7!important;border-bottom: 3px solid #37beb7!important;}
	.toubiaoList{background-color: #fff;}
  .listAll .bidCon{margin-bottom: 6rem;}
  .listAll{display: none;}
  .listAll.block{display: block;}
  .con_list{padding: 0 1.2rem;overflow: hidden;border-bottom: 1rem solid #f0f0f0;}
  .con_list>p{line-height: 4.4rem;font-size: 1.6rem;color: #5e5e5e;background-color: #fff;border-bottom: .05rem solid #eee;color: #333;}
  .con_list>span,.con_list>a{float: right;height: 2.5rem;background-color: #3cc3bf;color: #fff;font-size: 1.4rem;text-align: center;line-height: 2.5rem;border-radius: 10000px;margin: 1rem 0;padding: 0 3rem;text-decoration-line: none;}
</style>
