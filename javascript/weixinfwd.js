//统计点击
var gamePvId = "21_${channel}";
function givePv() {

    var url = "${root}/game/game7/givePv?randID=" + Math.random();

    $.ajax({
        type : 'post',
        async : false,
        url : url,
        data : {
            "gameId" : gamePvId
        },
        dataType : "json",
        success : function(data, status) {

        },
        error : function(data, status, e) {
            console.log("系统异常" + e);
        }
    });

}
//givePv();

//转发自定义   开始
var weixinTitle = "给大白拍照！ ";
var weixinContent = "快来给大白拍照看能拿多少分...【方兴地产】";
var weixinUrl = "http://offi.shenmawo.com.cn/BaiCapture/";
var weixinImageUrl = "http://offi.shenmawo.com.cn/BaiCapture/images/forward.png";
//异步请求获取 signature 然后再进行微信验证
function getRecord() {
    var paraUrl = window.location.href;
    var url = "http://offi.shenmawo.com.cn/wechat/huodong/getSignatureFromShenma";//FromShenma
    // paraUrl = encodeURIComponent(paraUrl);
    // alert(paraUrl);
    $.ajax({
        type : 'post',
        async : false,
        url : url,
        data : {
            "url" : paraUrl
        },
        dataType : "html",
        success : function(data, status) {
            //alert(data);
            var signatureString = data.split("__")[0];
            var timestampString = Number(data.split("__")[1]);
            // alert(signatureString);
            // alert(timestampString);
            wx.config({
                debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId : 'wxeec1054109271fda', // 必填，公众号的唯一标识  wxeec1054109271fda
                timestamp : timestampString, // 必填，生成签名的时间戳
                nonceStr : 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
                signature : signatureString,// 必填，签名，见附录1     335d8a8833a606aa56e8afa2cbc604f0cc2263b8
                jsApiList : [ 'onMenuShareTimeline',
                    'onMenuShareAppMessage', 'hideMenuItems' ]
                // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        },
        error : function(data, status, e) {
            console.log("系统异常" + e);
        }
    });

}


wx.ready(function() {
    //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
    wx.onMenuShareTimeline({
        title : weixinTitle, // 分享标题
        link : weixinUrl, // 分享链接
        imgUrl : weixinImageUrl, // 分享图标
        success : function() {
            //alert("分享到朋友圈 成功");
            // 用户确认分享后执行的回调函数
            showLettey();
        },
        cancel : function() {
            // 用户取消分享后执行的回调函数
        }
    });

    //获取“分享给朋友”按钮点击状态及自定义分享内容接口
    wx.onMenuShareAppMessage({
        title : weixinTitle, // 分享标题
        desc : weixinContent, // 分享描述
        link : weixinUrl, // 分享链接
        imgUrl : weixinImageUrl, // 分享图标
        type : 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl : '', // 如果type是music或video，则要提供数据链接，默认为空
        success : function() {
            //alert("分享成功了！");
            // 用户确认分享后执行的回调函数
            showLettey();
        },
        cancel : function() {
            // 用户取消分享后执行的回调函数
        }
    });
    //config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
});

wx.error(function(res) {
    //alert("验证失败了！");
    //config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
});

//转发结束