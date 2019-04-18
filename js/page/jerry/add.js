/**
 * 唐僧洗头爱飘柔  --丁杰 2017/11/20.
 */
app.register.controller("jerry_addCtrl",[
    "$scope","$rootScope","$controller","baseModule","myPopUp","jerryService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,jerryService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*导航栏信息*/
            scope.nav_info=rootScope.getMenuInfo("jerry_add");
            scope.my_money=rootScope.userInfo.userTreasure;
            scope.myVar;//俱乐部名称
            scope.limit;//每位成员每日消耗限额
            scope.dayOver;//用户设置的初始库存
            scope.warn;//库存预警

            scope.ackSetup=function(myVar,dayOver,limit,warn){
                // console.log(myVar);
               // 判断
               if( baseModule.judge_param_null(
                       [scope.myVar,"俱乐部名称不能为空"],
                       [scope.dayOver,"初始库存不能为空"],
                       [scope.limit,"请选择每日消耗限额"],
                       [scope.warn,"请选择库存预警"]
                   )){
                   var param={
                       userId:rootScope.userInfo.init_id,//用户ID
                       clubName:decodeURIComponent(myVar),//俱乐部名称
                       lastMoney:dayOver,//房卡的初始库存
                       maxUseMoney:limit,//玩家日消耗限额
                       moneyWarn:warn//房卡库存预警值
                   };
                   //走接口
                   jerryService.add(param,function(data){
                       //创建成功
                       myPopUp.supernatant("操作成功");
                       // 判断是否小于预警值
                       scope.ifWarm=dayOver<=warn?0:dayOver<=warn;
                       //跳转回俱乐部首页
                       baseModule.skipPage('jerry_index',scope.ifWarm);
                   })
               }
            };
            // 清空再填
            // scope.clearNull=function(myVar,dayOver){
            //     scope.myVar=null;
            //     scope.dayOver=null;
            // }
            scope.updateScroll(1);
        });
    }]);