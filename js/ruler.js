var ruler = {
  /**
   * 初始化刻度尺插件
   * @el 容器 String
   * @height 刻度尺高度 Number
   * @maxScale 最大刻度 Number
   * @startValue 开始的值 Number
   * @region 区间 Array
   * @background 刻度尺背景颜色 String
   * @color 刻度线和字体的颜色 String
   * @markColor  中心刻度标记颜色 String
   * @isConstant 是否不断地获取值 Boolean
   * @success(res) 滑动结束后的回调 Function
   * */
  initPlugin: function(params) {
    var initParams = {
      el: params.el,
      height: params.height || 60,
      maxScale: params.maxScale || 200,
      startValue: params.startValue || 0,
      region: params.region || false,
      background: params.background || false,
      color: params.color || false,
      markColor: params.markColor || "#FFCC33",
      isConstant: params.isConstant || false
    };

    if (!initParams.el) {
      console.warn("没有容器元素的参数");
      return false;
    }

    var rulerWrap = document.getElementById(initParams.el); //获取容器
    rulerWrap.style.height =
      initParams.height < 50 ? 50 + "px" : initParams.height + "px";

    //最大刻度的小值是50
    initParams.maxScale = initParams.maxScale < 50 ? 50 : initParams.maxScale;

    if (initParams.startValue > initParams.maxScale) {
      initParams.startValue = initParams.maxScale;
    }

    var minSildeNum = 0; //最小滑动的值
    var maxSildeNum = initParams.maxScale; //最大滑动的值

    if (initParams.region) {
      minSildeNum = Math.floor(initParams.region[0]);
      maxSildeNum = Math.floor(initParams.region[1]);
    }

    var count = initParams.startValue; //初始值

    var winWidth = rulerWrap.offsetWidth; //容器宽度
    var division = winWidth / 96; //每个刻度的距离 分割线
    var textIndex = winWidth / 24;
    const hour = 3600
    //刻度值数组
    var scaleValueList = [];
    for (var i = 0; i <= initParams.maxScale; i += 3600) {
      scaleValueList.push(i);
    }

    var canvas = rulerWrap.getElementsByTagName("canvas")[0]; //获取容器下的canvas标签
    //没有canvas就创建一个
    if (!canvas) {
      canvas = document.createElement("canvas"); //创建canvas标签
      canvas.width = winWidth;
      canvas.height = initParams.height;
      rulerWrap.appendChild(canvas);
    }
    var ctx = canvas.getContext("2d");

    if (window.devicePixelRatio) {
      canvas.width = window.devicePixelRatio * winWidth;
      canvas.height = window.devicePixelRatio * initParams.height;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    //画刻度尺
    function drawRuler(count) {
      count = count;

      //清空画布
      ctx.clearRect(0, 0, winWidth, initParams.height);

      //刻度尺背景
      if (initParams.background) {
        ctx.fillStyle = initParams.background;
        ctx.fillRect(0, 0, canvas.width, initParams.height);
      }

      const blueArray = [
          { strat: 9600, end: 10800 },
          { strat: 14000, end: 25200 },
          { strat: 25200, end: 32400 },
          { strat: 32400, end: 35800 },
          { strat: 36000, end: 43200 },
          { strat: 46000, end: 57000 },
          { strat: 57600, end: 82800 },
        ];

      //画已有视频矩形  
      for (var i = 0; i < blueArray.length;i++){
          ctx.beginPath();
          ctx.save();
          const _x = (Number(blueArray[i].strat) / (hour / 4)) * division
          const _width = (Number(blueArray[i].end) - Number(blueArray[i].strat)) / (hour / 4) * division
          ctx.fillStyle="blue";
          ctx.rect(_x,0,_width,31)
          ctx.fill()
      }  


      //画刻度线
      for (var i = 0; i < 96; i++) {
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = initParams.color ? initParams.color : "#bbb";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.moveTo(
          division * i - count * division,
          Math.floor(initParams.height * 0.52)
        );
        ctx.lineTo(division * i - count * division, 10);

        if (i % 4 === 0) {
          ctx.strokeStyle = initParams.color ? initParams.color : "#bbbb";
          ctx.lineTo(division * i - count * division, 0);
        }

        ctx.stroke();
        ctx.restore();
        ctx.closePath();
      }

     const formatSeconds = (value) => {
        let result = parseInt(value)
        let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
        let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
        let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
     
        let res = '';
        if(h !== '00') res += `${h}:`;
        if(m !== '00') res += `${m}:`;
        res += `${s}`;
        return res;
      }

      //添加时间
      ctx.beginPath();
      ctx.font = "14px Arial";
      ctx.fillStyle = initParams.color ? initParams.color : "#333";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      scaleValueList.forEach(function(num, i) {
        if(i%4 === 0 && i!== 0 && i!== 24){
            ctx.fillText(
                formatSeconds(i * hour),
                division * i * 4 - count * division,
                Math.floor(initParams.height * 0.78)
              );
        }  
      });
      ctx.closePath();
    }

    if (window.devicePixelRatio) {
      canvas.style.transform = "scale(" + 1 / window.devicePixelRatio + ")";
      canvas.style.transformOrigin = "left top";
    }

    drawRuler(count);

    if (!canvas) return false;
  }
};
