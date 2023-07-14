/*SILSO data: daily Sunspot number*/
const spots_url = "https://raw.githubusercontent.com/ndlopez/ndlopez.github.io/main/data/sunspot_number.csv";

const containDiv = document.getElementById("sunspots");
const spotTitle = document.createElement("p");
spotTitle.innerHTML = 'International sunspot number: daily observations since 2008-01-01 ~ 2023-06-30 (Solar cycles 24 and 25). Data are courtesy of <a target="_blank" href="https://sidc.be/silso/">SILSO data/image, Royal Observatory of Belgium, Brussels</a>';
containDiv.appendChild(spotTitle);
const centerDiv = document.createElement("div");
centerDiv.setAttribute("class","one-column float-left");
const outerDiv = document.createElement("div");
outerDiv.setAttribute("class","outer");
const innerDiv = document.createElement("div");
innerDiv.setAttribute("class","inner");
const mainDiv = document.createElement("div");
mainDiv.setAttribute("id","mainPlot");

innerDiv.appendChild(mainDiv);
outerDiv.appendChild(innerDiv);
centerDiv.appendChild(outerDiv);
containDiv.appendChild(centerDiv);
/*const plotCaption = document.createElement("p");
plotCaption.innerHTML = '';
containDiv.appendChild(plotCaption);*/

//containDiv.appendChild(leftDiv);
//containDiv.appendChild(rightDiv);
// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 30, left: 35},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#mainPlot").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

const dateParser = d3.timeParse("%Y-%m-%d");
const x = d3.scaleTime().range([ 0, width ]);
const y = d3.scaleLinear().range([ height, 0 ]);

d3.csv(spots_url,function(error,data){
  // console.log(data);
  if(error)throw error;
  data.forEach((d)=>{
    d.date = dateParser(d.date);
    d.value = +d.spotNum;
  });
  x.domain(d3.extent(data,(d)=> d.date ));
  y.domain([0,d3.max(data,(d)=> +d.value )]);

  svg.append("path")
      .datum(data)
      .attr("fill","none")
      .attr("stroke","#bed2e040")
      .attr("stroke-width",1.5)
      .attr("d",d3.line()
        .x((d)=> x(d.date))
        .y((d)=> y(d.value)));
  svg.append("g")
      .attr("class","date_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  svg.append("g").attr("class","spot_num").call(d3.axisLeft(y));
  // To help visibility
  svg.append("g").attr("transform","translate(" + width + "," + 0 + ")").attr("class","spot_num").call(d3.axisLeft(y));
  // smooth curve
  // Consider taking only the avg/month
  // sum/num_days_month = month value
  /*const smooth_curve = d3.line()
  .x((d)=> x(d.date))
  .y((d)=> y(d.value))
  .curve(d3.curveBundle.beta(0.5));
  svg.append("path")
  .attr("d",smooth_curve(data))
  .attr("fill","none")
  .attr("stroke","#ffeea6")
  .attr("stroke-dasharray","5,5");*/
});

function run_avg(data,steps){
  // data = [date,value]
  var avg_value = [], date_arr = [];
  var sum = 0;
  for (let idx = 0; idx < steps; idx++) {
    sum += data[1];
  }
  avg_value.push(sum);
  return {date_arr,avg_value};
}