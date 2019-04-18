/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 * 游戏分数（战绩）列表
 */
/*用基础控件*/
app.register.directive("playerGameScoreRecordList",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/player/html/'+rootScope.equipmentName+'/gameScoreRecordBase.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
/*基础*/
app.register.controller('player_gameScoreRecordBaseList',[
    "$scope","$rootScope","$controller","myPopUp",
    function(scope,rootScope,parentCtrl,myPopUp){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*-------------信息--------------*/
        scope.searchPlaceholder="用户ID 搜索";
        scope.list=[];
        scope.current_page=1;/*当前页*/
        scope.page_num=20;/*每页数量*/
        scope.max_page=10;/*总页数*/
        /*-------------事件--------------*/
        /*翻页*/
        scope.paging=function(){
            scope.addList();
        }
        /*显示列表信息*/
        scope.setList=function(data){
            scope.loadingInfoOk(data);
        }
        /*获取显示列表信息*/
        scope.addList=function(){

        }
        /*搜索*/
        scope.startSearch=function(id){

        }
        /*加载详情*/
        scope.loadInfo=function (info) {
            info.fileUrl=rootScope.configInfo.gameScoreUrl+moment(info.sTime).format('YYYYMDHmmss')+"-"+info.roomID;
            $.ajax({url:info.fileUrl+".txt",dataType:"json",success:function (data) {
                info.xjsInfo=data.info;
                console.log(info.xjsInfo)
                scope.$apply();
            },error:function () {
                myPopUp.supernatant("数据异常");
            }});
        }
        /*tooltip 提示动画*/
        scope.renderFinish = function(){
            $("[data-toggle='game_SMC_tooltip']").tooltip();
        }
        scope.updateXiaLa=function () {
            setTimeout(function () {
                scope.updateScroll(2);
            },800);
        }
    }]);
/*列表*/
app.register.controller('player_gameScoreRecordCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('player_gameScoreRecordBaseList', {$scope: scope});
        baseModule.judgeLogin(function(){
            /*-------------信息--------------*/
            scope.nav_info=rootScope.getMenuInfo("player_scoreRecord");/*导航栏信息*/
            /*-------------事件--------------*/
            /*显示列表信息*/
            scope.addList=function(){
                service.record(scope.current_page,scope.page_num,scope.setList);
            }
            /*搜索*/
            scope.startSearch=function(id){
                baseModule.skipPage('player_scoreRecord_seek',{seek: Number(id)}); // 传递参数的跳转
            }
            scope.addList();
        });
    }]);
/*搜索*/
app.register.controller('player_gameScoreRecordSeekCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('player_gameScoreRecordBaseList', {$scope: scope});
        baseModule.judgeLogin(function(){
            /*-------------信息--------------*/
            scope.nav_info=rootScope.getMenuInfo("player_scoreRecordSeek");/*导航栏信息*/
            scope.seekMyCacheName="p_g_seek";
            /*-------------事件--------------*/
            scope.setSeekKeyword();
            /*显示列表信息*/
            scope.addList=function(){
                if(!Number(scope.seek))scope.seek="111";
                service.u__record(scope.seek,scope.current_page,scope.page_num,scope.setList);
            }
            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(Number(id));
                scope.addList();
            }
            scope.addList();
        });
}]);
