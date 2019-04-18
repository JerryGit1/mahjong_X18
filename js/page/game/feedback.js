/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/29.
 *
 * 用户反馈
 */
app.register.controller('game_FBCtrl',[
    "$scope","$rootScope","$controller","baseModule","game_FB_service",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------基础变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("game_feedback");/*导航栏信息*/
            scope.table_class="terques";
            scope.list=[];
            scope.current_page=1;/*当前页*/
            scope.page_num=20;/*每页数量*/
            scope.max_page=10;/*总页数*/
            /*-------------事件--------------*/
            /*删除一条信息*/
            scope.deleteInfo=function(id){

            }
            /*翻页*/
            scope.paging=function(){
                getCurrentPageInfo();
            }
            /*tooltip 提示动画*/
            scope.renderFinish = function(){
                $("[data-toggle='game_SMC_tooltip']").tooltip();
            }
            /*获取显示当前页数据*/
            function getCurrentPageInfo(){
                service.list(scope.current_page,scope.page_num,function(data){
                    scope.list=data.list;
                    scope.max_page=data.maxPage;
                    for(var i in scope.list){
                        var time=scope.list[i]["createTime"];
                        if(time)scope.list[i]["createTime"]=baseModule.getTime(time);
                    }
                });
            }
            getCurrentPageInfo();
        });
    }]);