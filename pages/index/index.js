Page({
  data: {
    headerHeight: 0,
    footerHeight: 0,
    list: [],
    baseList: [],
    index: 0,
    _observer: null
  },
  onLoad() {

    this.getList();
  },

  onReachBottom() {
    this.getList();
  },
  //获取列表
  getList() {
    let { baseList } = this.data;
    let nowList = [];
    for (var i = 0; i < 20; i++) {
      nowList.push(i);
    }
    baseList.push({
      height: 0,
      list: nowList
    })

    this.setData({
      baseList
    })
    this.calcList();
  },
  //获取到当前的数据
  itemAttached(options) {
    console.log('itemAttached');
    let { index, height } = options.detail;
    this.setData({
      [`baseList[${index}].height`]: height,
      index: index
    });
    this.calcList();

  },
  //重新计算list和头尾高度
  calcList() {
    let { index, baseList } = this.data;
    let headerHeight = 0;
    let footerHeight = 0;
    let list = [];

    baseList.forEach((e, i) => {
      //如果小于index-1的话需要计算头部高度

      if (i < (index - 1) && index >= 1) {
        e && (headerHeight += e.height);
      } else if (i > (index + 1) && (index+1) <= baseList.length) {
        e && (footerHeight += e.height);
      } else {
        e.index = i;
        list.push(e);
      }
    })

    // console.log(baseList);
    // console.log(headerHeight, footerHeight, index);
    this.setData({
      headerHeight,
      footerHeight,
      list
    })
  }
})