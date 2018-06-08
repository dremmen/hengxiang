<template>
  <div>
  	<div class="evaluateList">
      <p>评价（{{evaluateConL}}）</p>      
      <scroller class="evaluate"  
        :on-refresh="refresh"
        :on-infinite="infinite"
        ref="my_scroller">
  		  <evaluate-components :evaluateCons='evaluateCon'></evaluate-components>
      </scroller>
  	</div>
  </div>
</template>

<script>
import evaluateComponents from '../../components/evaluateComponents'
import {designEvaluate} from '../../api/api'

export default {
  components: {
    evaluateComponents
  },
  data () {
    return {
      evaluateConL: '',
      evaluateCon: [],
      curpage: 1,
      page_total: 11111,
      is_bool: false,
    }
  },
  created() {
    this.designer_id = this.$route.query.designer_id
    this._designEvaluate()
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
          _this._designEvaluate()
          _this.$refs.my_scroller.resize();              
        }
        done();
      }, 1500)
    },
    _designEvaluate () {
      designEvaluate(this.designer_id, this.curpage).then((res) => {
        this.is_bool = false
        this.page_total = res.data.page_total
        if(res.data.data){
          return;
        }
        this.evaluateConL = res.data.items.designer_eval_list.length
        for(var i in res.data.items.designer_eval_list){
          this.evaluateCon.push(res.data.items.designer_eval_list[i])
        }
      })
    }
  }
}

</script>

<style type="text/css" scoped>
	.evaluateList{margin-bottom: 5rem;}
	.evaluateList > p{line-height: 3.75rem;font-size: 1.6rem;color: #5e5e5e;padding-left: 1.2rem;border-bottom: 1px solid #dedede;background-color: #fff;}
  .evaluate{position: relative;height: calc(100vh - 9rem)!important;}
</style>