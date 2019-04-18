/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/1.
 */

/*用基础控件*/
app.register.controller('player_payCtrl',[
    "$scope","$rootScope","$controller","baseModule","playerService","myPopUp","baseService",
    function(scope,rootScope,parentCtrl,baseModule,service,myPopUp,baseService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------信息--------------*/
            scope.nav_info=rootScope.getMenuInfo("player_pay");/*导航栏信息*/
            scope.searchPlaceholder="玩家ID 搜索";
            scope.user_isAdd=false;/*用户是否存在*/
            scope.pay_money=0;/*充值金额*/
            scope.balance=rootScope.userInfo.userTreasure;/*账户余额*/
            scope.seekMyCacheName="p_pay_uId";
            scope.nav_input_type="tel";//数字键盘
            scope.tooltip="输入玩家ID来搜索";//搜索提示
            scope.userInfo=null;
            scope.setSeekKeyword();
            /*事件*/

            //字符串转义
            scope.get_name=function(name){
                return decodeURIComponent(name);
            }
            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(Number(id));
                addUserInfo();
            }
            /*查看用户详情*/
            scope.lookUserInfo=function(){

            }
            /*输入文本获取焦点*/
            scope.inputAdaptive=function (input,_is) {

            }
            /*充值金额++--*/
            scope.setMoney=function (num) {
                scope.pay_money=Number(scope.pay_money);
                scope.pay_money+=num;
                if(scope.pay_money<=0)scope.pay_money=0;
                else if(scope.pay_money>scope.balance)scope.pay_money=scope.balance;
            }
            /*开始充值*/
            scope.startPay=function(userId){
                if(scope.user_isAdd){
                    /*判断参数是否完整*/
                    if(scope.pay_money<0)scope.pay_money=0;
                    if(baseModule.judge_param_null([scope.pay_money,"充值金额"]
                        )){
                        myPopUp.alert("确认充值["+scope.pay_money+"]",function(){

                            console.log(userId);
                            service.pay(userId,Number(scope.pay_money),function(){
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
                    myPopUp.supernatant("该用户不存在 请检查用户ID");
                }
            }
            /*显示用户信息*/
            function addUserInfo(){
                scope.updateScroll(1);
                scope.user_isAdd=false;
                if(scope.seek)
                    service.id_getUserInfo(scope.seek,function(data){
                        scope.userInfo=data;
                        if(data){
                            scope.seek=data.id;
                            scope.user_isAdd=true;
                            scope.userInfo["createTime"]=baseModule.getTime(scope.userInfo["createTime"]);
                        }
                        scope.updateScroll();
                    });
            }
            addUserInfo();
        });
}]);
