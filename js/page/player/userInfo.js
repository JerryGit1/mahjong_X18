/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/29.
 *
 * 用户详情
 */
app.register.controller('player_userInfoCtrl',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","playerService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,service){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope}); //This works
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*--------------父类基础信息配置-------------------*/
            scope.nav_info=rootScope.getMenuInfo("player_userInfo");
            scope.seekMyCacheName="p_u_seek";
            scope.setSeekKeyword();/*获取搜索缓存*/
            /*--------------当前基础信息配置-------------------*/
            scope.head="image/logo.png";
            scope.blackBtnName="拉入黑名单";
            /*--------------事件-------------------*/
            /*tooltip 提示动画*/
            $("[data-toggle='game_SMC_tooltip']").tooltip();
            //字符串转义
            scope.get_name=function(name){
                return decodeURIComponent(name);
            }

            /*获取用户信息*/
            function addUserInfo(){
                service.id_getUserInfo(scope.seek,function(list){
                    scope.userInfo=list;
                    if(scope.userInfo.black=="1"){
                        scope.black=true;
                    }else if(scope.userInfo.black=="0"){
                        scope.black=false;
                    }
                    if(scope.userInfo.state==1)scope.blackBtnName="拉入黑名单";
                    else if(scope.userInfo.state==0)scope.blackBtnName="移出黑名单";
                    scope.userInfo["createTime"]=baseModule.getTime(scope.userInfo["createTime"]);
                    /*充值信息*/
                    service.u_pay_record(scope.seek,1,10,function(data){
                        scope.payInfo=data.list;
                        ///*消费信息*/
                        service.u_consume_record(scope.seek,1,10,function(data){
                            scope.consumeInfo=data.list;
                            ///*战绩信息*/
                            service.u__record(scope.seek,1,10,function(data){
                                scope.recordInfo=data.list;
                            });
                        });
                    });
                });
            }
            /*充值*/
            scope.pay=function(){
                baseModule.skipPage("player_pay",{seek: scope.seek});
            }
            /*黑名单操作*/
            scope.setBlackState=function(black){
                if(scope.userInfo)
                    service.user_set_black(scope.userInfo.id,black,function(data){
                        myPopUp.supernatant("操作成功");
                        addUserInfo();
                    });
            }
            /*查看更多信息*/
            scope.lookMore=function(type){
                var name;
                switch(type){
                    case 1:/*充值记录*/
                        name='player_payRecord_seek';
                        break;
                    case 2:/*消费记录*/
                        name='player_consumeRecord_seek';
                        break;
                    case 3:/*战绩记录*/
                        name='player_scoreRecord_seek';
                        break;
                }
                baseModule.skipPage(name,{seek: scope.seek});
            }
            addUserInfo();
        });
    }]);