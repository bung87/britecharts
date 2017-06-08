'use strict';

var d3Selection = require('d3-selection'),

    PubSub = require('pubsub-js'),

    colors = require('./../src/charts/helpers/colors'),
    legend = require('./../src/charts/legend'),
    stackedBarChart = require('./../src/charts/stacked-bar'),
    tooltip = require('./../src/charts/tooltip'),
    stackedDataBuilder = require('./../test/fixtures/stackedBarDataBuilder'),
    colorSelectorHelper = require('./helpers/colorSelector');
    require('./helpers/resizeHelper');

function createStackedBarChartWithTooltip(optionalColorSchema) {
    var stackedBar = stackedBarChart(),
        chartTooltip = tooltip(),
        legendChart,
        legendContainer = d3Selection.select('.js-legend-chart-container'),
        testDataSet = new stackedDataBuilder.StackedBarDataBuilder(),
        container = d3Selection.select('.js-stacked-bar-chart-tooltip-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = testDataSet.with3Sources().build();
        
        // StackedAreChart Setup and start
        stackedBar
            .tooltipThreshold(600)
            .width(containerWidth)
            .grid('horizontal')
            .isAnimated(true)
            .stackLabel('stack')
            .nameLabel('date')
            .valueLabel('views')
            .on('customMouseOver', function() {
                chartTooltip.show();
            })
            .on('customMouseMove', function(dataPoint, topicColorMap, x,y) {
                chartTooltip.update(dataPoint, topicColorMap, x, y);
            })
            .on('customMouseOut', function() {
                chartTooltip.hide();
            });

        if (optionalColorSchema) {
            stackedBar.colorSchema(optionalColorSchema);
        }


        container.datum(dataset.data).call(stackedBar);

        legendChart = getLegendChart(stackedBar,stackedBar.getData(), optionalColorSchema);
       
        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
            .dateLabel('key')
            .nameLabel('stack')
            .title('Testing tooltip');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = d3Selection.select('.js-stacked-bar-chart-tooltip-container .metadata-group');
        tooltipContainer.datum([]).call(chartTooltip);

        d3Selection.select('#button').on('click', function() {
                stackedBar.exportChart('stacked-bar.png', 'Britecharts Stacked Bar');
        });
    }
}
function getInlineLegendChart(dataset, optionalColorSchema) {
    var legendChart = legend(),
        legendContainer = d3Selection.select('.js-inline-legend-chart-container'),
        containerWidth = legendContainer.node() ? legendContainer.node().getBoundingClientRect().width : false;

    if (containerWidth) {
        d3Selection.select('.js-inline-legend-chart-container .britechart-legend').remove();

        legendChart
            .horizontal(true)
            .width(containerWidth*0.6)
            .markerSize(8)
            .height(40)

        if (optionalColorSchema) {
            legendChart.colorSchema(optionalColorSchema);
        }

        legendContainer.datum(dataset).call(legendChart);

        return legendChart;
    }
}
function getLegendChart(stackedBar,dataset, optionalColorSchema) {
    var legendChart = legend(),
        legendContainer = d3Selection.select('.js-legend-chart-container'),
        containerWidth = legendContainer.node() ? legendContainer.node().getBoundingClientRect().width : false;

    if (containerWidth) {
        d3Selection.select('.js-legend-chart-container .britechart-legend').remove();
        let colorMap = stackedBar.getCategoryColorMap();
        
        legendChart
            .width(containerWidth*0.8)
            .height(200)
            .colorScale( ({name}) => colorMap[name]);

        if (optionalColorSchema) {
            legendChart.colorSchema(optionalColorSchema);
        }
        
        legendContainer.datum(dataset).call(legendChart);

        return legendChart;
    }
}
function createHorizontalStackedBarChart(optionalColorSchema) {
    var stackedBar = stackedBarChart(),
        chartTooltip = tooltip(),
        testDataSet = new stackedDataBuilder.StackedBarDataBuilder(),
        container = d3Selection.select('.js-stacked-bar-chart-fixed-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = testDataSet.with3Sources().build();

        // StackedAreChart Setup and start
        stackedBar
            .tooltipThreshold(600)
            .grid('vertical')
            .width(containerWidth)
            .horizontal(true)
            .isAnimated(true)
            .margin({
                left: 80,
                top: 40,
                right: 30,
                bottom: 20
            })
            .nameLabel('date')
            .valueLabel('views')
            .stackLabel('stack')
            .on('customMouseOver', function() {
                chartTooltip.show();
            })
            .on('customMouseMove', function(dataPoint, topicColorMap, x, y) {
                chartTooltip.update(dataPoint, topicColorMap, x, y);
            })
            .on('customMouseOut', function() {
                chartTooltip.hide();
            });

        if (optionalColorSchema) {
            stackedBar.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(stackedBar);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
             .dateLabel('key')
             .nameLabel('stack')
            .title('Dummy Tooltip Title');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = d3Selection.select('.js-stacked-bar-chart-fixed-container .metadata-group');
        tooltipContainer.datum([]).call(chartTooltip);
    }
}

if (d3Selection.select('.js-stacked-bar-chart-tooltip-container').node()){
    // Chart creation
    createStackedBarChartWithTooltip();
    createHorizontalStackedBarChart();

    // For getting a responsive behavior on our chart,
    // we'll need to listen to the window resize event
    var redrawCharts = function(){
        d3Selection.selectAll('.stacked-bar').remove();

        createStackedBarChartWithTooltip();
        createHorizontalStackedBarChart();
    };

    // Redraw charts on window resize
    PubSub.subscribe('resize', redrawCharts);

    // Color schema selector
    colorSelectorHelper.createColorSelector('.js-color-selector-container', '.stacked-bar', createStackedBarChartWithTooltip);
}
