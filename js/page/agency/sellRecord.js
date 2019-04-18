/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 * 出售列表
 */
app.register.directive("agencySellRecordList",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/agency/html/'+rootScope.equipmentName+'/sellRecordList.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/
        }
    }
}]);

/*基础*/
app.register.controller('agency_sellRecordBaseCtrl',[
    "$scope","$rootScope","$controller","baseModule",
    function(scope,rootScope,parentCtrl,baseModule){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*-------------基础变量--------------*/
        scope.current_page=1;/*当前页*/
        scope.page_num=20;/*每页数量*/
        scope.max_page=1;/*总页数*/
        scope.list=[];/*信息列表*/
        /*-------------事件--------------*/
        /*翻页*/
        scope.paging=function(){
            scope.getUserList();
        };
        /*搜索*/
        scope.startSearch=function(id){

        }
        /*tooltip 提示动画*/
        scope.renderFinish = function(){
            $("[data-toggle='game_SMC_tooltip']").tooltip();
        }
        /*设置用户列表信息*/
        scope.addUserList=function(data){
            scope.loadingInfoOk(data);
            scope.nav_input_tips="共"+data.maxNum+"条记录.本月出售"+data.monthNum+"次,"+data.monthTotalMoney+"张"+scope.money_name+"";
        }
        /*查看详情*/
        scope.getInfo=function (state,id) {
            if(Number(state==1)){
                scope.getPlayerInfo(id);
            }else if(Number(state==2)){
                scope.getAgencyInfo(id);
            }
        }
        /*充值*/
        scope.pay=function (state,id) {
            if(Number(state==1)){
                scope.playerPay(id);
            }else if(Number(state==2)){
                scope.agencyPay(id);
            }
        }
        /*设置用户列表信息*/
        scope.getUserList=function(){

        }
}]);
/*列表----------转账记录*/
app.register.controller('agency_sellRecordCtrl',[
    "$scope","$rootScope","$controller","baseModule","agencyService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('agency_sellRecordBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            scope.nav_info=rootScope.getMenuInfo("agency_sellRecord");/*导航栏信息*/
            scope.table_class="";
            scope.setSeekKeyword();
            /*显示信息列表*/
            scope.getUserList=function(){
                service.sell_record(scope.current_page,scope.page_num,null,2,scope.addUserList);
            }
            /*搜索*/
            scope.startSearch=function(id){
                baseModule.skipPage('agency_sellRecordSeek',{seek: id}); // 传递参数的跳转
            }
            scope.getUserList();
        });
}]);
/*搜索个某个代理的出售记录------转账记录搜索*/
app.register.controller('agency_sellRecordSeekCtrl',[
    "$scope","$rootScope","$controller","baseModule","agencyService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('agency_sellRecordBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            scope.nav_info=rootScope.getMenuInfo("agency_sellRecordSeek");/*导航栏信息*/
            scope.seekMyCacheName="a_sr_seek";
            scope.setSeekKeyword();
            /*显示信息列表*/
            scope.getUserList=function(){
                service.user_sell_record(scope.seek,scope.current_page,scope.page_num,scope.addUserList);
            }
            console.log(scope.seek);
            /*搜索*/
            scope.startSearch=function(id){
                /*自动搜索*/
                scope.setSeekKeyword(id);
                scope.getUserList();
            }
            scope.getUserList();
        });
}]);