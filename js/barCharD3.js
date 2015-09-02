
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


d3.csv('sqlt0047.csv',function (data) {
  // console.log(JSON.stringify(data))
fb=bonderFilter("CYTEST1202")

// data = data.filter(function (el) {
//   return (el.CHANNEL === '1')
// })
  // data = data.filter(fb)

  data = data.sort(function(a,b){
    return a.PROCESS_DATE-b.PROCESS_DATE
  });
  
  data = data.map(function(el,index,arr){
    el.PROCESS_DATE = parseDate(el.PROCESS_DATE)
    el.ct = (el.CYCLE_TIME/60>150)?150:el.CYCLE_TIME/60
    el.PCT = (new Date(el.PROCESS_DATE.valueOf())).setSeconds(-17) //process cycle time
    el.dt_start = (new Date(el.PROCESS_DATE.valueOf())).setSeconds(-el.CYCLE_TIME)
    
    if(index === 0){
        el.deadTime = new Date(el.dt_start.valueOf())
    }else if (index !== arr.length){
        el.deadTime = new Date(arr[index-1].PROCESS_DATE)
    } else {
        el.deadTime = el.PCT
    }
    
    return el;
  })
  // console.log(data)
  var margin = {top: 40, right: 40, bottom: 40, left:40},
      width = 968,
      height = 434;

  var x = d3.time.scale()
      .domain([data[0].dt_start, data[data.length - 1].PROCESS_DATE ])
      .rangeRound([0, width - margin.left - margin.right]);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.ct; })])
      .range([height - margin.top - margin.bottom, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(11)
      .ticks(d3.time.hours, 1)
      .tickFormat(d3.time.format('%H'))
      .tickSize(1)
      .tickPadding(4);

  var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(5)
      .orient('left')
      .tickSize(2)
      .tickPadding(8);

  var svg = d3.select('svg')
      .attr('class', 'chart')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

//lineas azules indican el punto en el tiempo en es que se registro la medicion
  svg.selectAll('.chart')
      .data(data)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) { return x(d.PROCESS_DATE)+2; })
      .attr('y', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)+1)
      })
      .attr('style', function(d){

        if(d.CHANNEL === '1'){
          return "fill: blue"
        } else if(d.CHANNEL === '2') {
          return "fill: black"
        }else if(d.CHANNEL === '3') {
          return "fill: green"
        }else if(d.CHANNEL === '4') {
          return "fill: red"
        }
        /*if (d.PASS_FAIL === 'P'){
           return "fill: blue; stroke: blue; stroke-width: 0"
        }else{
           return "fill: red; stroke: black; stroke-width: 0"
        }*/
      })
      .attr('width', 2)
      .attr('height', function(d) {
        return 10
      });
// lineas verdes indican el tiempo de proceso del equipo
  svg.selectAll('.chart')
      .data(data)
    .enter().append('line')
      .attr('class', 'cycle_time')
      .attr('x1', function(d) { return x(d.dt_start)+2; })
      .attr('y1', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct))
      })
      .attr('x2', function(d) { return x(d.PROCESS_DATE)+2; })
      .attr('y2', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct))
      })
      .attr('stroke','green')
      .attr('stroke-width',2);
// lineas violetas indican el tiempo de proceso del equipo
  svg.selectAll('.chart')
      .data(data)
    .enter().append('line')
      .attr('class', 'exedent_time')
      .attr('x1', function(d) { return x(d.PCT)+2; })
      .attr('y1', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-3)
      })
      .attr('x2', function(d) { return x(d.dt_start)+2; })
      .attr('y2', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-3)
      })
      .attr('stroke',function (d) {
        if(d.PCT > d.dt_start){
          return 'black'
        }else{
          return 'gray'
        }
      })
      .attr('stroke-width',2);

// lineas rojas indican el tiempo perdido del proceso
  svg.selectAll('.chart')
      .data(data)
    .enter().append('line')
      .attr('class', 'deadTime')
      .attr('x1', function(d) { return x(d.deadTime)+2; })
      .attr('y1', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-7)
      })
      .attr('x2', function(d) { return x(d.dt_start)+2; })
      .attr('y2', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-7)
      })
      .attr('stroke','red')
      .attr('stroke-width',2);

  svg.append('g')
      .attr('class', 'x axis')
      .attr('font-size', 12)
      .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
      .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .attr('font-size', 12)
    .attr('transform', 'translate(' + 0 + ', ' + 0 + ')')
    .call(yAxis);
})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
