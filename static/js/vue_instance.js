const vm = new Vue({ // Again, vm is our Vue instance's name for consistency.
    el: '#vm',
    delimiters: ['[[', ']]'],
    components: {
        VueRangeSlider
    },
    data: {
        eth: {
            current: 0,
            last: 0,
        },
        // Canvas Magic
        points: [],
        draggedElement: null,
        shapeOpen: true,
        windowWidth: window.innerWidth,
        // UI elements
        printLable: "Print",
        synced_to_bot: false,
        sentiment: 0,
        lenght: 0,
        polling: null,
        layer: 0,
        connected: false,
        port: '/dev/tty.usbmodem2101',
        baud: '250000',
        log_text: "some random text and even more",
        value: 1,
        slicer_options: {
            extrusion_rate: 0,
            feed_rate: 0,
            layer_hight: 0
        },
        toolpath_options: {
            transformation_factor: 0,
            magnitude: 0,
            wave_lenght: 0,
            rasterisation: 0,
            diameter: 0,
            scale: 1
        },
        toolpath_type: "NONE",
        plate_center_x: 100,
        plate_center_y: 100
    },
    watch: {
        // whenever question changes, this function will run
        layer: function (newValue, oldValue) {
            socket.emit('layer', {'layer': newValue});
        },
        slicer_options: {
            handler: function (newValue, oldValue) {
                socket.emit('slicer_options', this.slicer_options);
                // console.log("hello")
            },
            deep: true
        },
        toolpath_options: {
            handler: function (newValue, oldValue) {
                socket.emit('toolpath_options', this.toolpath_options);
                // console.log("hello")
            },
            deep: true
        },
        toolpath_type: function (newValue, oldValue) {
            socket.emit('toolpath_type', {'toolpath_type': newValue});
        },
        synced_to_bot: function (newValue, oldValue) {
            if (newValue == false) {
                this.unpoll()
            }
            else {
                this.poll()
            }
        },
    },
    computed: { 
        isPrinting: function () {
          return this.polling != null
        },
        stringPoints: function () {
            output = "";
            this.points.forEach(function (point, index) {
                output = output + point[0] + "," + point[1] + " ";
            });
            return output;
        },
        svgFactor: function () {
            return 150 / this.windowWidth;
        }
        // printLable: function() {
        //     if (this.isPrinting) {
        //         return "Stop"
        //     } else {
        //         return "Print"
        //     }
        // }
    },
    methods: {
        poll () {
            this.polling = setInterval(() => {
                // this.slicer_options.extrusion_rate += 0.01

                // fetch("https://api2.binance.com/api/v3/ticker/price", {
                //     "method": "GET",
                //     "headers": {}
                // })
                // .then(async response => {
                //     const data = await response.json();
                //     this.eth.last = this.eth.current
                //     this.eth.current = data.filter(element => element.symbol == "ETHEUR")[0].price
                //     output = this.scale(this.eth.current - this.eth.last, -1, 1, -2, 2)
                //     this.toolpath_options.magnitude += output
                // })
                // .catch(err => {
                //     console.error(err);
                // });

                fetch("http://localhost:8888/sentiment", {
                    "method": "GET",
                    "headers": {}
                })
                .then(async response => {
                    const data = await response.json();
                    this.sentiment = data.sentiment
                    this.toolpath_options.magnitude = Math.abs(data.sentiment)
                    // data.length
                    if (this.sentiment < 0) {
                        this.toolpath_type = "SQUARE"
                    } else {
                        this.toolpath_type = "SINE"
                    }
                    if (this.lenght < data.lenght) {
                        if (this.toolpath_options.diameter < 100) {
                            console.log("small")
                            this.toolpath_options.diameter = this.toolpath_options.diameter + 5
                        }
                    } else if (this.lenght > data.lenght) {
                        if (this.toolpath_options.diameter > 10) {
                            console.log("big")
                            this.toolpath_options.diameter = this.toolpath_options.diameter - 5
                        }
                    }
                    this.lenght = data.lenght
                })
                .catch(err => {
                    console.error(err);
                });
            }, 3 * 1000)
        },
        unpoll () {
            clearInterval(this.polling)
            this.polling = null
        },
        scale (number, inMin, inMax, outMin, outMax) {
            return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        },
        move_up: function (event) {
            socket.emit('move_up');
        },
        move_down: function (event) {
            socket.emit('move_down');
        },
        connect: function (event) {
            if( !this.connected ) {
                socket.emit('printer_connect', this.port, this.baud);
            } else {
                socket.emit('printer_disconnect');
            }
        },
        setup: function(event) {
            socket.emit('printer_setup');
        },
        print: function(event) {
            // send the points and append the first one if the shape is closed
            var print_points = [] // = this.points.slice();
            // bring all points to 0,0
            for (const element of this.points) {
                print_points.push([element[0] - 75 + parseInt(this.plate_center_x), element[1] - 75 + parseInt(this.plate_center_y)])
            }
            console.log(print_points);
            if (!this.shapeOpen) {
                var last_point =  print_points[0];
                print_points = print_points.concat([last_point]);
            }
            socket.emit('start_print', print_points, 0);
            if (this.printLable == "Print") {
                this.printLable = "Stop"
            } else {
                this.printLable = "Print"
            }
        },
        pause: function(event) {
            socket.emit('printer_pause_resume');
        },
        // functionality for the drawing thingy
        draw(e) {
            var pt = svg.createSVGPoint();  // Created once for document

            pt.x = e.clientX;
            pt.y = e.clientY;

            // The cursor point, translated into svg coordinates
            var cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());
            // console.log("(" + cursorpt.x + ", " + cursorpt.y + ")");

            this.points.push([cursorpt.x, cursorpt.y]);
            // this.points.push([e.offsetX, e.offsetY]);
            // this.drawPoints();
        },
        loadCircle(e, points = 10, radius = 50, center = [75,75]) {
            this.points = [];
            var slice = 2 * Math.PI / points;
            for (var i = 0; i < points; i++)
            {
                var angle = slice * i;
                var newX = Math.floor(center[0] + radius * Math.cos(angle));
                var newY = Math.floor(center[1] + radius * Math.sin(angle));
                var p = [newX, newY];
                this.points.push(p);
            }
        },
        shapeCloseOpen(e) {
            this.shapeOpen = !this.shapeOpen;
        },
        startDrag(e) {
            this.draggedElement = e.target;
        },
        drag(e) {
            var pt = svg.createSVGPoint();  // Created once for document

            pt.x = e.clientX;
            pt.y = e.clientY;

            // The cursor point, translated into svg coordinates
            var cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());
            // console.log("(" + cursorpt.x + ", " + cursorpt.y + ")");

            if(this.draggedElement != null) {
                this.points[this.draggedElement.id][0] = cursorpt.x;
                this.points[this.draggedElement.id][1] = cursorpt.y;
                // array needs to be destroyed and copied to triger the reactivity from vue
                this.points = this.points.slice();
            }
        },
        endDrag(e) {
            this.draggedElement = null;
        },
        emptyPoints(e) {
            this.points = [];
        }
    },
    created () {
        VueRangeSlider.methods.handleKeyup = ()=> console.log;
        VueRangeSlider.methods.handleKeydown = ()=> console.log;

        // fetch("https://api2.binance.com/api/v3/ticker/price", {
        //     "method": "GET",
        //     "headers": {}
        // })
        // .then(async response => {
        //     const data = await response.json();
        //     this.eth.current = data.filter(element => element.symbol == "ETHEUR")[0].price
        //     this.eth.last = this.eth.current
        //     console.log(this.eth)
        // })
        // .catch(err => {
        //     console.error(err);
        // });

        fetch("http://localhost:8888/sentiment", {
                    "method": "GET",
                    "headers": {}
        })
        .then(async response => {
            const data = await response.json();
            this.sentiment = data.sentiment
            this.toolpath_options.magnitude = Math.abs(data.sentiment)
            // data.length
            if (this.sentiment < 0) {
                this.toolpath_type = "SQUARE"
            } else {
                this.toolpath_type = "SINE"
            }
        })
        .catch(err => {
            console.error(err);
        });
    },
    mounted() {
        var svg = document.getElementById("svg");
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth
        })
    }
})