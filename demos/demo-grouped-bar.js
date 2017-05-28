'use strict';

var d3Selection = require('d3-selection'),

    PubSub = require('pubsub-js'),

    colors = require('./../src/charts/helpers/colors'),

    groupedBarChart = require('./../src/charts/grouped-bar'),
    tooltip = require('./../src/charts/tooltip'),
    stackedDataBuilder = require('./../test/fixtures/stackedBarDataBuilder'),
    colorSelectorHelper = require('./helpers/colorSelector');
    require('./helpers/resizeHelper');

function creategroupedBarChartWithTooltip(optionalColorSchema) {
    var groupedBar = groupedBarChart(),
        chartTooltip = tooltip(),
        testDataSet = new stackedDataBuilder.StackedBarDataBuilder(),
        container = d3Selection.select('.js-grouped-bar-chart-tooltip-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = testDataSet.with3Sources().build();

        // GroupedAreChart Setup and start
        groupedBar
            .tooltipThreshold(600)
            .width(containerWidth)
            .grid('horizontal')
            .isAnimated(true)
            .groupLabel('stack')
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
            groupedBar.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(groupedBar);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
            .dateLabel('key')
            .nameLabel('stack')
            .title('Testing tooltip');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = d3Selection.select('.js-grouped-bar-chart-tooltip-container .metadata-group');
        tooltipContainer.datum([]).call(chartTooltip);

        d3Selection.select('#button').on('click', function() {
                groupedBar.exportChart('grouped-bar.png', 'Britecharts Grouped Bar');
        });
    }
}

function createHorizontalgroupedBarChart(optionalColorSchema) {
    var groupedBar = groupedBarChart(),
        chartTooltip = tooltip(),
        testDataSet = new stackedDataBuilder.StackedBarDataBuilder(),
        container = d3Selection.select('.js-grouped-bar-chart-fixed-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = testDataSet.with3Sources().build();

        // StackedAreChart Setup and start
        groupedBar
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
            .groupLabel('stack')
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
            groupedBar.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(groupedBar);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
             .dateLabel('key')
             .nameLabel('stack')
            .title('Dummy Tooltip Title');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = d3Selection.select('.js-grouped-bar-chart-fixed-container .metadata-group');
        tooltipContainer.datum([]).call(chartTooltip);
    }
}

if (d3Selection.select('.js-grouped-bar-chart-tooltip-container').node()){
    // Chart creation
    creategroupedBarChartWithTooltip();
    createHorizontalgroupedBarChart();

    // For getting a responsive behavior on our chart,
    // we'll need to listen to the window resize event
    var redrawCharts = function(){
        d3Selection.selectAll('.grouped-bar').remove();

        creategroupedBarChartWithTooltip();
        createHorizontalgroupedBarChart();
    };

    // Redraw charts on window resize
    PubSub.subscribe('resize', redrawCharts);

    // Color schema selector
    colorSelectorHelper.createColorSelector('.js-color-selector-container', '.grouped-bar', creategroupedBarChartWithTooltip);
}
