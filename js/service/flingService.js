/**
 * Created by Admin on 2017/12/5.
 */
app.register.factory("flingService",["baseService","$rootScope",function(baseService,rootScope){
    var url="/Home/Console/baseInfo/";
    /*已绑定用户*/
    var url1="bindUsers";
    var url2="recharge";
    var url3="changeKou";
    var url4="Allrecharge";
    var url5="whiteList";
    var url6="findOneWhite";
    var url7="changeWhiteList";
    var url8="findDaiL";
    var url9="findChangeDaiL";
    var url10="changeDaiL";
    var url11="applyCash";
    var url12="noCashList";
    var url13="havaCashList";
    var url14="agreeCash";
    var url15="changeKouState";

    return {
        /*邀请码直冲*/
        /*已绑定用户*/
        bindList:function(param,backFun){
            baseService.GM_java(url1,param,function(data){
                backFun(data);
            },false);
        },
        //已绑定用户
        flingList:function(param,backFun){
            baseService.GM_java(url2,param,function(data){
                backFun(data);
            },false);
        },
        //设置扣量比例
        btnSelect:function(param,backFun){
            baseService.GM_java(url3,param,function(data){
                backFun(data);
            },true);
        },
        //大区代理直冲管理
        flingData:function(param,backFun){
            baseService.GM_java(url4,param,function(data){
                backFun(data);
            },true);
        },
        //白名单列表
        whiteList:function(param,backFun){
            baseService.GM_java(url5,param,function(data){
                backFun(data);
            },true);
        },
        //查询白名单
        checkWhiteList:function(param,backFun){
            baseService.GM_java(url6,param,function(data){
                backFun(data);
            },true);
        },
        //加入或删除白名单
        joinRemList:function(param,backFun){
            baseService.GM_java(url7,param,function(data){
                backFun(data);
            },true);
        },
        //用户归属管理
        userPart:function(param,backFun){
            baseService.GM_java(url8,param,function(data){
                backFun(data);
            },true);
        },
        //要切换的代理信息
        agencyInfo:function(param,backFun){
            baseService.GM_java(url9,param,function(data){
                backFun(data);
            },true);
        },
        //调整归属按钮
        amendInfo:function(param,backFun){
            baseService.GM_java(url10,param,function(data){
                backFun(data);
            },true);
        },
        //代理申请提现
        applyPay:function(param,backFun){
            baseService.GM_java(url11,param,function(data){
                backFun(data);
            },true);
        },
        //待审批---未提现
        stayCheck:function(param,backFun){
            baseService.GM_java(url12,param,function(data){
                backFun(data);
            },true);
        },
        //已审批----提现
        thenCheck:function(param,backFun){
            baseService.GM_java(url13,param,function(data){
                backFun(data);
            },true);
        },
        //同意提现按钮
        consent:function(param,backFun){
            baseService.GM_java(url14,param,function(data){
                backFun(data);
            },true);
        },
        //切换状态，扣量/分成
        cutInto:function(param,backFun){
            baseService.GM_java(url15,param,function(data){
                backFun(data);
            },true);
        }
    }
}]);