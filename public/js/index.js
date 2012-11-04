$(document).ready(function(){

  var graph_data = [[0,0]];
  var graph;

  var socket = io.connect('http://localhost:8080');
  socket.on('reading', function (data) {
    //  console.log(data);
    if(graph){
      document.getElementById("reading").innerHTML = data.reading;
      update(data.reading);
      $("#data_percent").css('height', (data.reading/10) + '%');
    }
  });

  run();

  function run() {
    graph = new Dygraph(document.getElementById("div_g"), graph_data,
                        {
                          drawPoints: true,
                          // showRoller: true,
                          fillGraph: true,
                          highlightCircleSize: 10,
                          strokeWidth: 3,
                          valueRange: [0.0, 1000],
                          labels: ['Time', 'Weight']
                        });
  };

  var counter = 0;
  function update(reading){
    //var x = new Date();  // current time
    var x = counter++;
    var y = reading;
    graph_data.push([x, y]);
    graph_data = graph_data.slice(-100); // truncate to 100 values

    graph.updateOptions( { 'file': graph_data } );
  }
});