/**
 * 唐僧洗头爱飘柔  --丁杰 2017/11/18.
 * 俱乐部主页
 */
app.register.controller("jerry_indexCtrl",[
    "$scope","$rootScope","$controller","baseModule","myPopUp","jerryService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,jerryService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});


        /*登录验证*/
        baseModule.judgeLogin(function(){

            /*导航栏信息*/
            scope.nav_info=rootScope.getMenuInfo("jerry_index");

            /*我的俱乐部数据*/
            scope.dataInfo=[{hide:true},{hide:true},{hide:true}];


            //跳转路由----创建俱乐部
            scope.setupOne=function(){
                baseModule.skipPage('jerry_add');
            }

            //跳转路由----成员列表
            scope.userList=function(clubId) {
                baseModule.skipPage('jerry_userList',{seek: clubId});
            }

            //跳转路由----俱乐部充卡
            scope.pay=function(clubId,clubName) {
                baseModule.skipPage('jerry_pay',{seek: clubId,clubName:clubName});
            }

            //跳转路由----战绩查询
            scope.recordList=function(clubId) {
                baseModule.skipPage('jerry_recordList',{seek: clubId});
            }

            // 判断有几个俱乐部，走接口
            scope.index=function(){
                var param={
                    userId:rootScope.userInfo.init_id//用户ID
                }
                //调试// console.log(rootScope.userInfo.init_id);
                //走接口
                jerryService.index(param,function(data){

                    //创建成功
                    rootScope.userInfo.clubInfo=data;
                    scope.dataInfo=[];
                    for(var i=0;i<3;i++){
                        if(data.clubs[i]){
                            //如果没有值的话，则显示正常模式
                            // data.clubs[i].allPerson=Number(data.clubs[i].allPerson)+1;
                            if(data.clubs[i].FE){
                                //判断结束时间是否小于等竽当前时间
                                if(data.clubs[i].FE<=Date.parse(new Date())){
                                    data.clubs[i].sow=false;
                                }else{
                                    data.clubs[i].sow=true;
                                    var time = new Date(data.clubs[i].FE);
                                    var y = time.getFullYear();
                                    var m = time.getMonth()+1;
                                    var d = time.getDate();
                                    var FE_time=y+'-'+m+'-'+d;
                                    data.clubs[i].FE=FE_time;
                                }
                            }else{
                                data.clubs[i].sow=false;
                            }

                            // 判断初始库存低于库存预警时字体变为红色
                            if(Number(data.clubs[i].lastMoney)<=Number(data.clubs[i].yuJing)){
                                data.clubs[i].hie=true;
                            }else{
                                data.clubs[i].hie=false;
                            }
                            var obj=data.clubs[i];
                            obj.url="";
                            if(rootScope.configInfo.versionInfo.AH_develop){
                                //测试版本
                                if(rootScope.configInfo.statistic_pro_name=="X9_1"||rootScope.configInfo.statistic_pro_name=="X9_13") { //斗地主分包走这个
                                    var AH_param = JSON.parse(decodeURIComponent(window["AH_param"]));//获取cid
                                    var list = rootScope.configInfo.appList;//获取分包配置组
                                    for (var g in list) { //遍历数组
                                        if (Number(AH_param.cId) == Number(list[g].cId)) { //对应的cid分享对应游戏的链接
                                            obj.url = list[g].gameLoginUrl_alpha + "&state=3_" + obj.clubId;
                                            // console.log(list[g].gameLoginUrl_alpha+"   测试的");
                                            // console.log(list[g].gameLoginUrl_+"   正式的");
                                        }
                                    }
                                }else{
                                    obj.url=rootScope.configInfo.gameLoginUrl_alpha+"&state=3_"+obj.clubId;
                                }
                            }else{
                                //正式版本
                                if(rootScope.configInfo.statistic_pro_name=="X9_1"||rootScope.configInfo.statistic_pro_name=="X9_13") { //斗地主分包走这个
                                    var AH_param = JSON.parse(decodeURIComponent(window["AH_param"]));//获取cid
                                    var list = rootScope.configInfo.appList;//获取分包配置组
                                    for (var j in list) { //遍历数组
                                        if (Number(AH_param.cId) == Number(list[j].cId)) { //对应的cid分享对应游戏的链接
                                            obj.url = list[j].gameLoginUrl_ + "&state=3_" + obj.clubId;
                                        }
                                    }
                                }else{
                                    obj.url=rootScope.configInfo.gameLoginUrl+"&state=3_"+obj.clubId;
                                }
                            }
                            getBase64(obj);
                            scope.dataInfo.push(obj);
                        }else{
                            scope.dataInfo.push({hide:true});
                        }
                    }
                    //平滑滚动
                    scope.updateScroll(1);
                })
            }

            scope.index();//调用接口

            //获取二维码base64数据
            function getBase64(obj) {
                var div=$("<div></div>");
                div.qrcode({
                    render: "canvas", //table方式
                    width: 300, //宽度
                    height:300, //高度
                    text: obj.url
                });
                $("body").append(div);
                var canvas=div.find(">canvas")[0];
                var dataURL=canvas.toDataURL('image/jpeg'); //转换图片为dataURL

                jerryService.getQCode(dataURL,obj.clubName,function (url) {
                    obj.url=url;
                    scope.$apply();
                },300);
            }
        });
    }]);