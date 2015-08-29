/*
datos originales
var data = [
  {"date":"2012-03-20","total":3},
  {"date":"2012-03-21","total":8},
  {"date":"2012-03-22","total":2},
  {"date":"2012-03-23","total":9},
  {"date":"2012-03-24","total":3},
  {"date":"2012-03-25","total":4},
  {"date":"2012-03-26","total":12}];
*/
  function parseDate(d) {
    return new Date(
        d.substring(0,4),
        d.substring(4, 6)-1,
        d.substring(6, 8),
        d.substring(8, 10),
        d.substring(10, 12));
  }

bonderFilter = function bonderFilter (filter) {
  return function (el) {
    return (filter === el.SYSTEM_ID);
  }
}

fb=bonderFilter("CYBOND63")


d3.csv("SQLT0044.csv", function (data){
  data = data.filter(fb)
  data = data.map(function(el){
    el.PROCESS_DATE = parseDate(el.PROCESS_DATE)
    return el;
  })
  console.log(data)

  var margin = {top: 40, right: 40, bottom: 40, left:40},
      width = 600,
      height = 500;

  var x = d3.time.scale()
      .domain([data[0].PROCESS_DATE, d3.time.day.offset(data[data.length - 1].PROCESS_DATE, 1)])
      .rangeRound([0, width - margin.left - margin.right]);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.CYCLE_TIME; })])
      .range([height - margin.top - margin.bottom, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(d3.time.days, 1)
      .tickFormat(d3.time.format('%a %d'))
      .tickSize(0)
      .tickPadding(8);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickPadding(8);

  var svg = d3.select('body').append('svg')
      .attr('class', 'chart')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  svg.selectAll('.chart')
      .data(data)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) { return x(d.PROCESS_DATE); })
      .attr('y', function(d) { return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.CYCLE_TIME)) })
      .attr('width', 10)
      .attr('height', function(d) { return height - margin.top - margin.bottom - y(d.CYCLE_TIME) });

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
      .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);
})