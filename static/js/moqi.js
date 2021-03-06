/**
 * Created by Administrator on 2017/5/17.
 */
require.config({
    baseUrl: "",
    paths: {
        "jquery": "../lib/jquery-2.2.1.min",
        "migrate": "../lib/jquery-migrate-1.2.1",
        "jbox": "../lib/jquery-jbox/2.3/jquery.jBox-2.3.min",
        "template": "../lib/template",
        "chart": "../js/leftChart",
        "charts": "../js/charts",
        "progressBar":"../js/progressBar",
        "countDown" : "../js/countDown",
        "page":"../js/page"
    },
    shim:{
        'jbox':{
            deps:['jquery']
        },
        'migrate':{
            deps:['jquery']
        }
    }
});

require(['jquery','migrate','template','chart','charts','jbox','progressBar','countDown'], function ($,migrate,template,chart,charts,jbox,progressBar,countDown){
    //当前所选区域对应的全局变量
    var area = "moqi";
    //由于贫困家庭与首页共用签约，提取公共部分
    /**
     * 家医签约点击方法，暂时不做保存筛选条件的处理
     */
    function bottomBind() {
        $(".bottom-head").on("click",function(){
            $(".bottom-header ul li").removeClass("click-active").eq(0).addClass("click-active")
            var $this = $(this).siblings(".bottom-content");
            $this.slideToggle(function(){
                // api.getDoctorSign('illnessCasuses');
            });

        });
    }

    // 数据加载
    var api = {
        'getHomePage': function(){
            $("#leftTabs").addClass("hide");
            //$("#leftOperation").removeClass("hide");
            //$("#sevenStepsTab").addClass("hide");

            //右侧--------------------start

            $.getJSON("../js/json/homePage/dutyHost.json",function(data){
                if(data) {
                    $('#rightSide').html(template('homepageRightSideTemp', data[area]));
                    //进度条生成
                    $("#cause").find(".progressBar").each(function(){
                        var value = $(this).prev().text();
                        progressBar.generate(this,value);
                    });
                    //致贫原因饼图
                    var causePieChartData = {
                        color:['#ed6942','#63c727','#fff100','#f39801','#0168b7','#5f52a1','#546fb4','#00b8ee','#f9b552','#f2914a'],
                        data:data[area].causePieChartData,
                        center:["50%","55%"],
                        radius:["25%","50%"]
                    };
                    charts.labelPie("chartForCause",causePieChartData);
                    //责任主体绑定点击事件
                    $(".goToDetail").on("click", function () {
                        $.jBox('', {title: "组织架构", buttons: {}, border: 0, opacity: 0.4});
                        document.getElementsByTagName('body')[0].style.padding="0";
                        var title = document.getElementsByClassName("jbox-title")[0];
                        title.style.width ="96%";
                        // $.jBox("iframe:../html/perContent.html", {title: "李茜茜", buttons: {}, border: 0, opacity: 0.2})
                        //设置弹窗top值
                        var box = document.getElementById("jbox");
                        // var title = document.getElementsByClassName("jbox-title")[0];
                        box.style.top = "2.6vw";
                        // title.style.textAlign ="cen";
                        var html = template('organizationTemp',{});
                        document.getElementsByClassName('jbox-content')[0].innerHTML = html;
                    })
                }
            })

            //右侧--------------------end

            //左侧--------------------start
            //获取首页左侧数据
            var dataLeft ={};
            var houseHoldArr, populationArr, rateArr;
            $.ajaxSettings.async = false;
            $.getJSON("../js/json/homePage/2017poorTarget.json",function(res){
                // console.log(res)
                var _data = res[area];
                houseHoldArr = [
                    {"value":_data.poorHouseholds.actualPoorHouseholds,"name":'已完成'},{"value":_data.poorHouseholds.notPoorHouseholds,"name":'未完成'}
                ];
                populationArr = [
                    {"value":_data.poorPersons.actualPoorPersons,"name":'已完成'},{"value":_data.poorPersons.notPoorPersons,"name":'未完成'}
                ];
                rateArr = [
                    {"value":_data.poorProbability.poorPersons,"name":'贫困人口'},{"value":_data.poorProbability.countryHousePersons,"name":'农村户籍人口'}

                ];
                dataLeft['townData']=_data;
            });
            $.getJSON("../js/json/homePage/helpMission.json",function(res){
                dataLeft['mission']=res;
            });
            $('#leftSide').html(template('homepageLeftSideTemp', dataLeft));
            // $('#leftSide').html(template('homepageLeftSideTemp', data));
            chart.pieChart("poorFamily","#1fa9f4","#4b586d",houseHoldArr,dataLeft.townData.poorHouseholds.percentage);
            chart.pieChart("poorPeople","#63c727","#4b586d",populationArr,dataLeft.townData.poorHouseholds.percentage);
            chart.pieChart("poorRate","#e9733f","#4b586d",rateArr,dataLeft.townData.poorProbability.percentage);
            $(".section-body.second-sec").find(".progressBar").each(function () {
                var value = $(this).next("div").children("span").text();
                progressBar.generate(this,value);
            })
            //左侧--------------------end

            //底部--------------------start
            $('.bottom').html(template('moqiIntroduction', {}));
            // bottomBind();
            //家医签约按钮点击事件
            $(".bottom-head").on("click",function(){
                var $this = $(this).siblings(".bottom-content");
                $this.slideToggle(function(){
                    var showBool = $this.is(":visible");
                    if(!showBool&&window.timeOut){
                        clearTimeout(timeOut);
                    }else{
                        api.slide("slideBox_r","box-wrapper",1900);
                        // chart.barChart("doctorSign");
                    }
                });
            });
            //家医签约切换标题
            /*$(".bottom-header ul").on("click","li", function(){
                var activeBool = $(this).hasClass("click-active");
                if(!activeBool){
                    $(this).addClass("click-active");
                    $(this).siblings("li").removeClass("click-active");
                    var type = $(this).attr("data-type");
                    api.getDoctorSign(type);
                }
            });*/
            //底部--------------------end
        },
        'getFiveGroup': function(){
            $("#leftTabs").addClass("hide");
            // $("#leftOperation").addClass("hide");
            // $("#sevenStepsTab").removeClass("hide");
            //右侧--------------------start
            $.getJSON("../js/json/fiveGroup/fivegroup_right.json",function(res){
                var data = res[area];
                $('#rightSide').html(template('sevenStepsRightSideTemp', data));

                charts.gauge("putOnRecordChart",{value:data.healthPoint,color:'#83ea43',dataValue:data.healthPoint*100});
                charts.gauge("diagnosisChart",{value:data.diagnosisPoint,color:'#fd8320',dataValue:data.diagnosisPoint*100});
                charts.labelPie("healthChart",{color:["#f84c24","#fde101","#83d130","#0786ef"],data:data.healthDetail});
                charts.labelPie("laborChart",{color:["#f84c24","#fde101","#83d130","#0786ef"],data:data.laborDetail});
                charts.gauge("signChart",{value:data.signPoint,color:'#3ad3e1',dataValue:data.signPoint*100});
                charts.gauge("overcomePovertyChart",{value:data.poorPoint,color:'#e14e35',dataValue:data.poorPoint*100});
            });


            //右侧--------------------end

            //左侧--------------------start
            $.getJSON("../js/json/fiveGroup/fivegroup_left.json",function(res){
                var data = res[area];
                $('#leftSide').html(template('fiveLeftSideTemp', data));
                //进度条生成
                $(".section-body.second-sec").find(".progressBar").each(function () {
                    var value = $(this).next("div").children("span").text();
                    progressBar.generate(this,value);
                })
            });

            //左侧--------------------end

            //底部--------------------start
            $.getJSON("../js/json/fiveGroup/helpDynamic.json",function(res){
                var data={};
                data.list = res.povertyNews["moqi"];
                $('.bottom').html(template('helpDynamicTemp', data));
            });
            //家医签约按钮点击事件
            $(".bottom-head").on("click",function(){
                var $this = $(this).siblings(".bottom-content");
                $this.slideToggle(function(){
                    var showBool = $this.is(":visible");
                    if(!showBool&&window.timeOut){
                        clearTimeout(timeOut);
                    }else{
                        api.slide("slideBox","box-wrapper");
                        // chart.barChart("doctorSign");
                    }
                });
            });
            //底部--------------------end
            //弹窗部分代码

            //建档情况
            $("#openDoc").on("click", function () {
                var $pop = api.openPopWindow("建档情况");
                /*var $pop = $.jBox('', {title: "建档情况", buttons: {}, border: 0, opacity: 0.4});
                document.getElementsByTagName('body')[0].style.padding="0";
                //改变title宽度
                var title = document.getElementsByClassName("jbox-title")[0];
                title.style.width ="96%";*/
                $.getJSON("../js/json/fiveGroup/recordJbox.json",function(res){
                    if(res&&res[area]){
                        var data = res[area];
                        data.type=1;
                        $pop.find('.jbox-content').html(template('docCreateTemp',data));
                        var docData = {color:['#fde101', '#1ff4be', '#c4572e'],total:data.pieChart.rate,center:["50%","50%"],data:data.pieChart.dataList}
                        charts.pieChart('docChart',true,docData);
                    }
                });
            })
            //脱贫情况
            $("#openTuopin").on("click", function () {
                var $pop = api.openPopWindow("脱贫情况");
               /* var $pop = $.jBox('', {title: "脱贫情况", buttons: {}, border: 0, opacity: 0.4});
                document.getElementsByTagName('body')[0].style.padding="0";
                var title = document.getElementsByClassName("jbox-title")[0];
                title.style.width ="96%";*/
                $.getJSON("../js/json/fiveGroup/overcomePoverty.json",function(res){
                    if(res){
                        $pop.find('.jbox-content').html(template('tuopinTemp',{}));
                        var townNames=[],andPoor=[],complete=[];
                        res.forEach(function(item){
                            townNames.push(item.townName);
                            andPoor.push(item.andPoor);
                            complete.push(item.completionHouses);
                        })
                        var docData = {townNames:townNames,andPoor:andPoor,complete:complete}
                        chart.poorChart("poorChart",docData);
                    }
                });
            })
            //劳动力情况
            $("#laborCondition").on("click", function () {
                var $pop = api.openPopWindow("劳动力情况");
                /*var $pop = $.jBox('', {title: "劳动力情况", buttons: {}, border: 0, opacity: 0.4});
                document.getElementsByTagName('body')[0].style.padding="0";
                var title = document.getElementsByClassName("jbox-title")[0];
                title.style.width ="96%";*/
                $.getJSON("../js/json/fiveGroup/labor.json",function(res){
                    if(res&&res[area]){
                        var data = res[area];
                        data.type=1;
                        $pop.find('.jbox-content').html(template('laborTemp',data));
                        var docData = {color:["#f84c24","#fde101","#83d130","#0786ef"],data:data.dataList}
                        charts.labelPie('laborWindowChart',docData)
                    }
                });
                /*var box=document.getElementById("jbox");
                 box.style.top = "3vw";*/
            })
            //诊断情况 与建档情况公用一个模板
            $("#diagnoseCondition").on("click", function () {
                var $pop = api.openPopWindow("诊断情况");
                /*var $pop=$.jBox('', {title: "诊断情况", buttons: {}, border: 0, opacity: 0.4});
                document.getElementsByTagName('body')[0].style.padding="0";
                var title = document.getElementsByClassName("jbox-title")[0];
                title.style.width ="96%";*/
                $.getJSON("../js/json/fiveGroup/diagnose.json",function(res){
                    if(res&&res[area]){
                        var data = res[area];
                        data.type=3
                        $pop.find('.jbox-content').html(template('docCreateTemp',data));
                        var docData = {color:['#fde101', '#1ff4be', '#c4572e'],total:data.pieChart.rate,center:["50%","50%"],data:data.pieChart.dataList}
                        charts.pieChart('docChart',true,docData)
                    }
                });

                /*var box=document.getElementById("jbox");
                 box.style.top = "3vw";*/
            })
            //身体健康状况 与劳动力情况公用一个模板
            $("#healthCondition").on("click", function () {
                var $pop = api.openPopWindow("身体健康情况");
                /*var $pop = $.jBox('', {title: "身体健康情况", buttons: {}, border: 0, opacity: 0.4});
                document.getElementsByTagName('body')[0].style.padding="0";
                var title = document.getElementsByClassName("jbox-title")[0];
                title.style.width ="96%";*/
                $.getJSON("../js/json/fiveGroup/health.json",function(res){
                    if(res&&res[area]){
                        var data = res[area];
                        data.type=2
                        $pop.find('.jbox-content').html(template('laborTemp',data));
                        var docData = {color:["#f84c24","#fde101","#83d130","#0786ef"],data:data.dataList}
                        charts.labelPie('laborWindowChart',docData)
                    }
                });
                /*var box=document.getElementById("jbox");
                 box.style.top = "3vw";*/
            })
            //签约情况 与建档情况公用一个模板     --------------暂时这么写，后续提取公共部分--------------
            $("#signCondition").on("click", function () {
                var $pop = api.openPopWindow("签约情况");
                /*var $pop = $.jBox('', {title: "签约情况", buttons: {}, border: 0, opacity: 0.4});
                document.getElementsByTagName('body')[0].style.padding="0";
                var title = document.getElementsByClassName("jbox-title")[0];
                title.style.width ="96%";*/
                $.getJSON("../js/json/fiveGroup/sign.json",function(res){
                    if(res&&res[area]){
                        var data = res[area];
                        data.type=2
                        $pop.find('.jbox-content').html(template('docCreateTemp',data));
                        var docData = {color:['#fde101', '#1ff4be', '#c4572e'],total:data.pieChart.rate,center:["50%","50%"],data:data.pieChart.dataList}
                        charts.pieChart('docChart',true,docData)
                    }
                });
                /*var box=document.getElementById("jbox");
                 box.style.top = "3vw";*/
            })
            //个人中心
            /*$("#openPerinfo").on("click", function () {
                $.jBox('', {title: "李茜茜", buttons: {}, border: 0, opacity: 0.4});
                document.getElementsByTagName('body')[0].style.padding="0";
                // $.jBox("iframe:../html/perContent.html", {title: "李茜茜", buttons: {}, border: 0, opacity: 0.2})
                //设置弹窗top值
                var box = document.getElementById("jbox");
                var title = document.getElementsByClassName("jbox-title")[0];
                box.style.top = "2.6vw";
                title.style.textAlign ="left";
                var html = template('personalTemp',{});
                document.getElementsByClassName('jbox-content')[0].innerHTML = html;
            })*/
            //村贫困家庭表单
            $("#openPoorInfo").on("click", function () {
                $.jBox('', {title: "", buttons: {}, border: 0, opacity: 0.4});
                document.getElementsByTagName('body')[0].style.padding="0";
                // $.jBox("iframe:../html/perContent.html", {title: "李茜茜", buttons: {}, border: 0, opacity: 0.2})
                //设置弹窗top值
                var box = document.getElementById("jbox");
                var title = document.getElementsByClassName("jbox-title")[0];
                box.style.top = "2.6vw";
                title.style.textAlign ="left";
                var html = template('personalTemp',{});
                document.getElementsByClassName('jbox-content')[0].innerHTML = html;
            })
        },
        'getPoorFamilyLeft': function(switchFlag){//贫困家庭左侧
            $.getJSON("../js/json/povertyFamily/poorFamily.json",function(data){
                data["huorren"] = switchFlag || 1;
                $('#leftSide').html(template('povertyLeftSideTemp', data));
            });
            //绑定左侧 人/户 切换点击事件
            $(".switch-head").on("click","span", function(){
                var activeBool = $(this).hasClass("span-active");
                if(!activeBool){
                    // $(this).addClass("span-active");
                    // $(this).siblings("span").removeClass("span-active")
                    var text = $(this).text();
                    // var obj = $(".section-body table thead tr").children();
                    if(text == "户"){
                        api.getPoorFamilyLeft(1);
                    }else{
                        api.getPoorFamilyLeft(2);
                    }
                }

            });
        },
        'getDisease': function(){
            $("#leftTabs").removeClass("hide");
            // $("#leftOperation").addClass("hide");
            // $("#sevenStepsTab").addClass("hide");
            $("#leftTabs").find("span.disease").addClass("active").siblings().removeClass("active")

            //右侧--------------------start
            //右侧--------------------start
            var data={
                disease:[
                    {name:"高血压",percent:"16%"},
                    {name:"脑血管病",percent:"8%"},
                    {name:"糖尿病",percent:"6%"},
                    {name:"冠心病",percent:"5%"},
                    {name:"脑梗",percent:"3%"},
                    {name:"布病",percent:"2%"},
                    {name:"类风湿性关节炎",percent:"2%"},
                    {name:"关节病",percent:"2%"},
                    {name:"胆囊炎",percent:"1%"},
                    {name:"心肌病",percent:"1%"},
                    {name:"肺结核",percent:"1%"},
                    {name:"腰间盘突出",percent:"1%"}
                ],

            };
            $('#rightSide').html(template('povertyRightSideTemp_disease', data));
            var diseaseStructure = {
                legend:["高血压","脑血管病","糖尿病","冠心病","脑梗","布病","类风湿性关节炎","关节病","胆囊炎","心肌病","肺结核","腰间盘突出","其他"],
                color:['#abfb06','#1ff4be','#c4572e','#387b14','#cb4345','#a96969','#40bfec','#c73983','#0786ef','#fde101'],
                data:[
                    {value:532, name:'高血压'},
                    {value:275, name:'脑血管病'},
                    {value:191, name:'糖尿病'},
                    {value:164, name:'冠心病'},
                    {value:117, name:'脑梗'},
                    {value:69, name:'布病'},
                    {value:63, name:'类风湿性关节炎'},
                    {value:57, name:'关节病'},
                    {value:46, name:'胆囊炎'},
                    {value:43,name:"心肌病"},
                    {value:43,name:"肺结核"},
                    {value:36,name:"腰间盘突出"},
                    {value:1720,name:"其他"}
                ],
                total:"3356"
            }
            charts.pieChart("diseaseStructureChart",true,diseaseStructure);
            var diseaseIncidence = {
                color:['#ff5232','#1996e6'],
                data:[{value:3356, name:'发生',
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: "{d}%",
                            textStyle: {
                                fontSize: '11',
                                fontWeight: 'lighter',
                                color: '#fff'
                            }
                        }
                    }
                },
                    {value:324444, name:'未发生'}],
                radius: ['50%', '70%'],
                center:["50%","50%"]
            };
            charts.pieChart("diseaseIncidenceChart",false,diseaseIncidence)
            //右侧--------------------end

            //左侧--------------------start
            api.getPoorFamilyLeft();
            /*$.getJSON("../js/json/povertyFamily/poorFamily.json",function(data){
                data["huorren"] = switchFlag || 1;
                $('#leftSide').html(template('povertyLeftSideTemp', data));
            });*/


            $(".progressLi").each(function(){
                var percent = $(this).find(".percent").text();
                progressBar.generate($(this),percent);
            })
            //左侧--------------------end

            //底部--------------------start
            $.getJSON("../js/json/fiveGroup/helpDynamic.json",function(res){
                var data={};
                data.list = res.povertyNews["moqi"];
                $('.bottom').html(template('helpDynamicTemp', data));
            });
            //家医签约按钮点击事件
            $(".bottom-head").on("click",function(){
                var $this = $(this).siblings(".bottom-content");
                $this.slideToggle(function(){
                    var showBool = $this.is(":visible");
                    if(!showBool&&window.timeOut){
                        clearTimeout(timeOut);
                    }else{
                        api.slide("slideBox","box-wrapper");
                        // chart.barChart("doctorSign");
                    }
                });
            });
            //底部--------------------end

        },//大病结构方法
        'getEducation':function(){
            $.getJSON("../js/json/povertyFamily/education.json",function(data){
                $('#rightSide').html(template('povertyRightSideTemp_education', data[area]));
                var eduData = {
                    legend:['学龄前儿童', '小学', '初中', '高中', '大专及以上', '文盲及半文盲'],
                    color:['#fde101', '#1ff4be', '#c4572e', '#387b14', '#cb4345', '#a96969', '#40bfec', '#c73983', '#0786ef'],
                    data:[
                        {value: data[area].numberOfPreschoolChildren, name: '学龄前儿童'},
                        {value: data[area].numberOfPrimarySchool, name: '小学'},
                        {value: data[area].numberOfJuniorMiddleSchool, name: '初中'},
                        {value: data[area].numberOfHighSchool, name: '高中'},
                        {value: data[area].numberOfCollegeDegreeOrAbove, name: '大专及以上'},
                        {value: data[area].numberOfIlliteracy, name: '文盲及半文盲'}
                    ]
                }
                charts.fullPieChart("educationStructureChart",eduData)
            });

        },
        'getSex':function(){
            $.getJSON("../js/json/povertyFamily/sex.json",function(data){
                if(data){
                    var sexData = data.povertyStructure[area];
                }
                sexData.numberOfMen = (parseInt(sexData.poorCount) - parseInt(sexData.numberOfWomen)) + "";
                $('#rightSide').html(template('povertyRightSideTemp_population',sexData));
                maleChartData={
                    color: ['#c2ff42', '#1996e6'],
                    data:[
                        {
                            value: (parseInt(sexData.poorCount) - sexData.numberOfWomen),
                            name: '男性',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'center',
                                    formatter: "{d}%",
                                    textStyle: {
                                        fontSize: '11',
                                        fontWeight: 'lighter',
                                        color: '#fff'
                                    }
                                }
                            }
                        },
                        {value: sexData.numberOfWomen, name: '女性'}

                    ],
                    center: ["50%", "50%"],
                    radius: ['50%', '70%']
                }
                charts.pieChart("maleChart",false,maleChartData)
                femaleChartData={
                    color: ['#fe5b3c', '#1996e6'],
                    data:[
                        {
                            value: sexData.numberOfWomen,
                            name: '女性',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'center',
                                    formatter: "{d}%",
                                    textStyle: {
                                        fontSize: '11',
                                        fontWeight: 'lighter',
                                        color: '#fff'
                                    }
                                }
                            }
                        },
                        {value: (parseInt(sexData.poorCount) - sexData.numberOfWomen), name: '男性'}

                    ],
                    center: ["50%", "50%"],
                    radius: ['50%', '70%']
                }
                charts.pieChart("femaleChart",false,femaleChartData)

            })
        },
        'getPoverty':function(type){
            $.getJSON("../js/json/povertyFamily/poorFamilyFrame.json",function(data){
                if(data&&data.povertyStructure) {
                    var poverty = data.povertyStructure;
                    poverty[area].type = type;
                    $('#rightSide').html(template('povertyRightSideTemp_poverty', poverty[area]));
                    charts.labelPie("povertyStructureChart",{
                        color:['#fde101', '#1ff4be', '#c4572e'],
                        data:[
                            {value:type==1?poverty[area].generalPovertyHouseholds:poverty[area].generalPovertyPopulation,name:"一般贫困户"},
                            {value:type==1?poverty[area].DBPovertyHouseholds:poverty[area].DBPovertyPopulation,name:"低保贫困户"},
                            {value:type==1?poverty[area].WBPovertyHouseholds:poverty[area].WBPovertyPopulation,name:"五保贫困户"}
                        ]
                    });
                }
            });
        },
        'getDoctorSign':function(type){
            $.getJSON("../js/json/homePage/doctorSign.json",function(data){
                if(data) {
                    var dataObj = data[type];
                    var townArr = [];
                    var dataArr = [];
                    for(p in dataObj) {
                        townArr.push(p);
                        dataArr.push(dataObj[p]);
                    }
                    chart.barChart("doctorSign",townArr,dataArr);
                }
            })
        },
        /**
         * 轮播图方法
         * @param id 容器id
         * @param wrapper 滚动元素父标签
         */
        'slide':function(id,wrapper,time){
            var timeGap = time || 2200;
            var outerBox = $("#"+id);
            var innerBoxArr = outerBox.children("."+wrapper).children();
            var leng = innerBoxArr.length;
            // outerBox.children().animate({left:0},"fast")
            if(leng<3)return;
            // var i=1;
            var leftFlag = 0;
            var perWidth = innerBoxArr[0].offsetWidth;
            var distance = perWidth/timeGap;
            var setLeft = function(arr){
                /*if(leftFlag > perWidth*(leng-1)) {
                 leftFlag = 0;
                 outerBox.children().animate({left: "0px"});
                 };*/
                leftFlag += distance;
                leftFlagPx = "-" + leftFlag + "px";
                outerBox.children().css({left: leftFlagPx});
                //如果第一个模块滚出视线，则将其移动到该列末尾
                if(leftFlag > perWidth){
                    var arr = Array.prototype.shift.call(innerBoxArr);
                    var first = outerBox.children().children().eq(0)
                    first.remove();
                    outerBox.children().append(first);
                    innerBoxArr.push(arr);
                    leftFlag = 0;
                }
            } 
            window.timeOut = setInterval(setLeft.bind(null, innerBoxArr), 10);
        },
        'openPopWindow': function(title){
            var $pop = $.jBox('', {title: title, buttons: {}, border: 0, opacity: 0.4});
            document.getElementsByTagName('body')[0].style.padding="0";
            var title = document.getElementsByClassName("jbox-title")[0];
            title.style.width ="96%";
            return $pop;
        }

    };
    $(function(){
        //加载倒计时
        countDown.countDown("2018/1/1");
        //刷新时触发首页点击事件
        api.getHomePage(area);
        //绑定右上角区域切换事件
        $("#areaSelectInHeader").on("change",function () {
            var town = $(this).val();
            area = town;
            mapApi.showMap(town);
            mapApi.getData();
        })
        //切换头部标签
        $("#tab").on("click","li", function(){

            //--- 暂时代码 完成后删除 作用：禁止点击 "五个一批"和「六个精准」 by- xld
                if ($(this).hasClass('fiveInOne')||$(this).hasClass('sixExactness')) {
                    return;
                }
            //---暂时代码 
            var activeBool = $(this).hasClass("active");
            if(!activeBool){
                $("#rightSide").empty();
                $(this).addClass("active");
                $(this).siblings("li").removeClass("active")
            }
            if($(this).hasClass("homepage")){//点击首页按钮
                api.getHomePage(area);

            }else if($(this).hasClass("poverty")){//点击贫困家庭按钮
                    api.getDisease();

            }else if($(this).hasClass("fivePeople")){//---------------点击五人小组按钮----------------
                api.getFiveGroup(area);
            }else{
                $("#leftTabs").addClass("hide");

            }
        });
        //贫困家庭右侧栏tab切换
        $("#leftTabs").on("click","span",function(){
            if(!$(this).hasClass("active")){
                $("#rightSide").empty();
                $(this).addClass("active").siblings().removeClass("active");

            }else{
                return;
            }
            if($(this).hasClass("disease")){//大病结构
                api.getDisease();
            }else if($(this).hasClass("education")){//学历结构
                api.getEducation()
            }else if($(this).hasClass("sex")){//性别结构
                api.getSex()
            }else if($(this).hasClass("poverty")){//贫困结构
                api.getPoverty(2);
            }
        });

        $("#rightSide").on("click","#povertyStructure span",function(){
            if(!$(this).hasClass("active")&&$(this).text()=="人"){
                $(this).addClass("active").siblings().removeClass("active");
                api.getPoverty(2)
                //ajax
            }else if(!$(this).hasClass("active")&&$(this).text()=="户"){
                $(this).addClass("active").siblings().removeClass("active");
                $("#povertyTypeRank").find("thead th:eq(1)").text("户数")
                api.getPoverty(1)
            }
        });

        var height = $("header").height();
        var clientHeight = $(window).height();
        var margin = +$("#rightSide").css("margin-top").slice(0,-2);
        var sideHeight= clientHeight-height-margin;
        $("#rightSide,#leftSide").height(sideHeight-2);
    })



    //地图模块js ---------start----------

    var mapApi = {
            "oSvgBox": $("#svgBox"),
            "curr_svg": false, //当前显示地图对象
            "hoverLock": true, //hover事件开关；
            "curr_path_id": false, //当前选中path对象id;
            "Next_map_name": null,
            "scrollX": document.documentElement.scrollLeft || document.body.scrollLeft,
            "scrollY": document.documentElement.scrollTop || document.body.scrollTop,
            "dis_w": 90, //鼠标坐标偏移量
            "dis_h": 195, //
            "$cheangeMap": $("#changeMap"), //进入地图按钮
            "inColor":"#1d4b99",  //地图选中区域颜色
            "outColor":"#1b2769",  //地图可点击区域默认颜色 
            
            "init": function() {
                mapApi.getMap($("#moqi"));
            },
            "getMap": function(oSvg) {//获取县地图

                    mapApi.curr_svg = oSvg;
                    if (mapApi.curr_svg) {
                        // console.log(mapType)
                        mapApi.oSvgBox.on("click", function(event) {
                            event.preventDefault();
                            //oSvg.find(".validMap").css("fill", mapApi.outColor);
                            $(".map-links").removeClass("show");
                            $(".map-tips").removeClass("show");
                            mapApi.hoverLock = true;
                            var mapType = mapApi.curr_svg.attr("id");
                            if(mapApi.curr_path_id&&mapType=="moqi"){
                                area = "moqi";
                                mapApi.getData();
                            }
                            mapApi.curr_path_id = false;

                            /* Act on the event */
                        });
                    }
                    oSvg.on("mouseover", ".validMap", function(event) {
                        if (mapApi.hoverLock) {

                            //oSvg.find(".validMap").css("fill", mapApi.outColor);
                            //this.style.fill = mapApi.inColor;

                            var x = event.pageX || event.clientX + mapApi.scrollX;
                            var y = event.pageY || event.clientY + mapApi.scrollY;
                            //加载hover模板
                            $.getJSON("../js/json/map_hover.json",function(res){
                                var target = event.target.id;
                                var data = res.povertyStructure[target];
                                $(".map-tips").html(template("mapHoverTemp", data)).addClass("show")
                                    .css({
                                        "left": x - mapApi.dis_w,
                                        "top": y - mapApi.dis_h,
                                    });
                            })
                            //console.log($(this).attr("id"));
                        }
                    });

                    oSvg.on("click", ".validMap", function(event) {
                        event.stopPropagation();
                        if (mapApi.curr_path_id) {
                            //如果有当前id 已选中某镇
                            if (mapApi.curr_path_id != this.id) {
                                //oSvg.find(".validMap").css("fill", mapApi.outColor);
                                mapApi.curr_path_id = false;
                                area = "moqi";
                                mapApi.getData();
                                $(".map-links").removeClass("show");
                                mapApi.hoverLock = true;
                                return false;
                            }
                        } else {
                            //如果没有当前id;未选中镇
                            mapApi.hoverLock = false;
                            //oSvg.find(".validMap").css("fill", mapApi.outColor);

                            //this.style.fill = mapApi.inColor;
                            var x = event.pageX || event.clientX + mapApi.scrollX;
                            var y = event.pageY || event.clientY + mapApi.scrollY;
                            mapApi.curr_path_id = this.id;

                            // console.log(this.id);
                            $(".map-tips").removeClass("show");
                            $.getJSON("../js/json/map_hover.json", function(res){
                                var target = event.target.id;
                                var data = res.povertyStructure[target];
                                $(".map-links").html(template("mapClickTemp",data)).css({
                                    "left": x - mapApi.dis_w,
                                    "top": y - mapApi.dis_h/1.5,
                                }).addClass("show");

                                //帮进入下一级地图
                                $("#changeMap").on('click', function(event){
                                    event.stopPropagation();
                                    event.preventDefault();
                                    mapApi.curr_svg.removeClass('show');
                                    $(".map-links").removeClass('show');
                                    var _id = '#' + mapApi.curr_path_id+'Svg';
                                    $(_id).addClass('show');
                                    mapApi.getSubMap($(_id));
                                    mapApi.hoverLock = true;
                                    mapApi.curr_path_id=false;
                                });
                            })

                        }
                        //改变当前选择区域
                        area = mapApi.curr_path_id;
                        // var txt = $("#tab div.active").text();
                        $("#areaSelectInHeader").val(area);
                        mapApi.getData();
                        //打开督导组成员弹窗
                        $(".links-list li").eq(1).unbind("click").on("click", function() {
                            $.getJSON("../js/json/superVisorGroup.json",function(res){
                                var data = res[area];
                                var membersTemp = template("members", data);
                                $.jBox(membersTemp, { title: "督导组成员", buttons: {}, border: 0, opacity: 0.4 });
                            })
                            document.getElementsByTagName("body")[0].style.padding = "0";
                            var title = document.getElementsByClassName("jbox-title")[0];
                            title.style.width = "96%";
                            $(".select-switch").on("change", "select", function() {
                                var selected = $(this).children("option:selected").val();
                                var membersTemp = template("members", { data: [{ "duty": "组长", "name": "李骄", "sex": "女", "nation": "汉族", "politic": "党员", "office": "北京", "contect": "13711111111", "remarks": "没有备注" }, { "duty": "副组长", "name": "李天骄", "sex": "女", "nation": "汉族", "politic": "党员", "office": "北京", "contect": "13711111111", "remarks": "没有备注" }] });
                                $("#jbox-content").find("table").remove().append(membersTemp);

                            });
                        });

                    });

                },//getMap
                //     /**
                //      * 地图和顶部tab结合查询数据
                //      * @param type 所选中的tab
                //      */
            "getData":function () {
                        var txt = $("#tab div.active").text();
                        switch (txt) {
                            case "首页":
                                api.getHomePage();
                                break;
                            case "五人小组":
                                api.getFiveGroup();
                                break;
                            case "贫困家庭":
                                api.getDisease();
                                break;
                        }
                    },

            "getSubMap" :function(oSvg) {
                    mapApi.curr_svg = oSvg;
                    if (mapApi.curr_svg) {
                        //console.log(mapApi.curr_svg.attr("id"))
                        mapApi.oSvgBox.on("click", function(event) {
                            event.preventDefault();
                            //oSvg.find(".validMap").css("fill", mapApi.outColor);
                            $(".map-links").removeClass("show");
                            $(".map-tips").removeClass("show");
                            mapApi.hoverLock = true;
                            mapApi.curr_path_id = false;

                            /* Act on the event */
                        });
                    }

                    oSvg.on("mouseover", '.validMap', function(event) {

                        if (mapApi.hoverLock) {
                            //$(this).addClass('map-hover');
                            //oSvg.find('.validMap').css('fill', mapApi.outColor);
                            //this.style.fill = mapApi.inColor;
                            var x = event.pageX || event.clientX + mapApi.scrollX;
                            var y = event.pageY || event.clientY + mapApi.scrollY;
                            $(".map-tips").addClass('show');
                            //console.log($(this).attr('id'));
                            $(".map-tips").css({
                                "left": x - mapApi.dis_w,
                                "top": y - mapApi.dis_h
                            });
                        }
                    });

                    oSvg.on('click', '.validMap', function(event) {
                        event.stopPropagation();
                        if (mapApi.curr_path_id) {
                            //如果有当前id 已选中某镇
                            if (mapApi.curr_path_id != this.id) {
                                //oSvg.find('.validMap').css('fill', mapApi.outColor);
                                mapApi.curr_path_id = false;
                                $(".map-tips").removeClass('show');
                                mapApi.hoverLock = true;
                                //alert('饮茶美好列表');
                            }
                        } else {
                            //如果没有当前id;未选中镇
                            mapApi.hoverLock = false;
                            //oSvg.find('.validMap').css('fill', mapApi.outColor);
                            //this.style.fill = mapApi.inColor;
                            var x = event.pageX || event.clientX + mapApi.scrollX;
                            var y = event.pageY || event.clientY + mapApi.scrollY;
                            mapApi.curr_path_id = this.id;

                            //村贫困家庭表单
                            // $.jBox('', { title: "", buttons: {}, border: 0, opacity: 0.4 });
                            // $.getJSON("../js/json/map_peopleList.json",function(res){
                                $.getJSON("../js/json/mapPeopleDetail.json",function(res){
                                    var data={};
                                    data.data = res[area][mapApi.curr_path_id];
                                    var totalList = data.list;
                                    var membersTemp = template("villageTemp", data);
                                    $.jBox(membersTemp, { title: "", buttons: {}, border: 0, opacity: 0.4 });
                                    document.getElementsByTagName('body')[0].style.padding = "0";
                                    // $.jBox("iframe:../html/perContent.html", {title: "李茜茜", buttons: {}, border: 0, opacity: 0.2})
                                    //设置弹窗top值

                                    //家庭列表绑定点击事件
                                    $(".village tbody").on("click","tr",function() {
                                        var name = $(this).find("td:eq(1)").text();
                                        var family = data.data.filter(function(a) {
                                            return a.name == name;
                                        });

                                        var $pop = $.jBox('', { title: name, buttons: {}, border: 0, opacity: 0.4 });
                                        document.getElementsByTagName('body')[0].style.padding = "0";
                                        $pop.find("#jbox").css("top", "2.6vw");
                                        var html = template('personalTemp',family[0] );
                                        document.getElementsByClassName('jbox-content')[1].innerHTML = html;
                                    });
                            })

                        }

                    });


                }, //getSubmap
                //切换地图公共方法 mapApi.showMap
                //传入地图 id
            "showMap":function(mapid){
                    if(mapid=="moqi"){
                        var idStr='#'+mapid;
                        $('svg').removeClass('show');
                        $(idStr).addClass('show');
                        $('.map-links').removeClass('show');
                        $('.map-tips').removeClass('show');
                        //mapApi.curr_svg.find(".validMap").css("fill", mapApi.outColor);
                        mapApi.getMap($(idStr));
                        mapApi.hoverLock = true;
                        mapApi.curr_path_id=false;
                        return;
                    }
                    var idStr='#'+mapid+'Svg';
                    $('svg').removeClass('show');
                    $('.map-links').removeClass('show');
                    $('.map-tips').removeClass('show');
                    //mapApi.curr_svg.find(".validMap").css("fill", mapApi.outColor);
                    $(idStr).addClass('show');
                    mapApi.getSubMap($(idStr));
                    mapApi.hoverLock = true;
                    mapApi.curr_path_id=false;
                },

        }; //mapApi
        //初始化地图方法；
        mapApi.init();

    
    //地图模块js ---------end----------

});