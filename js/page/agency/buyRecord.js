/**
 renderFinish/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 *
 * 购买记录
 */
app.register.directive("agencyBuyRecordList",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/agency/html/'+rootScope.equipmentName+'/buyRecordList.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
/*基础*/
app.register.controller('agency_buyRecordBaseCtrl',[
    "$scope","$rootScope","$controller","baseModule",
    function(scope,rootScope,parentCtrl,baseModule){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*-------------基础变量--------------*/
        scope.current_page=1;/*当前页*/
        scope.page_num=30;/*每页数量*/
        scope.max_page=10;/*总页数*/
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
            scope.nav_input_tips="共"+data.maxNum+"条记录.本月购买"+data.monthNum+"次,"+data.monthTotalMoney+"张"+scope.money_name+"";
        }
        /*设置用户列表信息*/
        scope.getUserList=function(){

        }
    }]);
/*列表*/
app.register.controller('agency_buyRecordCtrl',[
    "$scope","$rootScope","$controller","baseModule","agencyService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('agency_buyRecordBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            scope.nav_info=rootScope.getMenuInfo("agency_buyRecord");/*导航栏信息*/
            scope.table_class="";
            /*显示信息列表*/
            scope.getUserList=function(){
                service.buy_record(scope.current_page,scope.page_num,scope.addUserList);
            }
            /*搜索*/
            scope.startSearch=function(id){
                baseModule.skipPage('agency_buyRecordSeek',{seek: id}); // 传递参数的跳转
            }
            scope.getUserList();
        });
}]);
/*搜索*/
app.register.controller('agency_buyRecordSeekCtrl',[
    "$scope","$rootScope","$controller","baseModule","agencyService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('agency_buyRecordBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            scope.nav_info=rootScope.getMenuInfo("agency_buyRecordSeek");/*导航栏信息*/
            scope.seekMyCacheName="a_br_seek";
            scope.setSeekKeyword();
            /*显示信息列表*/
            scope.getUserList=function(){
                service.user_buy_record(scope.seek,scope.current_page,scope.page_num,scope.addUserList);
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
