/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/1.
 */
app.register.controller('agency_payCtrl',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","agencyService","baseService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,service,baseService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            scope.nav_info=rootScope.getMenuInfo("agency_pay");
            /*导航栏信息*/
            scope.searchPlaceholder="ID 搜索代理";
            scope.user_isAdd=false;/*用户是否存在*/
            scope.pay_money=0;/*充值金额*/
            scope.grade=0;/*代理等级*/
            scope.balance=rootScope.userInfo.userTreasure;/*余额*/
            scope.seekMyCacheName="a_pay_uId";
            scope.tooltip="输入代理ID来搜索";//搜索提示
            scope.userInfo=null;
            scope.setSeekKeyword();
            /*-------------事件--------------*/
            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(Number(id));
                addUserInfo();
            }
            /*充值金额++--*/
            scope.setMoney=function (num) {
                scope.pay_money=Number(scope.pay_money);
                scope.pay_money+=Number(num);
                if(scope.pay_money<0)scope.pay_money=0;
                else if(scope.pay_money>scope.balance)
                if(rootScope.userInfo.IDLevel<7){
                    scope.pay_money=scope.balance;
                }
            }

            /*代理开始充值*/
            scope.startPay=function(){
                if(scope.user_isAdd){
                    /*判断参数是否完整*/
                    if(scope.pay_money<0)scope.pay_money=0;
                    if(baseModule.judge_param_null([scope.pay_money,"充值金额"])){
                        myPopUp.alert("确认充值["+scope.pay_money+"]",function(){
                            service.pay(scope.userInfo.init_id,Number(scope.pay_money),function(){
                                myPopUp.supernatant("充值成功");
                                scope.pay_money=0;
                                /*刷新个人信息*/
                                baseService.updateUserInfo(null,function(){
                                    /*刷新余额*/
                                    scope.balance=rootScope.userInfo.userTreasure;
                                    /*刷新充值用户信息*/
                                    addUserInfo();
                                });
                            });
                        });
                    }
                }else{
                    scope.seek=null;
                    myPopUp.supernatant("该用户不存在");
                }
            }

            /*获取代理信息*/
            function addUserInfo(){
                scope.updateScroll(1);
                service.id_getUserInfo(scope.seek,function(data){
                    scope.userInfo=data;
                    scope.userId=data.id;
                    scope.grade=data.grade;
                    scope.user_isAdd=true;
                    scope.userInfo.userName=decodeURIComponent(scope.userInfo.userName);
                    scope.userInfo.levelName=rootScope.configInfo.IDLevel["level"+data.grade].name;/*身份*/
                    scope.updateScroll();
                });
            }
            if(scope.seek)addUserInfo();
        });
    }]);