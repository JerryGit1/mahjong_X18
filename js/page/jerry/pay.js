/**
 * 唐僧洗头爱飘柔  --丁杰 2017/11/20.
 */
app.register.controller("jerry_payCtrl",[
    "$scope","$rootScope","$controller","baseModule","myPopUp","jerryService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,jerryService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(clubId){
            /*导航栏信息*/
            scope.nav_info=rootScope.getMenuInfo("jerry_pay");
            scope.seekMyCacheName="clubName";/*搜索内容缓存关键字*/
            scope.setSeekKeyword();
            scope.money=0;//要转入的房卡
            scope.payInfo={};
            /*事件*/

            //点击加减
            scope.setMoney=function(num){
                scope.money=Number(scope.money);
                scope.money+=num;
                if(scope.money<=0){scope.money=1;}
                else if(scope.payInfo.myMoney<scope.money)scope.money=scope.payInfo.myMoney;
            }

            //验证用户输入的值
            scope.num=function(nptNum){
                if(nptNum==undefined){
                    myPopUp.alert("请输入纯数字");
                }
            }
            //走接口
            scope.getClubInfo=function() {
                // console.log(rootScope.userInfo.clubInfo);
                var param={
                    clubId:scope.seek,
                    userId:rootScope.userInfo.init_id
                }
                // 走接口
                jerryService.getClubInfo(param,function(data){
                    console.log(data.clubName);
                    scope.payInfo=data;
                    // console.log(data);
                });
            }
            //开始充值
            scope.startPay=function (money) {
                if(scope.payInfo.myMoney>=scope.money){
                    if(scope.money>0){
                        myPopUp.alert("确定要转入"+scope.money+scope.money_name+"吗？",function(){
                            jerryService.pay({clubId:scope.seek,userId:rootScope.userInfo.init_id,addMoney:money},function(data){
                                myPopUp.supernatant("转入成功");
                                baseModule.skipPage('jerry_index');
                            });
                        });
                    }else{
                        myPopUp.supernatant("转入金额不能为0");
                    }
                }else{
                    myPopUp.alert("转入房卡不可高于我的库存");
                }
            }
            //平滑滚动
            scope.updateScroll(1);
            scope.getClubInfo();
        });
    }]);