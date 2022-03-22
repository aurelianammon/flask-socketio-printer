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
        sentiment: 0,
        lenght: 0,
        polling: null,
        layer: 0,
        connected: false,
        port: '/dev/tty.usbmodem14101',
        log_text: "some random text and even more",
        value: 1,
        slicer_options: {
            extrusion_rate: 0,
            feed_rate: 0,
            layer_hight: 0
        },
        toolpath_options: {
            magnitude: 0,
            wave_lenght: 0,
            rasterisation: 0,
            diameter: 0
        },
        toolpath_type: "NONE"
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
        }
    },
    computed: {
        isPrinting: function () {
          return this.polling != null
        },
        printLable: function() {
            if (this.isPrinting) {
                return "Stop"
            } else {
                return "Print"
            }
        }
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
                socket.emit('printer_connect');
            } else {
                socket.emit('printer_disconnect');
            }
        },
        setup: function(event) {
            socket.emit('printer_setup');
        },
        print: function(event) {
            socket.emit('start_print');
            if (this.isPrinting) {
                this.unpoll()
            } else {
                this.poll()
            }
        },
        pause: function(event) {
            socket.emit('printer_pause_resume');
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
    }
})