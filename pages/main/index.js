// pages/main/index.js
let baseList=[];
Page({
  data: {
    headerHeight: 0,
    footerHeight: 0,
    list: [],
    baseList: [],
    index: 0,
    heightArr: [],
    query: {
      keyWord: "",
      type: 0,//0：全部 1：查看关注人 2：查看自己
      pageSize: 20,
      startTime: ''
  },
  },

  onLoad() {
    this.getList();
  },
  //获取列表
  getList() {
    // let { baseList } = this.data;
    // let nowList = [];
    // for (var i = 0; i < 20; i++) {
    //   nowList.push(i);
    // }
    // baseList.push({
    //   list: nowList
    // })
    // this.setData({
    //   baseList
    // }, () => {
    //   this.calcList();
    // })

    let { query } = this.data;
    let nowList = [];

    wx.$ajax.post("/tool/b/album/get/dynamic", query).then(res => {
      
        if (query.startTime == '') {
            baseList = [];
        }
        let { result: { list: resultList } } = res;
        nowList = resultList;
        baseList.push({
            list: nowList
        })
        this.calcList();
        // 修改baseList
        if (resultList.length == 0 || (res.result.pageIndex == res.result.totalPages)) {
            console.log("列表结束")
        } else {
            let lastItem = resultList[resultList.length - 1];
            this.setData({
                'query.startTime': lastItem.releaseT,
                'query.id': lastItem.id
            });
        }
    })

  },
  //重新计算list和头尾高度
  calcList() {
    
    let that = this;
    let { index, heightArr } = this.data;
    let headerHeight = 0;
    let footerHeight = 0;
    let list = [];
    baseList.forEach((e, i) => {
      if (i < (index - 1) && index >= 1) {
        heightArr[i] && (headerHeight += heightArr[i].height);
      } else if (i > (index + 1) && (index + 1) <= baseList.length) {
        heightArr[i] && (footerHeight += heightArr[i].height);
      } else {
        e.index = i;
        list.push(e);
      }
    })
    this.setData({
      headerHeight,
      footerHeight,
      list
    }, () => {
      //计算高度
      const query = this.createSelectorQuery()
      query.selectAll('.cirtual-list').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        res[0].forEach((e) => {
          let { index } = e.dataset;
          let begin = heightArr[index - 1] ? heightArr[index - 1].begin + e.height : 0
          heightArr[index] = {
            height: e.height,
            begin,
            end: begin + e.height
          }
        })
        that.setData({
          heightArr
        })
      })
    })
  },

  onPageScroll(e) {
    let scrollTop = e.scrollTop;
    let index = this.data.heightArr.findIndex((e) => {
      return scrollTop >= e.begin && scrollTop < e.end
    });
    if (this.data.index !== index && index !== -1) {
      this.setData({
        index
      }, () => {
        this.calcList();
      });
    }

  },
  onReachBottom() {
    this.getList();
  }
})