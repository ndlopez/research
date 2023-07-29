/*
GOES 16 xrays w/lambda = [0.05,0.4] and [0.1,0.8] nm
E = h*c*lambda [~10^2eV]
E = {[248.137,31.01],[124.068,15.508]} 10^2eV
short primary, long secondary

Solar flare intensities cover a large range and are classified in terms of peak emission in the 0.1 - 0.8 nm spectral band (soft x-rays) of the NOAA/GOES XRS. The X-ray flux levels start with the “A” level (nominally starting at 10-8 W/m2). The next level, ten times higher, is the “B” level (>= 10-7 W/m2); followed by “C” flares (10-6 W/m2), “M” flares (10-5 W/m2), and finally “X” flares (10-4 W/m2).
ref scales https://www.d3indepth.com/scales/
https://observablehq.com/@d3/line-chart/2?intent=fork*/

const xrays_url = "https://services.swpc.noaa.gov/json/goes/secondary/xrays-3-day.json";
const container = document.getElementById("xrays-long");
const xraysTitle = document.createElement("p");
xraysTitle.innerHTML = 'The GOES X-ray plots shown here are used to track solar activity and solar flares. Data are courtesy of <a target="_blank" href="https://swpc.noaa.gov">SWPC, NOAA</a>';
container.appendChild(xraysTitle);
const leftDiv = document.createElement("div");
leftDiv.setAttribute("id","leftAxis");
leftDiv.setAttribute("class","column-left float-left");
const rightDiv = document.createElement("div");
rightDiv.setAttribute("id","rightAxis");
rightDiv.setAttribute("class","column-third float-left");
const middleDiv = document.createElement("div");
middleDiv.setAttribute("class","column-right float-left");
const outer_div = document.createElement("div");
outer_div.setAttribute("class","outer");
const inner_div = document.createElement("div");
inner_div.setAttribute("class","inner");
const main_div = document.createElement("div");
main_div.setAttribute("id","xrays_main");

inner_div.appendChild(main_div);
outer_div.appendChild(inner_div);
middleDiv.appendChild(outer_div);
container.appendChild(leftDiv);
container.appendChild(middleDiv);
container.appendChild(rightDiv);

// set the dimensions and margins of the graph
const xSize= 460,ySize = 450;
const margen = {top: 10, right: 10, bottom: 30, left: 35},
   w_plot = xSize - margen.left - margen.right,
   h_plot = ySize - margen.top - margen.bottom;

const svgLeft = d3.select("#leftAxis")
.append("svg").attr("width",36).attr("height",ySize)
.append("g")
.attr("transform","translate(" + 35 + "," + margin.top + ")");
// append the svg object to the body of the page
const svg_plot = d3.select("#xrays_main")
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
   // Add X axis --> it is a date format 
   // xValue = d3.utcParse("%Y-%m-%d %H:%M:%S")(d.time_tag);
   // d3.time.format("%Y-%m-%d %H:%M:%S").parse;
   data.forEach((d,i) => {
     if(i%2==0){
      // energy 0.05-0.4 nm
       d.date = dateParse(d.time_tag);
       // aux = d.flux * 1e+8;
       d.value = d.flux * 1e+8;// parseFloat(aux.toFixed(3));
     }else{
      // energy 0.1-0.8nm
      d.tag = dateParse(d.time_tag);
      // aux = d.flux * 1e+6;
      d.fluss = d.flux * 1e+8;//parseFloat(aux.toFixed(3));
    }
   });

   x_scale.domain(d3.extent(data,(d) => d.date));
   y_scale.domain([0.5,4e4]);//d3.max(data,(d) => d.fluss)
   
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
   
   svgLeft.append("g")
     .attr("class","xray_flux")
     .call(d3.axisLeft(y_scale));
});
