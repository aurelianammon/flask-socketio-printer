const vm = new Vue({ // Again, vm is our Vue instance's name for consistency.
    el: '#vm',
    delimiters: ['[[', ']]'],
    components: {
        VueRangeSlider
    },
    data: {
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
            rasterisation: 0
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
        }
    },
    methods: {
        poll () {
            this.polling = setInterval(() => {
                this.slicer_options.feed_rate = this.slicer_options.feed_rate + 10
            }, 1 * 1000)
        },
        unpoll () {
            clearInterval(this.polling)
            this.polling = null
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
    }
})