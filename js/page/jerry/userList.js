/**
 * 唐僧洗头爱飘柔  --丁杰   2017/11/20.
 * 成员列表
 */
app.register.controller("jerry_userListCtrl",[
    "$scope","$rootScope","$controller","baseModule","myPopUp","jerryService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,jerryService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*导航栏信息*/
            scope.nav_info=rootScope.getMenuInfo("jerry_userList");
            scope.seekMyCacheName="clubId";/*搜索内容缓存关键字*/

            scope.forList={};//入会申请列表接口
            scope.memberList={};//成员列表
            scope.leaveList={};//离会申请列表
            scope.page1 = true;// 默认显示成员列表
            scope.setSeekKeyword();

            //字符串转义
            scope.get_name=function(name){
                return decodeURIComponent(name);
            }

            // 成员管理选项卡
            scope.show = function(page){
                if(page==1){
                    scope.page1 = true;
                    scope.page2 = false;
                    scope.page3 = false;
                    scope.get_memberList();
                }else if(page==2){
                    scope.page1 = false;
                    scope.page2 = true;
                    scope.page3 = false;
                    scope.forList1();//入会申请调用

                    //同意入会申请
                    scope.success=function(one,userId){
                        myPopUp.alert("同意该成员加入吗?",function(){
                            console.log(userId);
                            // 发送数据
                            var param={
                                clubId:scope.seek,//俱乐部ID
                                userId:rootScope.userInfo.init_id,//玩家ID
                                inClubUserId:userId,//处理的入会人
                                opeType:one,
                                applyType:1
                            }
                            console.log(one);
                            // 走接口
                            jerryService.success(param,function(data){
                                //从数组中删除被删的那个人
                                console.log(scope.forList);
                                for(var f in scope.forList.users){
                                    if(Number(scope.forList.users[f].userId)==Number(userId)){
                                        scope.forList.users.splice(f,1);
                                    }
                                }
                                //没人的时候取消小红点
                                if(!scope.forList.users[0]){
                                    scope.sow=false;
                                }
                                myPopUp.supernatant("操作成功");
                            })
                        });
                    }
                    //拒绝入会申请
                    scope.under=function(two,userId){
                        myPopUp.alert("拒绝该成员加入吗？",function(){
                            var pram={
                                clubId:scope.seek,//俱乐部ID
                                userId:rootScope.userInfo.init_id,//玩家ID
                                inClubUserId:userId,//处理的入会人
                                opeType:two,
                                applyType:1
                            }
                            // 走接口
                            jerryService.success(pram,function(data){
                                //从数组中删除被删的那个人
                                for(var g in scope.forList.users){
                                    if(Number(scope.forList.users[g].userId)==Number(userId)){
                                        scope.forList.users.splice(g,1);
                                    }
                                }
                                //没人的时候取消小红点
                                if(!scope.forList.users[0]){
                                    scope.sow=false;
                                }
                                myPopUp.supernatant("操作成功");
                            })
                        });
                    }
                }else if(page==3){
                    scope.page1 = false;
                    scope.page1 = false;
                    scope.page2 = false;
                    scope.page3 = true;
                    scope.getListInfo();// 离会申请列表调用
                    //同意离会申请
                    scope.goBar=function(one,userId){
                        myPopUp.alert("同意离开俱乐部吗?",function(){
                            var param={
                                clubId:scope.seek,//俱乐部ID
                                userId:rootScope.userInfo.init_id,//玩家ID
                                inClubUserId:userId,//处理的入会人
                                opeType:one,
                                applyType:2
                            }
                            console.log(one);
                            // 走接口
                            jerryService.success(param,function(data){
                                //从数组中删除被删的那个人
                                for(var h in scope.leaveList.users){
                                    if(Number(scope.leaveList.users[h].userId)==Number(userId)){
                                        scope.leaveList.users.splice(h,1);
                                    }
                                }
                                //没人的时候取消小红点
                                if(!scope.leaveList.users[0]){
                                    scope.hed=false;
                                }
                                myPopUp.supernatant("操作成功");
                            })
                        });
                    }
                    // 拒绝离会申请
                    scope.here=function(two,userId){
                        myPopUp.alert("拒绝离会申请吗?",function(){
                            var param={
                                clubId:scope.seek,//俱乐部ID
                                userId:rootScope.userInfo.init_id,//玩家ID
                                inClubUserId:userId,//处理的入会人
                                opeType:two,
                                applyType:2
                            }
                            console.log(two);
                            // 走接口
                            jerryService.success(param,function(data){
                                scope.getListInfo(); //调用离会申请
                                //从数组中删除被删的那个人
                                for(var o in scope.leaveList.users){
                                    if(Number(scope.leaveList.users[o].userId)==Number(userId)){
                                        scope.leaveList.users.splice(o,1);
                                    }
                                }
                                //没人的时候取消小红点
                                if(!scope.leaveList.users[0]){
                                    scope.hed=false;
                                }
                                myPopUp.supernatant("操作成功");
                            })

                        });
                    }
                }
            }

            // 成员列表
            scope.get_memberList=function(){
                // 传数据
                var param={
                    clubId:scope.seek,//俱乐部ID
                    userId:rootScope.userInfo.init_id,//玩家ID
                    page:10
                }
                jerryService.memberList(param,function(data){
                    for(var i in data.users){
                        if(Number(data.users[i].userId)==Number(rootScope.userInfo.userId)){
                            data.users[i]["show"]=true;
                        }
                    }
                    //判断入会申请的小红点
                    if(Number(data.wantIn)>0){
                        scope.sow=true;
                    }else{
                        scope.sow=false;
                    }
                    //判断离会申请小红点
                    if(Number(data.wantOut)>0){
                        scope.hed=true;
                    }else{
                        scope.hed=false;
                    }
                    scope.memberList=data;
                    scope.updateScroll(1);
                })
            }

            //删除成员---成员列表里面的
            scope.rem=function(userId){
                myPopUp.alert("确定要删除吗?",function(){
                    console.log(userId);
                    var param={
                        clubId:scope.seek,//俱乐部ID
                        userId:rootScope.userInfo.init_id,//玩家ID
                        deleteUserId:userId
                    }
                    jerryService.rem(param,function(data){
                        for(var k in scope.memberList.users){
                            if(Number(scope.memberList.users[k].userId)==Number(userId)){
                                scope.memberList.users.splice(k,1);
                            }
                        }
                        myPopUp.supernatant("操作成功");
                    })
                })
            }

            // 入会申请列表
            scope.forList1=function () {
                var param={
                    clubId:scope.seek,
                    userId:rootScope.userInfo.init_id,
                    page:10
                }
                // 走接口
                jerryService.forList(param,function(data){
                    scope.memberList.currNum=data.num;
                    scope.forList=data;
                    // console.log(scope.forList);
                    setTimeout(function(){
                        scope.updateScroll(1);
                    },100)
                })
            }

            // 离会申请列表
            scope.getListInfo=function () {
                var param={
                    clubId:scope.seek,//俱乐部ID
                    userId:rootScope.userInfo.init_id,//玩家ID
                    page:10
                }
                //走接口
                jerryService.leaveList(param,function(data){
                    scope.leaveList=data;
                    scope.memberList.currNum=data.num;
                    setTimeout(function(){
                        scope.updateScroll(1);
                    },100)
                })
            }
            scope.updateScroll(1);

            scope.get_memberList();//成员列表默认显示
        });
    }]);