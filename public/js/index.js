graph_data = [[0,1,], [1, 3]];
graph = null;

var socket = io.connect('http://localhost:8080');
socket.on('reading', function (data) {
//  console.log(data);
  if(graph){
    document.getElementById("reading").innerHTML = data.reading;
    update(data.reading);
  }
});

setTimeout(run, 1000);


function run() {
  graph = new Dygraph(document.getElementById("div_g"), graph_data,
                      {
                        drawPoints: true,
                        showRoller: true,
                        valueRange: [0.0, 1000],
                        labels: ['Time', 'Weight']
                      });
};

counter = 0;
function update(reading){
  //var x = new Date();  // current time
  var x = counter++;
  var y = reading;
  graph_data.push([x, y]);
  graph_data = graph_data.slice(-100); // truncate to 100 values

  graph.updateOptions( { 'file': graph_data } );
}
