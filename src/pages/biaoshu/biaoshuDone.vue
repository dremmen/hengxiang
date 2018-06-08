<template>
  <div class="biashu">
    <bid-cons :bidCons="bidConsArry"></bid-cons>
    <span><img src="../../assets/img/biaoshuDone.png"></span>
    <p>您不符合招标需求</p>
  </div>
</template>

<script>

  import bidCons from '../../components/bid_cons'

  const bidConsArry = [
    {
      title: '姓名：',
      cons: '罗拉'
    },
    {
      title: '面积：',
      cons: '100㎡'
    },
    {
      title: '新旧：',
      cons: '旧房'
    },
    {
      title: '预算：',
      cons: '2000.00元'
    },
    {
      title: '小区：',
      cons: '时代小区'
    },
    {
      title: '户型：',
      cons: '三室两厅'
    },
    {
      title: '户型图：',
      cons: require('../../assets/img/c-big.png'),
      type: 'img'
    },
    {
      title: '风格：',
      cons: '中式 欧式'
    },
    {
      title: '等级要求：',
      cons: '2级'
    },
    {
      title: '说明：',
      cons: '说明文说明文说明文说明文说明文说明文说明文说明文说明文说明文说明文说明文'
    }
  ]

  export default {
    components: {
      bidCons
    },
    data () {
      return {
        bidConsArry: bidConsArry,
      }
    },
    methods: {
    },
    mounted: function () {
    },
  }
</script>

<style type="text/css" scoped>
  .biashu{background-color: #f0f0f0;height: 100%;min-height: 100vh;padding-top: 1rem;box-sizing: border-box;}
  .biashu > a{height: 4.3rem;line-height: 4.3rem;width: 93%;background-color: #12c098;color: #fff;font-size: 1.6rem;text-align: center;display: block;margin: 0 3.5%;border-radius: 10000px;}
  .biashu > span{width: 5.3rem;height: 4.45rem;position: relative;left: 50%;margin-left: -2.65rem;display: block;}
  .biashu > p{font-size: 1.6rem;color: #999;text-align: center;}
</style>
