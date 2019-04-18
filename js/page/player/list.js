/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 *
 * 用户信息列表
 */
/*用基础控件*/
app.register.directive("playerUserList",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/player/html/'+rootScope.equipmentName+'/baseList.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
/*基础*/
app.register.controller('player_baseListCtrl',[
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

        /*查看详情*/
        scope.userInfo=function(id){
            baseModule.skipPage('player_userInfo',{seek: id});
        }
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
        }
        /*设置用户列表信息*/
        scope.getUserList=function(){

        }
        /*翻页*/
        scope.paging=function(){
            scope.getUserList();
        }
}]);
/*用户列表*/
app.register.controller('player_listCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('player_baseListCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------信息--------------*/
            scope.searchPlaceholder="ID/昵称/openId 搜索";
            scope.nav_info=rootScope.getMenuInfo("player_list");/*导航栏信息------玩家列表*/
            scope.table_class="";
            /*-------------事件--------------*/
            /*显示信息列表*/
            scope.getUserList=function(){
                service.user_list(scope.current_page,scope.page_num,scope.addUserList);
            }
            /*搜索*/
            scope.startSearch=function(id){
                baseModule.skipPage('player_list_seek',{seek: id});
            }
            scope.getUserList();
        });
}]);
/*用户搜索*/
app.register.controller('player_list_seekCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('player_baseListCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------信息--------------*/
            scope.nav_info=rootScope.getMenuInfo("player_list_seek");/*导航栏信息----玩家搜索*/
            scope.searchPlaceholder="ID/昵称/openId 搜索";
            scope.seekMyCacheName="p_l_seek";/*搜索内容缓存关键字*/
            scope.setSeekKeyword();
            /*-------------事件--------------*/
            /*显示信息列表*/
            scope.getUserList=function(){
                service.seek_user_list(scope.seek,scope.current_page,scope.page_num,scope.addUserList);
            }

            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(id);
                scope.getUserList();
            }
            scope.getUserList();
        });
    }]);
/*黑名单用户列表*/
app.register.controller('player_blacklistCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('player_baseListCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*导航栏信息*/
            scope.searchPlaceholder="ID/昵称/openId 搜索";
            scope.table_class="";
            scope.nav_info=rootScope.getMenuInfo("player_blacklist");/*导航栏信息*/
            /*显示信息列表*/
            scope.getUserList=function(){
                service.user_black_list(scope.current_page,scope.page_num,scope.addUserList,function (data) {
                    console.log(data);
                });
            }
            /*搜索*/
            scope.startSearch=function(id){
                baseModule.skipPage('player_blacklist_seek',{seek: id});
            }
            scope.getUserList();
        });
    }]);
/*黑名单用户搜索*/
app.register.controller('player_blacklist_seekCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('player_baseListCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------信息--------------*/
            scope.nav_info=rootScope.getMenuInfo("player_blacklist_seek");/*导航栏信息*/
            scope.searchPlaceholder="ID/昵称/openId 搜索";
            scope.seekMyCacheName="p_b_seek";/*搜索内容缓存关键字*/
            scope.setSeekKeyword();
            /*显示信息列表*/
            scope.getUserList=function(){
                service.seek_user_black_list(scope.seek,scope.current_page,scope.page_num,scope.addUserList);
            }
            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(id);
                scope.getUserList();
            }
            scope.getUserList();
        });
    }]);