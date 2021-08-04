function init() {

  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    var nameOfSample = data.names;
    nameOfSample.forEach((item) => {
      selector
        .append("option")
        .text(item)
        .property("value", item);
    });

    var first = nameOfSample[0];
    buildCharts(first);
    buildMetadata(first);
  });
}

init();

function optionChanged(newSamp) {
  buildMetadata(newSamp);
  buildCharts(newSamp);
  
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(obj => obj.id == sample);
    var result = resultArray[0];

    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


function buildCharts(sample) {
 
  d3.json("samples.json").then((data) => {
    
    let samples = data.samples;
    let resultArr = samples.filter(item => item.id == sample);
    let firstSample = resultArr[0];
    let ids = firstSample.otu_ids;
    let labels = firstSample.otu_labels.slice(0, 10).reverse();
    let values = firstSample.sample_values.slice(0,10).reverse();
    let bValues = firstSample.sample_values;
    let bLabels = firstSample.otu_labels;
    let yticks = ids.map(s => "OTU " + s).slice(0,10).reverse();

    let barData = [{
      x: values,
      y: yticks,
      type: "bar",
      text: labels, 
      orientation: "h" 
    }];
    
    let barChartLayout = {
     title: "Top Ten Cultures Found"
    };
    Plotly.newPlot("bar", barData, barChartLayout);


    let bData = [{
      text: bLabels,
      x: ids,
      y: bValues,
      mode: "markers",
       marker: {
         color: bValues,
         size: bValues,
         colorscale: "Portland" 
       }
    }];
  
    let bLayout = {
        title: "Bacteria",
        xaxis: {title: "OTU ID"},
        hovermode: "closest"
    };
  
    Plotly.newPlot("bubble", bData, bLayout)

    let meta = data.metadata;
    let gauge = meta.filter(item => item.id == sample);  
    let gaugeResult = gauge[0];
    let freq = gaugeResult.wfreq;

    let gData = [{
      value: freq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
      gauge: {
        axis: {range: [null,10], dtick: "2"},
        bar: {color: "black"},
        steps:[
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
        dtick: 2
      }
    }];
    
    let layout = { 
     automargin: true
    };


    Plotly.newPlot("gauge", gData, layout)
  });
}
