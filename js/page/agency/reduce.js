/**
 * Created by Admin on 2018/2/3.
 */
app.register.controller('agency_reduceCtrl',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","agencyService","baseService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,service,baseService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*导航栏信息*/
            scope.nav_info=rootScope.getMenuInfo("agency_reduce");
            /*被扣除用户信息*/
            scope.deduct_money=0;
            scope.deduct_head=null;
            scope.user_id=null;
            scope.user_name="";
            scope.money="";//第一个玩家身份的钱
            scope.agency_money="";//第一个代理身份的钱
            scope.deduct_num_money=0;
            scope.deduct_select="";
            /*转入账户信息*/
            scope.transfer_initial_money=0;
            scope.transfer_head=null;
            scope.transfer_user_id=null;
            scope.transfer_user_name="";
            scope.transfer_money="";//第二个玩家身份份的钱
            scope.transfer_agency_money="";//第二个代理身份的钱
            scope.transfer_num_money=0;
            scope.transfer_select="";
            //字符串转义
            scope.get_name=function(name){
                return decodeURIComponent(name);
            }
            /*被扣除用户的查询按钮*/
            scope.deduct=function (deduct_val) {
                /*判断deduct_val是否为空，*/
                if( baseModule.judge_param_null(
                        [deduct_val,"搜索内容"]
                    )){
                    service.player_id_getUserInfo(deduct_val,function (data) {
                        console.log(data);
                        scope.deduct_head=data.head;
                        scope.user_id=data.id;
                        scope.user_name=data.userName;
                        scope.money=data.money;
                        scope.agency_money=data.agency_money;
                    })
                }
            }
            /*加钱减钱按钮*/
            scope.deduct_setMoney=function (num) {
                scope.deduct_num_money=Number(scope.deduct_num_money);
                scope.deduct_num_money+=Number(num);
                if(scope.deduct_num_money<=0){scope.deduct_num_money=0;}
            }
            /*转入的用户的查询按钮*/
            scope.transfer=function (transfer_val) {
                /*判断transfer_val是否为空，*/
                if( baseModule.judge_param_null(
                        [transfer_val,"搜索内容"]
                    )){
                    service.player_id_getUserInfo(transfer_val,function (data) {
                        console.log(data);
                        scope.transfer_head=data.head;
                        scope.transfer_user_id=data.id;
                        scope.transfer_user_name=data.userName;
                        scope.transfer_money=data.money;
                        scope.transfer_agency_money=data.agency_money;
                    })
                }
            }
            /*加钱减钱按钮*/
            scope.transfer_setMoney=function (num) {
                scope.transfer_num_money=Number(scope.transfer_num_money);
                scope.transfer_num_money+=Number(num);
                if(scope.transfer_num_money<=0){scope.transfer_num_money=0;}
            }
            /*第一个玩家的监听事件，限制输入的金额不得超过房卡数量,转入的账户不用限制*/
            scope.$watch("deduct_num_money",function(){
                if(scope.deduct_select=="玩家身份"){
                    if(Number(scope.deduct_num_money)>Number(scope.money)){
                        scope.deduct_num_money=Number(scope.money);
                    }
                }else if(scope.deduct_select=="代理身份"){
                    if(Number(scope.deduct_num_money)>Number(scope.agency_money)){
                        scope.deduct_num_money=Number(scope.agency_money);
                    }
                }
            })
            /*确认扣除按妞*/
            scope.enter_deduction=function (user_id,deduct_select,deduct_num_money,transfer_user_id,transfer_select,transfer_num_money) {
                /*重新赋值扣除身份与转入身份*/
                if(deduct_select=="玩家身份"){deduct_select="deduct_player";}else if(deduct_select=="代理身份"){deduct_select="deduct_agency";}else{deduct_select="";}
                if(transfer_select=="玩家身份"){transfer_select="transfer_player";}else if(transfer_select=="代理身份"){transfer_select="transfer_agency";}else{transfer_select="";}
                if( baseModule.judge_param_null(
                        [user_id,"被扣除用户"],
                        [deduct_select,"扣除身份"],
                        [deduct_num_money,"扣除金额"],
                        [transfer_user_id,"转入账户"],
                        [transfer_select,"转入身份"],
                        [transfer_num_money,"转入金额"]
                    )){
                    if(Number(deduct_num_money)==Number(transfer_num_money)){
                        myPopUp.alert("确定要从"+scope.get_name(scope.user_name)+"("+user_id+")"+"扣除"+deduct_num_money+scope.money_name+"到"+scope.get_name(scope.transfer_user_name)+"("+transfer_user_id+")吗？",function () {
                            /*传给后端的参数*/
                            var param={
                                deduct_id:user_id,//扣除的用户id
                                deduct_select:deduct_select,//扣除者的身份
                                deduct_money:deduct_num_money,//扣除金额
                                transfer_id:transfer_user_id,//转入者的id
                                transfer_select:transfer_select,//转入者的身份
                                transfer_money:transfer_num_money//转入者的金额
                            }
                            /*走接口*/
                            service.enter_deduction(param,function (data) {
                                scope.deduct(user_id);
                                scope.transfer(transfer_user_id);
                            })
                            scope.deduct(user_id);
                            scope.transfer(transfer_user_id);
                        });
                    }else{
                        myPopUp.supernatant("扣除金额与转入金额不一致");
                    }
                }
            }
            //平滑滚动
            scope.updateScroll(1);
        });
    }]);