chartdata = [40, 60, 80, 100, 70, 120, 100, 60, 70, 150, 120, 140]
h = 222
w = 720
bW = 40
bO = 20

d3.select('#bar-chart').append 'svg'
  .attr 'width', w
  .attr 'height', h
  .style 'background', '#dff0d8'
  .selectAll('rect').data(chartdata)
  .enter().append 'rect'
    .style {
      'fill':'#3c763d'
      'stroke':'#d6e9c6'
      'stroke-width':'5'
    }
    .attr 'width', bW
    .attr 'height', (data)-> data
    .attr 'x', (data, i)-> i*(bW + bO)
    .attr 'y', (data)-> h-data