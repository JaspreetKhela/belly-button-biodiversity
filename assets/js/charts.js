// _____

// Function definitions
// _____

// Define a function to intialize the horizontal bar chart
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("assets/data/samples.json").then((data) => {
        var sampleNames = data.names;

        // For each sample name, append an option within the sample HTML element
        sampleNames.forEach((sample) => {
            // Create an option HTML element, and add the sample name as its text and value attribute's value
            selector.append("option").text(sample).property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];

        // Build the demographics panel
        buildMetadata(firstSample);

        // Build the horizontal bar chart for the selected patient's top 10 navel bacteria in descending order
        buildCharts(firstSample);
    });
}

// Define the select HTML element's optionChanged attribute's value
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    // Build the demographics panel
    buildMetadata(newSample);

    // Build the horizontal bar chart for the selected patient's top 10 navel bacteria in descending order
    buildCharts(newSample);
}

// Define a function to build the demographics panel 
function buildMetadata(sample) {
    // Import the samples.json data
    d3.json("assets/data/samples.json").then((data) => {
        // Extract the metadata key's values from the imported JSON data
        var metadata = data.metadata;

        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

        // Save the patient information object that matches the sample id that was selected
        var result = resultArray[0];

        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// 1.1. Create the buildCharts function
function buildCharts(sample) {
    // 1.2. Use d3.json to load and retrieve the samples.json file 
    d3.json("assets/data/samples.json").then((data) => {
        // 1.3. Create a variable that holds the samples array
        var samplesRaw = data.samples;

        // 1.4. Create a variable that filters the samples for the object with the desired sample number
        var samples_array = samplesRaw.filter(sampleObj => sampleObj.id == sample);

        // 3.1. Create a variable that filters the metadata array for the object with the desired sample number
        var metadata = data.metadata;
        var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);

        //  1.5. Create a variable that holds the first sample in the array
        var samplesDetails = samples_array[0];
        //console.log(samplesDetails);

        //  3.2. Create a variable that holds the first sample in the metadata array
        var metadataDetails = metadataArray[0];
        // console.log(metadataDetails);

        // 1.6. Create variables that hold the otuIds, otuLabels, and sampleValues
        var otuIds = samplesDetails.otuIds;
        var otuLabels = samplesDetails.otuLabels;
        var sampleValues = samplesDetails.sampleValues;
        // console.log(otuIds);
        // console.log(otuLabels);
        // console.log(sampleValues);

        // 3.3. Create a variable that holds the washing frequency
        var washFreq = metadataDetails.wfreq;
        // console.log(washFreq);

        // _____

        // Bar chart
        // _____ 

        // 1.7. Create the yticks for the bar chart
        // Hint: Get the the top 10 otuIds and map them in descending order so the otuIds with the most bacteria are last. 
        var yticks = otuIds.slice(0, 10).map(x => "OTU " + x);
        //console.log(yticks);

        // 1.8. Create the trace for the bar chart
        var barData = [
            {
                y: yticks.reverse(),
                x: sampleValues.slice(0, 10).reverse(),
                text: otuLabels.slice(0, 10).reverse(),
                type: "bar",
                orientation: 'h',                
            }
        ];

        // 1.9. Create the layout for the bar chart
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",        
        };

        // 1.10. Use Plotly to plot the data with the layout
        Plotly.newPlot("bar", barData, barLayout);

        // _____

        // Bubble chart
        // _____

        // 2.1. Create the trace for the bubble chart
        var bubbleData = [{
            x: otuIds,
            y: sampleValues,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: sampleValues,
                colorscale: 'RdBu'
            },
            text: otuLabels
        }];

        // 2.2. Create the layout for the bubble chart
        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            xaxis: {title: {text: 'OTU ID'}},
            hovermode:'closest'
        };

        // 2.3. Use Plotly to plot the data with the layout
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

        // _____

        // Gauge chart
        // _____

        // 3.4. Create the trace for the gauge chart
        var gaugeData = [
            {
                // domain: { 
                //   x: [0, 10], y: [0, 10] },
                value: washFreq,
                title: {text: "scrubs per week", font: {size: 20}},
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: {color: "black"},
                    axis: {range: [null, 10]},
                    steps: [
                        {range: [0, 2], color: "red"},
                        {range: [2, 4], color: "orange"},
                        {range: [4, 6], color: "yellow"},
                        {range: [6, 8], color: "lightgreen"},
                        {range: [8, 10], color: "green"}
                    ],
                }
            }
        ];
        
        // 3.5. Create the layout for the gauge chart
        var gaugeLayout = { 
            width: 550, 
            height: 450,
            title: "Belly Button Washing Frequency",
            font: {size: 18, family: "Arial"}
        };

        // 3.6. Use Plotly to plot the gauge data and layout
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    });
}

// _____

// Script
// _____

// Initialize the dashboard
init();