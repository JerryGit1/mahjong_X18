/**
 * 创建者 伟大的周鹏斌大王 on 2017/8/25.
 *
 * 项目系统检测平台
 */
app.register.controller('gameMonitorCtrl',[
    "$scope","$rootScope","$controller","baseModule",
    function(scope,rootScope,parentCtrl,baseModule){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*--------------父类基础信息配置-------------------*/
            scope.nav_info=rootScope.getMenuInfo("game_monitor");/*导航栏信息*/

            /*--------------事件-------------------*/

            /*tooltip 提示动画*/
            $(function () {
                $("[data-toggle='console_tooltip']").tooltip();
            });
        });
}]);
/*消费房卡统计*/
app.register.controller('statistics0Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="消费房卡(张)";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.u_cRoom,
            scope.operation_list.d_cRoom
        ];
        scope.setDataInfo();
}]);
/*开房统计 房主和代开*/
app.register.controller('statistics1Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="创建房间(次)";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.createRoom_fz,
            scope.operation_list.createRoom_dk,
            scope.operation_list.dissolveRoom
        ];
        scope.setDataInfo();
}]);
/*开房类型统计 2圈 4圈*/
app.register.controller('statistics2Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="开房类型";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.createRoom_2quan,
            scope.operation_list.createRoom_4quan,
            scope.operation_list.createRoom_6quan
        ];
        scope.setDataInfo();
    }]);
/*大小结算统计*/
app.register.controller('statistics3Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="结算(次)";/*标题*/
        if(!scope.operation_list)return;
        scope.cPperation_list=[
            scope.operation_list.jiesuan_s,scope.operation_list.jiesuan_m
        ];
        scope.setDataInfo();
    }]);
/*复合统计 打牌 时间 <=0.1s .<=5s  <=1s <=3s <=5s >5s*/
app.register.controller('statistics4Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="【打牌】用时区间统计";/*标题*/
        if(!scope.operation_list)return;
        scope.loaingOkAddData=false;
        scope.cPperation_list=[
            scope.operation_list.dpai_1,
            scope.operation_list.dpai_2,
            scope.operation_list.dpai_3,
            scope.operation_list.dpai_4,
            scope.operation_list.dpai_5,
            scope.operation_list.dpai_6
        ];
        scope.setDataInfo();
    }]);
/*复合统计 发牌 时间 <=0.1s .<=5s  <=1s <=3s <=5s >5s*/
app.register.controller('statistics5Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="【发牌】用时区间统计";/*标题*/
        if(!scope.operation_list)return;
        scope.loaingOkAddData=false;
        scope.cPperation_list=[
            scope.operation_list.fapai_1,
            scope.operation_list.fapai_2,
            scope.operation_list.fapai_3,
            scope.operation_list.fapai_4,
            scope.operation_list.fapai_5,
            scope.operation_list.fapai_6
        ];
        scope.setDataInfo();
    }]);
/*复合统计 吃 时间 <=0.1s .<=5s  <=1s <=3s <=5s >5s*/
app.register.controller('statistics6Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="【吃】用时区间统计";/*标题*/
        if(!scope.operation_list)return;
        scope.loaingOkAddData=false;
        scope.cPperation_list=[
            scope.operation_list.chi_1,
            scope.operation_list.chi_2,
            scope.operation_list.chi_3,
            scope.operation_list.chi_4,
            scope.operation_list.chi_5,
            scope.operation_list.chi_6
        ];
        scope.setDataInfo();
    }]);
/*复合统计 碰 时间 <=0.1s .<=5s  <=1s <=3s <=5s >5s*/
app.register.controller('statistics7Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="【碰】用时区间统计";/*标题*/
        if(!scope.operation_list)return;
        scope.loaingOkAddData=false;
        scope.cPperation_list=[
            scope.operation_list.peng_1,
            scope.operation_list.peng_2,
            scope.operation_list.peng_3,
            scope.operation_list.peng_4,
            scope.operation_list.peng_5,
            scope.operation_list.peng_6
        ];
        scope.setDataInfo();
    }]);
/*复合统计 杠 时间 <=0.1s .<=5s  <=1s <=3s <=5s >5s*/
app.register.controller('statistics8Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="【杠】用时区间统计";/*标题*/
        if(!scope.operation_list)return;
        scope.loaingOkAddData=false;
        scope.cPperation_list=[
            scope.operation_list.gang_1,
            scope.operation_list.gang_2,
            scope.operation_list.gang_3,
            scope.operation_list.gang_4,
            scope.operation_list.gang_5,
            scope.operation_list.gang_6
        ];
        scope.setDataInfo();
    }]);
/*复合统计 小局结束 时间 <=5分钟 <=10分钟 <=15分钟 <=20分钟  <20*/
app.register.controller('statistics9Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="【小结算】用时区间统计";/*标题*/
        if(!scope.operation_list)return;
        scope.loaingOkAddData=false;
        scope.cPperation_list=[
            scope.operation_list.xjs_1,
            scope.operation_list.xjs_2,
            scope.operation_list.xjs_3,
            scope.operation_list.xjs_4,
            scope.operation_list.xjs_5,
            scope.operation_list.xjs_6
        ];
        scope.setDataInfo();
    }]);
/*复合统计 大结算结束*/
app.register.controller('statistics10Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="【大结算】用时区间统计";/*标题*/
        if(!scope.operation_list)return;
        scope.loaingOkAddData=false;
        scope.cPperation_list=[
            scope.operation_list.djs_1,
            scope.operation_list.djs_2,
            scope.operation_list.djs_3,
            scope.operation_list.djs_4,
            scope.operation_list.djs_5,
            scope.operation_list.djs_6
        ];
        scope.setDataInfo();
    }]);
/*复合统计 大结算结束 所需局数统计 <=2局 <=4局 <=6局  <=8局  <=12局  >12局*/
app.register.controller('statistics11Ctrl',[
    "$scope","$rootScope","$controller","baseModule","statisticService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('statisticsCtrl', {$scope: scope});
        scope.titleName="【大结算】局数区间统计";/*标题*/
        if(!scope.operation_list)return;
        scope.loaingOkAddData=false;
        scope.cPperation_list=[
            scope.operation_list.djs_ju1,
            scope.operation_list.djs_ju2,
            scope.operation_list.djs_ju3,
            scope.operation_list.djs_ju4,
            scope.operation_list.djs_ju5,
            scope.operation_list.djs_ju6
        ];
        scope.setDataInfo();
    }]);
