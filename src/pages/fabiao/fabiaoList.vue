<template>
  <div>
    <div class="tab">
      <tab>
        <tab-item selected @on-item-click="_biddingListByBid('')">全部</tab-item>
        <tab-item @on-item-click="_biddingListByBid('0')">已取消</tab-item>
        <tab-item @on-item-click="_biddingListByBid('10')">待缴费</tab-item>
        <tab-item @on-item-click="_biddingListByBid('20')">待审核</tab-item>
        <tab-item @on-item-click="_biddingListByBid('30')">投标中</tab-item>
        <tab-item @on-item-click="_biddingListByBid('40')">选标中</tab-item>
        <tab-item @on-item-click="_biddingListByBid('50')">待设计师确认</tab-item>
        <tab-item @on-item-click="_biddingListByBid('60')">已完成</tab-item>
      </tab>
      <div class="listAll">
        <scroller class="fabiaoList"  
          :on-refresh="refresh"
          :on-infinite="infinite"
          ref="my_scroller">
          <div class="con_list" v-for="(item, index) in fabiaoList" :key="index">
            <p>{{item.rei_name}}{{item.house_type_name}}</p>     
            <group>
              <cell title="发标时间" :value="item.startTime" is-link></cell>
            </group>     
            <group>
              <cell title="截止时间" :value="item.endTime" is-link></cell>
            </group>     
            <group>
              <cell title="投标数" :value="item.tender_count" is-link></cell>
            </group>     
            <group>
              <cell title="状态" :value="item.status" is-link></cell>
            </group> 
            <group>
              <cell title="金额" :value="item.amount" is-link></cell>
            </group>
            <span @click="hrefDetails(item.bid_id)">查看</span>
            <span @click="_retreat(item.bid_id)" v-if="item.retreat==='1'">撤标</span>
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>

<script>

  import { Tab, TabItem, Group, Cell, AlertModule } from 'vux'
  import {biddingList, retreat} from '../../api/api'

  export default {
    components: {
      Tab,
      TabItem,
      Group, 
      Cell
    },
    data () {
      return {
      	fabiaoList: [],
        bid_type: '',
        retreats: 1,
        curpage: 1,
        page_total: 11111,
        is_bool: false,
      }
    },
    created() {
      this._biddingList()
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
            _this._biddingList()
            _this.$refs.my_scroller.resize();              
          }
          done();
        }, 1500)
      },
      _biddingList () {
        var dataApi = (this.bid_type == '') ? '' : '&bid_type='+this.bid_type
        biddingList(dataApi, this.curpage).then((res) => {
          if(res.data.data){
            this.page_total = 0
            return
          }
          this.is_bool = false
          this.page_total = res.data.page_total
          if(res.data.data){return}
          var items = res.data.items
          for(var i in items){
            items[i].startTime = this.timeStamp(items[i].start_time)
            items[i].status = this.bids_status(items[i].bid_state)            
            if(!items[i].end_time){
              items[i].endTime = '没有结束时间'
            }else{
              items[i].endTime = this.timeStamp(items[i].end_time)
            }
            if(items[i].bid_state=='0'||items[i].bid_state=='60'){
              items[i].retreat = '2'
            }else{
              items[i].retreat = '1'
            }
            this.fabiaoList.push(items[i])            
          }
        })
      },
      _biddingListByBid (bid_type) {
        this.bid_type = bid_type
        this.fabiaoList = []
        this._biddingList()
      },
      bids_status (num) {
        switch(num){
          case '0':
              return '已取消';
          break;

          case '10':
              return '待缴费';
          break;

          case '20':
              return '待审核';
          break;

          case '30':
              return '投标中';
          break;

          case '40':
              return '选标中';
          break;

          case '50':
              return '待设计师确认';
          break;

          case '60':
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
      _retreat (bid_id) {
        var bid = {
          'bid_id': bid_id
        }
        retreat(qs.stringify(bid)).then((res) => {
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
                this.$router.push({path: 'fabiaoList'});
              }
            })           
          }       
        })
      },
      hrefDetails (bid_id) {
        this.$router.push({path: 'fabiaoDetails', query: { bid_id: bid_id }});
      }
    }
  }
</script>

<style type="text/css" scoped>
  .vux-tab .vux-tab-item.vux-tab-selected {color: #37beb7!important;border-bottom: 3px solid #37beb7!important;}
	.fabiaoList{background-color: #fff;margin-bottom: 5rem;position: relative!important;height: calc(100vh - 9rem)!important;}
  .con_list{padding: 0 1.2rem;overflow: hidden;border-bottom: 1rem solid #f0f0f0;}
  .con_list>p{line-height: 4.4rem;font-size: 1.6rem;color: #5e5e5e;background-color: #fff;border-bottom: .05rem solid #eee;color: #333;}
  .con_list>span{float: right;height: 2.5rem;background-color: #3cc3bf;color: #fff;font-size: 1.4rem;text-align: center;line-height: 2.5rem;border-radius: 10000px;margin: 1rem 0;padding: 0 3rem;text-decoration-line: none;margin-left: 1rem;}
</style>
