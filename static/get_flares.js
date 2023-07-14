const flares_latest = "https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json";

latest_xrays();

async function latest_xrays(){
    const titles = ["current","begin","max","end"];
    const data = await get_noaa();
    const mainDiv = document.getElementById("latest_event");
    const myList = document.createElement("table");

    myList.setAttribute("id","myday");

    var texty = "<tr><th></th><th>time [UTC]</th><th>class</th></tr>";
    for(let idx =0;idx<4;idx++){
        var myStr = titles[idx] + "_time";
        if(idx == 0){
            myStr = "time_tag";
        }
        //console.log(myStr);
        texty += "<tr><td>" + titles[idx] + "</td><td>" + data[myStr] + "</td><td>";
        if(data[titles[idx]+'_class'] === null){
            data[titles[idx]+'_class'] = "---";
        }
        texty += data[titles[idx] + '_class'] + "</td></tr>";
    }
    //console.log(texty);
    myList.innerHTML = texty;
    mainDiv.appendChild(myList);
    const tab_caption = document.createElement("p");
    tab_caption.innerHTML = 'Data are courtesy of <a href="https://swpc.noaa.gov">NOAA/SWPC</a>';
    mainDiv.appendChild(tab_caption);
}
async function get_noaa(){
    const response = await fetch(flares_latest);
    const latest= await response.json();
    return latest[0];
}