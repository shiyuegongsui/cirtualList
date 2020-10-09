// pages/index/component/cirtualList.js
Component({

  properties: {
      item:{
        type:Object,
        value:{}
      }
  },
  lifetimes: {
    attached: function () { 
      this.interSection();
    },
  },
  methods: {
    interSection: function (e) {
      let that=this;
      that._observer = that.createIntersectionObserver().relativeToViewport({
        top: 100,
        bottom:100 
      }).observe('.cirtual-list', (res) => {
        if(res.intersectionRatio>0){
          // console.log(res);
          that.triggerEvent('attached',{
              index:res.dataset.index,
              height:res.boundingClientRect.height
          }) 
        }
      })
    }
  }
})