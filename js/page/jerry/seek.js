/**
 * 唐僧洗头爱飘柔  --丁杰 2017/11/20.
 */
app.register.controller("jerry_seekCtrl",[
    "$scope","$rootScope","$controller","baseModule","myPopUp","jerryService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,jerryService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*导航栏信息*/
            scope.nav_info=rootScope.getMenuInfo("jerry_seek");
            scope.searchPlaceholder="代理ID搜索";
            scope.seekMyCacheName="p_l_seek";/*搜索内容缓存关键字*/
            scope.user_id=null;
            scope.leaveList={};
            scope.user_info={};
            scope.setSeekKeyword();

            //字符串转义
            scope.get_name=function(name){
                return decodeURIComponent(name);
            }
            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(id);
                scope.user_id=id;
                scope.getUserList();
            }
            /*显示该代理的俱乐部信息*/
            scope.getUserList=function(){
                var param={
                    toUserId:scope.user_id,//被搜索的用户Id
                    userId:rootScope.userInfo.init_id//搜索的用户ID
                }//java后端的接口
                var playerId={
                    playerId:scope.user_id
                }//gm后端的接口
                //走gm后端接口 获取用户信息
                jerryService.getInitInfo(playerId,function(data) {
                    scope.user_info=data;
                })
                //走接口
                jerryService.searchClubs(param,function(data){
                    scope.leaveList=data;
                    if(scope.leaveList.clubs.length==0){//判断当前没有俱乐部提醒
                        scope.hide=false;
                    }else{
                        scope.hide=true;
                    }
                    for(var i=0;i<scope.leaveList.clubs.length;i++){
                        var day=scope.leaveList.clubs[i].FE;
                        if(day>Date.parse(new Date())){
                            data.clubs[i].sow=true;
                            data.clubs[i].FE=moment(new Date(day)).format("YYYY-MM-DD");
                        }else{
                            data.clubs[i].sow=false;
                            day=Date.parse(new Date());
                            data.clubs[i].FE=moment(new Date()).format("YYYY-MM-DD");
                        }
                        var week=Number(day)+(7*3600*24*1000);
                        var month=Number(day)+(30*3600*24*1000);
                        data.clubs[i].FE_week=moment(new Date(week)).format("YYYY-MM-DD");
                        data.clubs[i].FE_month=moment(new Date(month)).format("YYYY-MM-DD");
                    }
                    // scope.leaveList.clubs.
                    /*平滑滚动*/
                    scope.updateScroll(1);
                })
            }

            /*确认创建按钮*/
            scope.enter=function (ball,clubId,str) {
                // alert(ball);

                myPopUp.alert("确认 续【"+str+"】模式?",function () {
                    var param = {
                        userId: rootScope.userInfo.init_id,//搜索者的id
                        clubId: clubId,//俱乐部id
                        state: ball//包星期或包月1或2
                    }
                    //走接口
                    jerryService.freeClub(param, function (data) {
                        scope.ball = data;
                        scope.getUserList();
                    });
                });
            }

            // 取消限免的接口
            scope.cancel=function (ball,clubId) {
                myPopUp.alert("确定要取消该代理的限免时间吗？",function () {
                    var param={
                        userId:rootScope.userInfo.init_id,//搜索的用户ID
                        clubId:clubId//搜索的用户ID
                    }
                    //走接口
                    jerryService.closeClub(param,function(data){
                        scope.leaveList=data;
                        scope.getUserList();
                    })

                })
            }
            if(scope.seek){
                scope.startSearch(scope.seek);
            }
            scope.updateScroll(1);
        });
    }]);