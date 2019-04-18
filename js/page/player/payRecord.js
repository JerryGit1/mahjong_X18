/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 * 支付充值记录
 */
/*用基础控件*/
app.register.directive("playerPayRecordList",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/player/html/'+rootScope.equipmentName+'/payRecordBaseList.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
/*基础*/
app.register.controller('player_payRecordBaseCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*-------------信息--------------*/
        scope.searchPlaceholder="用户ID 搜索";
        scope.list = [];
        scope.current_page=1;/*当前页*/
        scope.page_num=30;/*每页数量*/
        scope.max_page=10;/*总页数*/
        scope.pageLastPageTips="哎呀! 别翻了!到底了";
        /*-------------事件--------------*/
        /*翻页*/
        scope.paging=function(){
            scope.addList();
        }
        /*显示列表信息*/
        scope.setList=function(data){
            scope.loadingInfoOk(data);
        }
        /*搜索*/
        scope.startSearch=function(id){

        }
        /*获取显示列表信息*/
        scope.addList=function(){

        }
}]);
/*列表*/
app.register.controller('player_payRecordCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('player_payRecordBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function() {
            scope.nav_info = rootScope.getMenuInfo("player_payRecord");/*导航栏信息----------玩家充卡记录*/
            scope.table_class = "";
            /*显示列表信息*/
            scope.addList=function(){
                service.pay_record(scope.current_page,scope.page_num,scope.setList);
            }
            /*搜索*/
            scope.startSearch=function(id){
                baseModule.skipPage('player_payRecord_seek',{seek: id}); // 传递参数的跳转
            }
            scope.addList();
        });
}]);
/*搜索*/
app.register.controller('player_payRecordSeekCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('player_payRecordBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function() {
            scope.nav_info = rootScope.getMenuInfo("player_payRecordSeek");/*导航栏信息*/
            scope.table_class = "";
            scope.seekMyCacheName="p_p_seek";
            scope.setSeekKeyword();
            /*显示列表信息*/
            scope.addList=function(){
                if(!Number(scope.seek))scope.seek="111";
                service.u_pay_record(scope.seek,scope.current_page,scope.page_num,scope.setList);
            }
            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(Number(id));
                scope.addList();
            }
            scope.addList();
        });
}]);