/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/29.
 */
/*接口----信息*/
app.register.factory("agencyService",["baseService","$rootScope",function(baseService,rootScope){
    var url1="/HomeGM/Agency/agency_user_list/";
    var url2="/HomeGM/Agency/set_up_agency/";
    var url3="/HomeGM/Agency/get_init_info/";
    var url3_1="/Home/Agency/setInfo/";//修改代理信息----该功能暂时取消
    var url3_2="/HomeGM/Agency/get_user_info/";
    var url4="/HomeGM/Agency/pay_user/";
    var url5="/HomeGM/Agency/buy_record_list/";
    var url6="/HomeGM/Agency/pay_record_list/";
    var url7="/HomeGM/Agency/s_agency_change/";//设为s级的接口
    var url8="/HomeGM/Agency/m_agency_change/";//设为小代理的接口
    var url9="/HomeGM/Player/get_user_info/";
    var url10="/HomeGM/Agency/enter_deduction/";
    var url11="/HomeGM/Agency/set_up_test_agency/";//设为测试代理接口
    return{
        user_list:function(cPage,pageNum,backFun){
            baseService.GM(url1,{agency_id:rootScope.userInfo.init_id,page:cPage,pageNum:pageNum},function(data){
                setDataInfo(data.list,1+((cPage-1)*pageNum))
                backFun(data);
            });
        },
        seek_user_list:function(keyword,cPage,pageNum,backFun){
            baseService.GM(url1,{keyword:keyword,agency_id:rootScope.userInfo.init_id,page:cPage,pageNum:pageNum},function(data){
                setDataInfo(data.list,1+((cPage-1)*pageNum))
                backFun(data);
            });
        },
        add_user:function(param,backFun){/*添加用户*/
            baseService.GM(url2,param,backFun);
        },


        id_getUserInfo:function(payUId,backFun){/*id获取用户信息*/
            baseService.GM(url3,{agency_id:rootScope.userInfo.init_id,pay_uId:payUId},backFun);
        },
        playerId_getUserInfo:function(playerId,backFun){/*玩家id获取用户信息*/
            baseService.GM(url3_2,{playerId:playerId},backFun);
        },
        setUserInfo:function(data,backFun){
            baseService.GM(url3_1,data,backFun);
        },
        pay:function(payUId,money,backFun){
            baseService.GM(url4,{agency_id:rootScope.userInfo.init_id,pay_uId:payUId,pay_money:money},backFun,true);
        },
        /*自己的购买记录*/
        buy_record:function(cPage,pageNum,backFun){
            console.log(rootScope.userInfo);
            baseService.GM(url5,{agency_id:rootScope.userInfo.userId,page:cPage,pageNum:pageNum},function(data){
                setDataInfo(data.list,1+((cPage-1)*pageNum));
                backFun(data);
            });
        },
        /*自己的出售记录--------转账记录*/
        sell_record:function(cPage,pageNum,sell_id,obj,backFun){
            baseService.GM(url6,{agency_id:rootScope.userInfo.userId,object:obj,page:cPage,pageNum:pageNum,sell_id:sell_id},function(data){
                setDataInfo(data.list,1+((cPage-1)*pageNum));
                backFun(data);
            });
        },
        /*自己的出售给玩家的记录*/
        sell_player_record:function(cPage,pageNum,backFun){
            baseService.GM(url6,{agency_id:rootScope.userInfo.userId,page:cPage,pageNum:pageNum,object:1},function(data){
                setDataInfo(data.list,1+((cPage-1)*pageNum));
                backFun(data);
            });
        },
        /*下级代理的购买记录*/
        user_buy_record:function(a_id,cPage,pageNum,backFun){
            baseService.GM(url5,{keyword:a_id,agency_id:rootScope.userInfo.userId,page:cPage,pageNum:pageNum},function(data){
                setDataInfo(data.list,1+((cPage-1)*pageNum));
                backFun(data);
            });
        },
        /*查询 某个代理的出售记录----------出售记录搜索*/
        user_sell_record:function(select_agency_id,cPage,pageNum,backFun){ /*下级代理的出售记录*/
            baseService.GM(url6,{agency_id:rootScope.userInfo.userId,select_agency_id:select_agency_id,page:cPage,pageNum:pageNum},function(data){
                setDataInfo(data.list,1+((cPage-1)*pageNum));
                backFun(data);
            });
        },
        /*设为s级代理的接口*/
        s_agency_change:function (user_id_seek,grade,backFun) {
            baseService.GM(url7,{user_id_seek:user_id_seek,grade:grade},backFun);
        },
        /*设为普通代理的接口*/
        m_agency_change:function (user_id_seek,grade,backFun) {
            baseService.GM(url8,{user_id_seek:user_id_seek,grade:grade},backFun);
        },
        /*查玩家基本信息*/
        player_id_getUserInfo:function(userId,backFun){
            baseService.GM(url9,{userId:userId},function(data){
                backFun(data);
            });
        },
        /*扣除房卡里面的确认扣除接口*/
        enter_deduction:function (param,backFun) {
            baseService.GM(url10,param,function(data){
                backFun(data);
            });
        },
        /*扣除房卡里面的确认扣除接口*/
        set_up_test_agency:function (param,backFun) {
            baseService.GM(url11,param,function(data){
                backFun(data);
            });
        }
    }
    /*整理信息*/
    function setDataInfo(list,num){
        for(var i in list){
            list[i].num=num;
            (num%2!=0)?(list[i].class="table_back1"):(list[i].class="table_back2");
            if(list[i].userName)list[i].userName=decodeURIComponent(list[i].userName);
            if(list[i].agencyName)list[i].agencyName=decodeURIComponent(list[i].agencyName);
            if(!list[i].head||(list[i].head&&list[i].head.length<=20)){
                list[i].head="image/head/1.png";
            }
            if(list[i].level){
                list[i].levelName=rootScope.configInfo.IDLevel["level"+list[i].level].name;
            }
            num++;
        }
        return list;
    }
}]);