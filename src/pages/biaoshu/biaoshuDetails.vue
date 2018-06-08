<template>
  <div class="biashu">
    <bid-cons :bidCons="bidConsArry"></bid-cons>
    <router-link to="fabiaoList">返回</router-link>
  </div>
</template>

<script>

  import bidCons from '../../components/bid_cons'

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

  import { baseURL, biaoshuDetails } from '../../api/api'

  export default {
    components: {
      bidCons
    },
    data () {
      return {
        bidConsArry: bidConsArry,
      }
    },
    created() {
      this.bid = this.$route.query.bid
      this._biaoshuDetails()
    },
    methods: {
      _biaoshuDetails () {
        biaoshuDetails(this.bid).then((res) => {
          var items = res.data.items
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
        })
      }
    }
  }
</script>

<style type="text/css" scoped>
  .biashu{background-color: #f0f0f0;height: 100%;min-height: 100vh;padding-top: 1rem;box-sizing: border-box;}
  .biashu > a{height: 4.3rem;line-height: 4.3rem;width: 93%;background-color: #12c098;color: #fff;font-size: 1.6rem;text-align: center;display: block;margin: 0 3.5%;border-radius: 10000px;text-decoration-line: none;}
</style>
