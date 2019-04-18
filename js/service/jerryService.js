/**
/**
 * Created by Admin on 2017/11/18.
 */
app.register.factory("jerryService",["baseService","$rootScope",function(baseService,rootScope){
    var url="/HomeGM/Console/index_manage_center_page/";
    var addUrl="getMyClubs";//主页
    var addUrl2="createClub";//添加俱乐部
    var addUrl3="moneyManage";//房卡管理
    var addUrl3_1="lastMoneyUpdate";//修改库存
    var addUrl4="clubApply";//入会申请
    var addUrl5="clubApplyExcuse";//同意入会
    var addUrl6="clubUsers";//成员列表
    var addUrl7="deleteUser";//删除成员
    var addUrl8="clubLeave";//离会申请
    var addUrl9="clubUsersGame";//战绩查询
    var addUrl10="addHeXiao";//用户核销
    var addUrl11="searchClubs";//包年包月搜索
    var addUrl12="freeClub";//包年包月搜索
    var addUrl13="closeClub";//包年包月搜索
    var addUrl14="/HomeGM/Agency/get_user_info/";

    return {
        //主页
        index:function(param,backFun){
            baseService.GM_java(addUrl,param,function(data){
                backFun(data);
            },true);
        },
        //创建俱乐部
        add:function(param,backFun){
            baseService.GM_java(addUrl2,param,function(data){
                backFun(data);
            },true);
        },
        //获取单个俱乐部信息
        getClubInfo:function(param,backFun){
            baseService.GM_java(addUrl3,param,function(data){
                backFun(data);
            },true);
        },
        //往俱乐部充卡
        pay:function(param,backFun){
            baseService.GM_java(addUrl3_1,param,function(data){
                backFun(data);
                console.log(data);
            },true);
        },
        //入会申请列表
        forList:function(param,backFun){
            baseService.GM_java(addUrl4,param,function(data){
                backFun(data);
            },true);
        },
        //同意入会申请列表
        success:function(param,backFun){
            baseService.GM_java(addUrl5,param,function(data){
                backFun(data);
            },true);
        },
        //成员列表
        memberList:function(param,backFun){
            baseService.GM_java(addUrl6,param,function(data){
                backFun(data);
            },true);
        },
        //删除成员列表
        rem:function(param,backFun){
            baseService.GM_java(addUrl7,param,function(data){
                backFun(data);
            },true);
        },
        // 离会申请列表
        leaveList:function(param,backFun){
            baseService.GM_java(addUrl8,param,function(data){
                backFun(data);
            },true);
        },
        //战绩查询
        recordList:function(param,backFun){
            baseService.GM_java(addUrl9,param,function(data){
                backFun(data);
            },true);
        },
        //用户核销
        heXiaoStatus:function(param,backFun){
            baseService.GM_java(addUrl10,param,function(data){
                backFun(data);
            },true);
        },
        //包年包月搜索
        searchClubs:function(param,backFun){
            baseService.GM_java(addUrl11,param,function(data){
                backFun(data);
            },true);
        },
        //包年包月设置
        freeClub:function(param,backFun){
            baseService.GM_java(addUrl12,param,function(data){
                backFun(data);
            },true);
        },
        //取消俱乐部包年包月时间
        closeClub:function(param,backFun){
            baseService.GM_java(addUrl13,param,function(data){
                backFun(data);
            },true);
        },
        //俱乐部代理搜索--GM后端
        getInitInfo:function(param,backFun){
            baseService.GM(addUrl14,param,function(data){
                backFun(data);
            },true);
        },





        //生自定义二维码
        getQCode:function (qCodeUrl,name,backFun,w) {
            var canvas=$("<canvas height='275' width='263' style='position: absolute;top:-300px;'></canvas>");
            $("body").append(canvas);
            var ctx=canvas[0].getContext('2d');
            /*加载背景图片*/
            var beauty = new Image();
            beauty.src = "image/qCodeBack.png";
            beauty.onload = function(){
                //添加背景
                ctx.drawImage(beauty, 0, 0);
                /*加载二维码图片*/
                var beauty1 = new Image();
                beauty1.src = qCodeUrl;
                beauty1.onload = function(){
                    //添加二维码
                    ctx.drawImage(beauty1, 0, 0,w,w,48,38,154,154);
                    //添加文字
                    //设置字体样式
                    ctx.font = "20px 微软雅黑";
                    //设置字体填充颜色
                    ctx.fillStyle= "#000";
                    //从坐标点(50,50)开始绘制文字
                    ctx.fillText(name, 90, 224);

                    backFun(canvas[0].toDataURL("image/png").replace("image/png", "image/octet-stream"));
                    canvas.remove();
                };
            };
        }

    }
}]);