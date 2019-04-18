/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/29.
 *
 * 管理员列表
 */
/*用户信息列表 基础控件*/
app.register.directive("jurisdictionUserList",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/jurisdiction/html/'+rootScope.equipmentName+'/baseList.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
/*管理员列表基础*/
app.register.controller('jurisdiction_listBaseCtrl',[
    "$scope","$rootScope","$controller","baseModule","jurisdiction_service",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*--------------当前基础信息配置-------------------*/
        scope.table_class="green";/*页面样式*/
        scope.list=[]; /*列表信息*/
        /*--------------事件-------------------*/
        /*查看用户详情*/
        scope.userInfo=function(id){
            baseModule.skipPage('jurisdiction_info',{seek: id}); // 传递参数的跳转
        }
        /*搜索用户*/
        scope.startSearch=function(str){
            baseModule.skipPage('jurisdiction_seek',{seek: str}); // 传递参数的跳转
        }
        /*删除用户*/
        scope.deleteUser=function(id){
            alert("你把我删了");
        }
        /*获取管理员身份*/
        scope.getLevelName=function(level){
            return rootScope.configInfo.IDLevel["level"+level].name;
        }
        /*tooltip 提示动画*/
        scope.renderFinish = function(){
            $("[data-toggle='jurisdiction_tooltip']").tooltip();
        }
        /*显示列表*/
        scope.addList=function(){

        }
    }]);
/*管理员列表*/
app.register.controller('jurisdiction_listCtrl',[
    "$scope","$rootScope","$controller","baseModule","jurisdiction_service",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('jurisdiction_listBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*--------------父类基础信息配置-------------------*/
            scope.nav_info=rootScope.getMenuInfo("jurisdiction_list");/*导航栏信息*/
            scope.searchPlaceholder="输入玩家ID搜索"
            scope.table_class="";/*页面样式*/
            /*--------------事件-------------------*/
            scope.addList=function(){
                service.list(function(list){
                    scope.list=list;

                    scope.updateScroll(1);
                });
            }
            scope.addList();
        });
}]);
/*搜索列表*/
app.register.controller('jurisdiction_seekCtrl',[
    "$scope","$rootScope","$controller","baseModule","jurisdiction_service",
    function(scope,rootScope,parentCtrl,baseModule,service){

        /*-------------继承--------------*/
        parentCtrl('jurisdiction_listBaseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*--------------父类基础信息配置-------------------*/
            scope.seekMyCacheName="j_seek";
            scope.nav_info=rootScope.getMenuInfo("jurisdiction_list_seek");/*导航栏信息*/
            scope.table_class="terques";/*页面样式*/
            /*搜索内容缓存设置*/
            scope.setSeekKeyword();
            /*--------------事件-------------------*/
            /*搜索用户*/
            scope.startSearch=function(str){
                /*重新搜索*/
                scope.setSeekKeyword(str);
                scope.addList();
            }
            scope.addList=function(){
                service.seek(scope.seek,function(list){
                    scope.list=list;
                    scope.updateScroll(1);
                });
            }
            scope.addList();
        });
    }]);