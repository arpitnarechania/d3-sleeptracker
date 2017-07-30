function renderArc(config){

    var svg = d3.select(config.dom_element).append("svg")
    .style("width", config.width + config.margin.left + config.margin.right)
    .style("height", config.height + config.margin.top + config.margin.bottom);

    var degreeScale = d3.scale.linear().range([0,360]);
    var data=[];

    var stateOne = dataset[0]["screen_state"] == "Y" ? "N" : "Y";
    var stateTwo;
    var timeOne
    var timeOneDegree;
    var innerRadius = 50;

    var timeTwo;
    var timeTwoDegree;

    var start_date;
    var end_date;
    var barThickness = 8;

    var millis_in_1_day = 3600*24*1000;

    for(var j=0;j<30;j++){
        start_date = 1496275200000 + j*millis_in_1_day;
        end_date = start_date + millis_in_1_day;

        filtered_dataset = dataset.filter(function(item){
            return item["activity_at"] <= end_date && item["activity_at"] >= start_date;
        });

        stateOne = filtered_dataset[0]["screen_state"] == "Y" ? "N" : "Y";
        timeOne = filtered_dataset[0]["activity_at"];
        timeOneDegree = degreeScale(timeOne);

        degreeScale.domain([start_date,end_date]);
        data.push([0,timeOneDegree,stateOne,innerRadius]);

        for(var i=0; i<filtered_dataset.length-1;i++){
            timeTwo = filtered_dataset[i]["activity_at"];
            stateTwo = filtered_dataset[i]["screen_state"];

            if(stateTwo==stateOne){
                continue;
            }

            timeOneDegree = degreeScale(timeOne);
            timeTwoDegree = degreeScale(timeTwo);

            data.push([timeOneDegree,timeTwoDegree,stateOne,innerRadius]);

            timeOne = timeTwo;
            stateOne = stateTwo;
        }

//      var finalState = stateOne == "Y" ? "N" : "Y";
        var finalState = stateOne;
        data.push([timeTwoDegree,360,finalState,innerRadius]);

        innerRadius += barThickness;
    }

    var arc = d3.svg.arc()
        .innerRadius(function(d){return d[3]})
        .outerRadius(function(d){return d[3]+barThickness})
        .startAngle(function(d){return toRadians(d[0])})
        .endAngle(function(d){return toRadians(d[1])})

    svg.selectAll(".arc").data(data).enter().append("path")
        .attr("class", "arc")
        .attr("transform","translate(" + (config.width + config.margin.left + config.margin.right)/2 + "," + (config.height + config.margin.top + config.margin.bottom)/2 + ")")
        .attr("d", arc)
        .attr("shape-rendering","geometricPrecision")
        .style("fill",function(d){
            return d[2]=='Y' ? "red" : "black";
        });

    function toRadians(degs){
        return Math.PI*degs/180;
    }
}