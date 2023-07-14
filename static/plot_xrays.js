/*
GOES 16 xrays w/lambda = [0.05,0.4] and [0.1,0.8] nm
E = h*c*lambda [~10^2eV]
E = {[248.137,31.01],[124.068,15.508]} 10^2eV
ref scales https://www.d3indepth.com/scales/
https://observablehq.com/@d3/line-chart/2?intent=fork

*/
const xrays_url = "https://services.swpc.noaa.gov/json/goes/primary/xrays-3-day.json";
// set the dimensions and margins of the graph
const margen = {top: 10, right: 10, bottom: 30, left: 35},
   w_plot = 460 - margen.left - margen.right,
   h_plot = 450 - margen.top - margen.bottom;

// append the svg object to the body of the page
const svg_plot = d3.select("#xrays-long")
         .append("svg")
         .attr("width", w_plot + margen.left + margen.right)
         .attr("height", h_plot + margen.top + margen.bottom)
         .append("g")
         .attr("transform","translate(" + margen.left + "," + margen.top +")");

const dateParse = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
const x_scale = d3.scaleTime().range([ 0, w_plot]);
const y_scale = d3.scaleLog().range([ h_plot, 0]); // d3.scaleLinear().range([h_plot, 0]);

let aux = 0.0;
d3.json(xrays_url,
 function(err,data){
   if(err)throw err;
   // Add X axis --> it is a date format xValue = d3.utcParse("%Y-%m-%d %H:%M:%S")(d.time_tag);
   // d3.time.format("%Y-%m-%d %H:%M:%S").parse;
   data.forEach((d,i) => {
     if(i%2==0){
      // energy 0.05-0.4 nm
       d.date = dateParse(d.time_tag);
       aux = d.flux * 1e+8;
       d.value = parseFloat(aux.toFixed(3));
       //console.log(d.date,d.value);
     }else{
      // energy 0.1-0.8nm
      d.tag = dateParse(d.time_tag);
      aux = d.flux * 1e+8;
      d.fluss = parseFloat(aux.toFixed(3));
    }
   });

   x_scale.domain(d3.extent(data,(d) => d.date));
   y_scale.domain([2,d3.max(data,(d) => d.fluss)]);
   
   // Plot line
   /*svg_plot.append("path")
     .datum(data)
     .attr("fill","none")
     .attr("stroke","white")
     .attr("stroke-width",1.5)
     .attr("d",d3.line()
       .x_scale((d,i)=>{ if(i%2==0){//console.log(x(d.date));
         x_scale(d.date);}})
       .y((d,i)=>{ if(i%2==0){console.log(y(d.value));
         y(d.value);}}));*/
   // Scatter linear plot
   svg_plot.append("g")
     .selectAll("squares")
     .data(data).enter()
     .append("rect")
     .attr("x",(d,i)=>{if(i%2==0){return x_scale(d.date);}})
     .attr("y",(d,i)=>{if(i%2==0){return y_scale(d.value);}})
     .attr("width","2")
     .attr("height","2")
     .style("fill","#bed2e0");
     
  svg_plot.append("g")
     .selectAll("squares")
     .data(data).enter()
     .append("rect")
     .attr("x",(d,i)=>{if(i%2!=0){return x_scale(d.tag);}})
     .attr("y",(d,i)=>{if(i%2!=0){return y_scale(d.fluss);}})
     .attr("width","2")
     .attr("height","2")
     .style("fill","#cc274c");

   svg_plot.append("g")
     .attr("class","date_axis")
     .attr("transform", "translate(0," + h_plot + ")")
     .call(d3.axisBottom(x_scale));
   
   svg_plot.append("g")
     .attr("class","spot_num")
     .call(d3.axisLeft(y_scale));
});