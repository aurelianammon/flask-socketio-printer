var socket = io();

socket.on('connect', function() {
    socket.emit('hello');
});

socket.on('layer', (data) => {
    vm.layer = data.layer
});

socket.on('slicer_options', (data) => {
    vm.slicer_options = data
});
socket.on('toolpath_options', (data) => {
    console.log(data)
    vm.toolpath_options = data
});

socket.on('connected', (data) => {
    vm.connected = data.connected
});

socket.on('toolpath_type', (data) => {
    vm.toolpath_type = data.toolpath_type
});

document.getElementById("event").addEventListener("click", function(){ socket.emit('layer_to_zero'); });