
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

// Toma los datos de la direccion para crear la informacion que enviara
// como peticion de datos para hacer la grafica
// la forma de la peticion es la siguiente
// 
// cache/<archivo sin extension>
// cache/silens
// suponiendo que <silens.sql> existe en el servidor, enviara los datos
// que tenga en cache de la ultima llamada que se tenga de ese archivo
// 
// <coneccion>/<archivo>
// mxoptix/silens
// creara una coneccion y ejecutara el query <silens.sql>
// guardara los datos en cache y enviara los datos de vuelta a este script
// los datos que se generan, se pueden accesar en otro momento utilizando el cache
var ideal_cycle_time, path, ref;
ref = window.location.search.substr(1).split(':'), path = ref[0], ideal_cycle_time = ref[1];


d3.csv('toolbox.php/' + path ,function (data) {
  // console.log(JSON.stringify(data))


var groups = _.groupBy(data,'SYSTEM_ID')

// Convierto la fecha (el texto) en una fecha real
  data = data.map(function parseData (el) {
    if (el.PROCESS_DATE != null){
      el.PROCESS_DATE = parseDate(el.PROCESS_DATE)
      return el
    }
  })
// Sorteo por fecha de la menor a la mayor
  data = data.sort(function(a,b){
    return a.PROCESS_DATE-b.PROCESS_DATE
  });
  
// Genero los valores iniciales para el marco del grafico
  var margin = {top: 40, right: 40, bottom: 40, left:40},
      width = parseInt(d3.select('body').style('width')),
      height = (40 * _.size(groups))+margin.top + margin.bottom,
      titleSpace = 150,
      firstTime = new Date((new Date(data[0].PROCESS_DATE.valueOf())).setSeconds(-data[0].CYCLE_TIME)),
      machineSize = 40,
      barStroke = 37,
      barOffset = 10,
      lastTime = data[data.length - 1].PROCESS_DATE
      // ideal_cycle_time = 10


  var x = d3.time.scale()
      .domain([firstTime, lastTime])
      .rangeRound([titleSpace, width - margin.left - margin.right]);

  var y = d3.scale.linear()
      .domain([0, 360])
      // .domain([0, d3.max(data, function(d) { return d.ct; })])
      .range([height - margin.top - margin.bottom - 30 , 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      // .ticks(11)
      .ticks(d3.time.hours, 1)
      .tickFormat(d3.time.format('%H'))
      .tickSize(1)
      .tickPadding(4);

  var svg = d3.select('svg')
      .attr('class', 'chart')
      .attr('width', width)
      .attr('height', height)
      .on('mousemove',function onMousemove () {
        // console.log(d3.mouse(this))
      }).append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

    // svg.selectAll('.chart')
    //   .data('a')
    //   .enter().append('line')
    //   .attr('class','startLine')
    //   .attr('x1',function () {
    //     return x(firstTime)
    //   })
    //   .attr('y1',function () {
    //     return 0
    //   })
    //   .attr('x2',function () {
    //     return x(firstTime)
    //   })
    //   .attr('y2',function () {
    //     return height-margin.top - margin.bottom
    //   })
    //   .attr('stroke','black')
    //   .attr('stroke-width',1)



  /*var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(5)
      .orient('left')
      .tickSize(2)
      .tickPadding(8);*/

// Por lo menos esta parte ya funciona
// var machines = ["CYBOND63", "CYBOND60", "CYBOND3", "CYBOND58", "CYBOND55", "CYBOND14", "CYBOND38", "CYBOND59", "CYBOND56", "CYBOND57"]
// var dsply = d3.select('body')
// dsply.append('ul')

// li = d3.select('ul').selectAll('li').data(machines).enter()
// .append('li').text(function  (d) {
//   return d
// })


/*******************************************************************
Agrupar datos por maquinas y dibujarlas en la pantalla empieza aqui
********************************************************************/
  bonders = _.pairs(groups)
  bonders.map(function(el,i,arr){
    data = el[1]
    name = el[0]

  var machineOffset = i*machineSize



  data = data.sort(function(a,b){
    return a.PROCESS_DATE-b.PROCESS_DATE
  });
  
  data = data.map(function(el,index,arr){
    // if (index === 0){
    //   el.first = true;
    // }else {
    //   el.first = false;
    // }
    el.ct = el.CYCLE_TIME/60 
    //el.ct = (el.CYCLE_TIME/60>150)?150:el.CYCLE_TIME/60
    el.ct = 8
    el.PCT = new Date((new Date(el.PROCESS_DATE.valueOf())).setSeconds(-( ideal_cycle_time *60))) //process cycle time
    el.dt_start = new Date((new Date(el.PROCESS_DATE.valueOf())).setSeconds(-el.CYCLE_TIME))
    
    if(index === 0){
        // el.deadTime = firstTime
        el.deadTime = el.dt_start
    }else if (index !== arr.length){
        el.deadTime = new Date(arr[index-1].PROCESS_DATE)
    } else {
        el.deadTime = el.PCT
    }
    
    return el;
  })

// svg.append('g').attr(class)

// Agrega los nombres de las maquinas
    svg.selectAll('.chart')
      .data([name])
      .enter().append('text')
      .attr('class','bonderName bonder ' + name)
      .attr('x',10)
      .attr('y',function () {
        return height - margin.top - margin.bottom - machineOffset-8 - machineSize/2
      })
      .text(function () {
        return name;
      }).on('click',function (e) {
        var active = d3.select(this).attr('v-active')
        console.log(active,e);
        if(active == e){
          console.log('deselect all');
          d3.selectAll('.bonder').attr('v-active', 'all').transition().duration(200).style('opacity',1)
        }else{
          // console.log('select only some');
          d3.selectAll('.bonder').attr('v-active', e).transition().duration(200).style('opacity',0.1)
          d3.selectAll('.'+e).attr('v-active',e).transition().duration(300).delay(180).style('opacity',1)
        }
      })

// Linea de separacion entre maquinas
    svg.selectAll('.chart')
      .data('a')
      .enter().append('line')
      .attr('class','divisionLine')
      .attr('x1',function () {
        return 0
      })
      .attr('y1',function () {
        return height - margin.top - margin.bottom - machineOffset-6 - machineSize - 2
      })
      .attr('x2',function () {
        return x(lastTime)
      })
      .attr('y2',function () {
        return height - margin.top - margin.bottom - machineOffset-6 - machineSize - 2
      })
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill','none')
      .attr('shape-rendering', 'crispEdges')




//lineas azules indican el punto en el tiempo en es que se registro la medicion
  // svg.selectAll('.chart')
  //     .data(data)
  //   .enter().append('rect')
  //     .attr('class', 'bar bonder ' + name)
  //     .attr('x', function(d) {
  //       return x(d.PROCESS_DATE);
  //     })
  //     .attr('y', function(d) {
  //       return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)+2 + (machineOffset))
  //     })
  //     .attr('style', function(d){
  //       if (d.PASS_FAIL === 'P'){
  //          return "fill: blue; stroke: blue; stroke-width: 0"
  //       }else{
  //          return "fill: red; stroke: black; stroke-width: 0"
  //       }
  //     })
  //     .attr('width', 1)
  //     .attr('height', function(d) {
  //       return 30
  //     });



// lineas verdes indican el tiempo de proceso del equipo
  svg.selectAll('.chart')
      .data(data)
    .enter().append('line')
      .attr('class', 'process_time bonder ' + name)
      .attr('x1', function(d) {
        return x(d.dt_start); 
      })
      .attr('y1', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-barOffset + (machineOffset))
      })
      .attr('x2', function(d) { return x(d.PROCESS_DATE); })
      .attr('y2', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-barOffset + (machineOffset))
      })
      .attr('stroke','green')
      .attr('stroke-width',barStroke)
      .on('mouseenter',function (d) {
        // console.log(d)
        d3.selectAll('.overTime').transition().duration(150).style('opacity',0.1)
        d3.selectAll('.deadTime').transition().duration(150).style('opacity',0.1)
      })
      .on('mouseout',function (d) {
        d3.selectAll('.overTime').transition().duration(150).style('opacity',1)
        d3.selectAll('.deadTime').transition().duration(150).style('opacity',1)
      });


// lineas naranjas o amarillas indican el tiempo de proceso exedente de la pieza
  svg.selectAll('.chart')
      .data(data)
    .enter().append('line')
      .attr('class', 'overTime bonder ' + name)
      .attr('x1', function(d) { return x(d.PCT); })
      .attr('y1', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-barOffset+(machineOffset))
      })
      .attr('x2', function(d) { return x(d.dt_start) })
      .attr('y2', function(d) {
        return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-barOffset+(machineOffset))
      })
      .attr('stroke',function(d){
        if (d.PCT >= d.dt_start){
          return 'gold'
        }else {
          return 'transparent'
        }})
      .attr('stroke-width',barStroke)
      .on('mouseenter',function (d) {
        // console.log(d)
        d3.selectAll('.process_time').transition().duration(150).style('opacity',0.1)
        d3.selectAll('.deadTime').transition().duration(150).style('opacity',0.1)
      })
      .on('mouseout',function (d) {
        d3.selectAll('.process_time').transition().duration(150).style('opacity',1)
        d3.selectAll('.deadTime').transition().duration(150).style('opacity',1)
      });


redLines = data.filter(function filterWhenMoreThanXMinutes (d) {
  var timeDiff = (d.dt_start - d.deadTime)/1000;
// Si despues de 5 minutos no se ha cargado una pieza
  if (timeDiff>300){
    return true;
  }
})

// lineas rojas indican el tiempo muerto (iddleTime)
  // svg.selectAll('.chart')
  //     .data(redLines)
  //   .enter().append('line')
  //     .attr('class', 'deadTime bonder ' + name)
  //     .attr('x1', function(d) { return x(d.deadTime); })
  //     .attr('y1', function(d) {
  //       return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-barOffset+(machineOffset))
  //     })
  //     .attr('x2', function(d) { return x(d.dt_start); })
  //     .attr('y2', function(d) {
  //       return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.ct)-barOffset+(machineOffset))
  //     })
  //     .attr('stroke','red')
  //     .attr('stroke-width',barStroke)
  //     .on('click',function redLineClick (d) {
  //       var timeDiff = (d.dt_start - d.deadTime)/1000;
  //       var pzCount = timeDiff/(20*60);
  //       console.log("in " + Math.round(timeDiff/60) + "min se dejaron de hacer " + Math.round(pzCount,2) + " piezas");
  //     })
  //     .on('mouseenter',function (d) {
  //       // console.log(d)
  //       d3.selectAll('.process_time').transition().duration(150).style('opacity',0.1)
  //       d3.selectAll('.overTime').transition().duration(150).style('opacity',0.1)
  //     })
  //     .on('mouseout',function (d) {
  //       d3.selectAll('.process_time').transition().duration(150).style('opacity',1)
  //       d3.selectAll('.overTime').transition().duration(150).style('opacity',1)
  //     });
  

// otro formato de lineas azules
// lo tengo que poner hasta aqui por que si no quedan abajo y no de ven
  svg.selectAll('.chart')
      .data(data)
    .enter().append('line')
      .attr('class', 'process_time bonder ' + name)
      .attr('x1', function(d) {
        return x(d.dt_start); 
      })
      .attr('y1', function(d) {
        return height - margin.top - margin.bottom - barOffset+3 - (height - margin.top - margin.bottom - y(d.ct) + (machineOffset))
      })
      .attr('x2', function(d) { return x(d.PROCESS_DATE); })
      .attr('y2', function(d) {
        return height - margin.top - margin.bottom - barOffset+3 - (height - margin.top - margin.bottom - y(d.ct) + (machineOffset))
      })
      .attr('stroke',function (d) {
        if (d.PASS_FAIL === 'P' ||d.PASS_FAIL === 'PASS'){
          return 'blue';
        } else {
          return 'red'
        }
      })
      .attr('stroke-width',3);


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