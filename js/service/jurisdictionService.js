/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/2.
 */
/*接口----权限管理*/
app.register.factory("jurisdiction_service",["baseService","$rootScope",function(baseService,rootScope){
    var url1="/HomeGM/Jurisdiction/agency_info_list/";//大区代理列表
    var url2="/HomeGM/Jurisdiction/plus_agency_info_list/";//添加大区代理
    var url3="/HomeGM/Jurisdiction/plus_agency_info_list_html/";//添加大区代理页面
    var url4="/HomeGM/Jurisdiction/get_plus_agency_info/";//当前大区代理信息，权限
    var url5="/HomeGM/Jurisdiction/modify_agency_info_jurisdiction/";//修改大区代理信息或权限
    var url6="/HomeGM/Jurisdiction/agency_info_list/";//大区代理列表中搜索大区代理
    var url7="/HomeGM/Jurisdiction/rem_plus_agency/";//删除大区代理的接口
    return{
        list:function(backFun){
            baseService.GM(url1,{userId:rootScope.userInfo.init_id},function(list){
                backFun(setListData(list));
            });
        },
        info:function(uId,backFun){
            baseService.GM(url4,{userId:uId},function(data){
                backFun(data);
            });
        },
        add:function(param,backFun){
            baseService.GM(url2,param,function(data){
                backFun(data);
            });
        },
        setInfo:function(param,backFun){
            baseService.GM(url5,param,function(data){
                backFun(data);
            });
        },
        /*大项权限*/
        configInfo:function(backFun){/*权限列表信息---权限管理*/
            baseService.GM(url3,{},function(info){
                var i, s,name;
                for(i in info){
                    name=info[i].name;
                    info[i].menuName=rootScope.getMenuInfo(name).name;
                    for(s in info[i].list){
                        var obj={
                            name:info[i].list[s],
                            menuName:rootScope.getMenuInfo(name+"_"+info[i].list[s]).name,
                            value:false
                        }
                        info[i].list[s]=obj;
                    }
                }
                backFun(info);
            });
        },

        seek:function(key,backFun){
            baseService.GM(url6,{keyword:key,userId:rootScope.userInfo.init_id},function(list){
                backFun(setListData(list));
            });
        },
        //删除大区代理的接口
        rem_agency:function (param,backFun) {
            baseService.GM(url7,param,function (data) {
                backFun(data);
            },true)
        }

    }

    function setListData(list){
        var num= 1,str,jList;
        for(var i in list){
            list[i].num=num;
            (num%2!=0)?(list[i].class="table_back1"):(list[i].class="table_back2");
            /*权限*/
            str="";
            jList=list[i].jurisdiction;
            for(var s in jList){
                var info=rootScope.getMenuInfo(jList[s]);
                if(info&&info.name){
                    str+=info.name+",";
                }
            }
            list[i].jStr=str;
            num++;
        }
        return list;
    }
}]);