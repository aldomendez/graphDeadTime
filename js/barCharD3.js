
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


d3.csv('toolbox.php/type/silens',function (data) {
  // console.log(JSON.stringify(data))

// Convierto la fecha (el texto) en una fecha real
  data = data.map(function parseData (el) {
    if (el.PROCESS_DATE != null){
      el.PROCESS_DATE = parseDate(el.PROCESS_DATE)
      return el
    }
  })



  data = data.sort(function(a,b){
    return a.PROCESS_DATE-b.PROCESS_DATE
  });
  

  var margin = {top: 40, right: 40, bottom: 40, left:40},
      width = 1800,
      height = 664;

console.log('PROCESS_DATE',data[0].PROCESS_DATE)
console.log('start',(new Date(data[0].PROCESS_DATE.valueOf())).setSeconds(-data[0].CYCLE_TIME))
console.log('end',data[data.length - 1].PROCESS_DATE)
  var x = d3.time.scale()
      .domain([new Date((new Date(data[0].PROCESS_DATE.valueOf())).setSeconds(-data[0].CYCLE_TIME)), data[data.length - 1].PROCESS_DATE ])
      .rangeRound([0, width - margin.left - margin.right]);

  var y = d3.scale.linear()
      .domain([0, 360])
      // .domain([0, d3.max(data, function(d) { return d.ct; })])
      .range([height - margin.top - margin.bottom, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(11)
      // .ticks(d3.time.hours, 1)
      .tickFormat(d3.time.format('%H'))
      .tickSize(1)
      .tickPadding(4);

  var svg = d3.select('svg')
      .attr('class', 'chart')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  /*var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(5)
      .orient('left')
      .tickSize(2)
      .tickPadding(8);*/

  // t = _.groupBy(data,'SYSTEM_ID')
  /*_.forEach( t , function(d,el,arr){
    console.log(arr)
  })*/
  bonders = _.pairs(_.groupBy(data,'SYSTEM_ID'))
  bonders.map(function(el,i,arr){
    data = el[1]




  data = data.sort(function(a,b){
    return a.PROCESS_DATE-b.PROCESS_DATE
  });
  
  data = data.map(function(el,index,arr){
    el.ct = el.CYCLE_TIME/60                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    //el.ct = (el.CYCLE_TIME/60>150)?150:el.CYCLE_TIME/60
    el.ct = 8
    el.PCT = new Date((new Date(el.PROCESS_DATE.valueOf())).setSeconds(-1200)) //process cycle time
    el.dt_start = new Date((new Date(el.PROCESS_DATE.valueOf())).setSeconds(-el.CYCLE_TIME))
    
    if(index === 0){
        el.deadTime = new Date(el.dt_start.valueOf())
    }else if (index !== arr.length){
        el.deadTime = new Date(arr[index-1].PROCESS_DATE)
    } else {
        el.deadTime = el.PCT
    }
    
    return el;
  })


//var machines = ["CYBOND63", "CYBOND60", "CYBOND3", "CYBOND58", "CYBOND55", "CYBOND14", "CYBOND38", "CYBOND59", "CYBOND56", "CYBOND57"]
//var dsply = d3.select('#display')
//dsply.append('ul')

//li = select('ul').selectAll('li').data(machines).enter()
//.append('li').text('sdf')

//li.exit().remove()

//lineas azules indican el punto en el tiempo en es que se registro la medicion
  svg.selectAll('.chart')
      .data(data)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) {
        return x(d.PROCESS_DATE)+2;
      })
      .attr('y', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)+2 + (36*i))
      })
      .attr('style', function(d){
        if (d.PASS_FAIL === 'P'){
           return "fill: blue; stroke: blue; stroke-width: 0"
        }else{
           return "fill: red; stroke: black; stroke-width: 0"
        }
      })
      .attr('width', 3.44)
      .attr('height', function(d) {
        return 36
      });
// lineas verdes indican el tiempo de proceso del equipo
  svg.selectAll('.chart')
      .data(data)
    .enter().append('line')
      .attr('class', 'deadTime')
      .attr('x1', function(d) {
        return x(d.dt_start)+6; 
      })
      .attr('y1', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-4 + (36*i))
      })
      .attr('x2', function(d) { return x(d.PROCESS_DATE)+2; })
      .attr('y2', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-4 + (36*i))
      })
      .attr('stroke','green')
      .attr('stroke-width',12);
// lineas naranjas o amarillas indican el tiempo de proceso del equipo
  svg.selectAll('.chart')
      .data(data)
    .enter().append('line')
      .attr('class', 'deadTime')
      .attr('x1', function(d) { return x(d.PCT)+4; })
      .attr('y1', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-16+(36*i))
      })
      .attr('x2', function(d) { return x(d.dt_start)+6; })
      .attr('y2', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-16+(36*i))
      })
      .attr('stroke',function(d){
        if (d.PCT >= d.dt_start){
          return 'gold'
        }else {
          return 'yellow'
        }
        })
      .attr('stroke-width',12);


// lineas rojas indican el tiempo de proceso del equipo
  svg.selectAll('.chart')
      .data(data)
    .enter().append('line')
      .attr('class', 'deadTime')
      .attr('x1', function(d) { return x(d.deadTime)+6; })
      .attr('y1', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-28+(36*i))
      })
      .attr('x2', function(d) { return x(d.dt_start)+6; })
      .attr('y2', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-28+(36*i))
      })
      .attr('stroke','red')
      .attr('stroke-width',12);




  })


  svg.append('g')
      .attr('class', 'x axis')
      .attr('font-size', 12)
      .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
      .call(xAxis);

  /*svg.append('g')
    .attr('class', 'y axis')
    .attr('font-size', 12)
    .attr('transform', 'translate(' + 0 + ', ' + 0 + ')')
    .call(yAxis);*/


})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
