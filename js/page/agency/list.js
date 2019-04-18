/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 */

/*用基础控件*/
app.register.directive("agencyUserList",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/agency/html/'+rootScope.equipmentName+'/baseList.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
/*基础*/
app.register.controller('agency_listBaseCtrl',[
    "$scope","$rootScope","$controller","baseModule",
    function(scope,rootScope,parentCtrl,baseModule){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*-------------基础变量--------------*/
        scope.searchPlaceholder="ID/昵称/手机号 搜索";
        scope.current_page=1;/*当前页*/
        scope.page_num=30;/*每页数量*/
        scope.max_page=10;/*总页数*/
        scope.list=[];/*信息列表*/
        /*-------------事件--------------*/
        /*翻页*/
        scope.paging=function(){
            scope.getUserList();
        }
        /*查看详情*/
        scope.userInfo=function(id,type){
            if(type==1&&rootScope.equipmentName=="pc")return;/*移动端点击整行查看详情*/
            baseModule.skipPage('agency_userInfo',{seek: id});
        }
        /*搜索*/
        scope.startSearch=function(id){

        }
        /*tooltip 提示动画*/
        scope.renderFinish = function(){
            $("[data-toggle='game_SMC_tooltip']").tooltip();
        }
        /*显示用户列表信息*/
        scope.addUserList=function(data){
            scope.loadingInfoOk(data);

        }
        /*获取用户列表信息*/
        scope.getUserList=function(){

        }
        /*获取身份*/
        scope.getLevelName=function(grade){
            return rootScope.configInfo.IDLevel["level"+grade].name;
        }
        /*tooltip 提示动画*/
        scope.renderFinish = function(){
            $("[data-toggle='game_SMC_tooltip']").tooltip();
        }
 }]);
/*列表*/
app.register.controller('agency_listCtrl',[
    "$scope","$rootScope","$controller","baseModule","agencyService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('agency_listBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------基础变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("agency_list");/*导航栏信息---代理商列表*/
            /*显示信息列表*/
            scope.getUserList=function(){
                service.user_list(scope.current_page,scope.page_num,scope.addUserList);
            }

           /*搜索*/
            scope.startSearch=function(id){
                baseModule.skipPage('agency_listSeek',{seek: id}); // 传递参数的跳转
            }
            scope.getUserList();
        });
}]);
/*列表搜索*/
app.register.controller('agency_listSeekCtrl',[
    "$scope","$rootScope","$controller","baseModule","agencyService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('agency_listBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------基础变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("agency_listSeek");/*导航栏信息----代理搜索*/
            scope.seekMyCacheName="a_s_info";
            scope.setSeekKeyword();
            /*显示信息列表*/
            scope.getUserList=function(){
                service.seek_user_list(scope.seek,scope.current_page,scope.page_num,scope.addUserList);
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
