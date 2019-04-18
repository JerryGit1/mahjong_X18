/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 * 消费记录
 */
/*用基础控件*/
app.register.directive("playerConsumeRecordList",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/player/html/'+rootScope.equipmentName+'/consumeRecordBase.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
/*基础*/
app.register.controller('player_consumeRecordBaseCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*-------------信息--------------*/
        scope.searchPlaceholder="用户ID 搜索消费记录";
        scope.list=[];
        scope.current_page=1;/*当前页*/
        scope.page_num=30;/*每页数量*/
        scope.max_page=10;/*总页数*/
        scope.nav_input_type="tel";
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
app.register.controller('player_consumeRecordCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('player_consumeRecordBaseCtrl', {$scope: scope});
        baseModule.judgeLogin(function(){
            /*-------------信息--------------*/
            scope.nav_info=rootScope.getMenuInfo("player_consumeRecord");/*导航栏信息*/
            /*显示列表信息*/
            scope.addList=function(){
                service.consume_record(scope.current_page,scope.page_num,scope.setList);
            }
            /*搜索*/
            scope.startSearch=function(id){
                baseModule.skipPage('player_consumeRecord_seek',{seek: Number(id)}); // 传递参数的跳转
            }
            scope.addList();
        });
    }]);
/*搜索*/
app.register.controller('player_consumeRecordSeekCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('player_consumeRecordBaseCtrl', {$scope: scope});
        baseModule.judgeLogin(function(){
            /*-------------信息--------------*/
            scope.nav_info=rootScope.getMenuInfo("player_consumeRecordSeek");/*导航栏信息*/
            scope.seekMyCacheName="p_c_seek";
            scope.setSeekKeyword();
            /*显示列表信息*/
            scope.addList=function(){
                if(Number(scope.seek)==0)scope.seek="XX";
                service.u_consume_record(scope.seek,scope.current_page,scope.page_num,scope.setList);
            }
            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(Number(id));
                scope.addList();
            }
            scope.addList();
        });
}]);