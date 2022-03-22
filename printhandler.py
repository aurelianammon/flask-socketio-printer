import time
import getopt
import sys
import getopt

from printrun.printcore import printcore
from printrun.pronsole import pronsole
from printrun import gcoder
from serial import SerialException



class DefaultUSBHandler:
    def __init__(self, port = None, baud = None):
        self.p = printcore()
        self.port = port
        self.baud = baud

        self.p.loud = True

    def connect(self, port = None, baud = None):
        if port is not None and baud is not None:
            self.p.connect(port, baud)
            print("connected to printer")
            return 1
        elif self.port is not None and self.baud is not None:
            self.p.connect(self.port, self.baud)
            print("connected to " + self.port)
            return 1
        else:
            print("not connected to printer")
            return 0

    def disconnect(self):
        self.p.disconnect()
        print("disconnceted from " + self.port)

    def send_now(self, data = None):
        if data:
            self.p.send_now(data)
        else:
            print("nothing to send")

    # needs a list of gcode strings as input        
    def send(self, data = None):
        if data and self.p.online and not self.p.printing:
            if type(data) is list:
                self.p.startprint(gcoder.LightGCode(data))
            else:
                self.p.startprint(gcoder.LightGCode([data]))
        elif data and self.p.online and self.p.printing:
            if type(data) is list:
                [self.p.send(line) for line in data]
            else:
                self.p.send(data)
        else:
            print("nothing to send")

    def status(self):
        #the remaining lines of the mainqueue
        remaining_lines = len(self.p.mainqueue.lines) - self.p.queueindex
        return([remaining_lines])

    def is_online(self):
        return(self.p.online)

    def is_printing(self):
        return(self.p.printing)

    def is_paused(self):
        return(self.p.paused)

    def pause(self):
        self.p.pause()
        print("print paused")

    def resume(self):
        self.p.resume()
        print("print resumed")

    def cancelprint(self):
        self.p.cancelprint()
        print("print canceld")


# Testing functions
if __name__ == "__main__":

    # printer credentials
    port = '/dev/tty.usbmodem14101'
    baud = 250000

    # setup
    print_handler = DefaultUSBHandler(port, baud)

    # main test
    print_handler.connect()
    while not print_handler.is_online(): time.sleep(0.01)
    data = ["G1 Z10", "G1 Z10", "G28", "G28", "G28"]
    print_handler.send(data)

    time_count = 0
    while print_handler.is_printing() or print_handler.is_paused():
        print(print_handler.status())
        time.sleep(1)
        if time_count == 5:
            print_handler.pause()
        if time_count == 3:
            print_handler.send("G1 Z10")
        if time_count == 10:
            print_handler.resume()
        time_count += 1
    print("ready")
    print_handler.disconnect()




# import requests

# url = "http://192.168.178.13/command"
# payload = "G28\n"
# headers = {"Content-Type": "text/plain"}
# response = requests.request("POST", url, data=payload, headers=headers)
# print(response.text)


# class ZMorphHandler:
#     def __init__(self, url = None):
#         self.url = url
#         self.connected = False
#     def connect(self, port = None, baud = None):
#         if port is not None and baud is not None:
#             self.p.connect(port, baud)
#             print("connected to printer")
#             return 1
#         elif self.port is not None and self.baud is not None:
#             self.p.connect(self.port, self.baud)
#             print("connected to " + self.port)
#             return 1
#         else:
#             print("not connected to printer")
#             return 0

#     def disconnect(self):
#         self.connected = False

#     def send_now(self, data = None):
#         if data:
#             self.p.send_now(data)
#         else:
#             print("nothing to send")

#     # needs a list of gcode strings as input        
#     def send(self, data = None):
#         if data and self.p.online and not self.p.printing:
#             if type(data) is list:
#                 self.p.startprint(gcoder.LightGCode(data))
#             else:
#                 self.p.startprint(gcoder.LightGCode([data]))
#         elif data and self.p.online and self.p.printing:
#             if type(data) is list:
#                 [self.p.send(line) for line in data]
#             else:
#                 self.p.send(data)
#         else:
#             print("nothing to send")

#     def status(self):
#         #the remaining lines of the mainqueue
#         remaining_lines = len(self.p.mainqueue.lines) - self.p.queueindex
#         return([remaining_lines])

#     def is_online(self):
#         return(self.p.online)

#     def is_printing(self):
#         return(self.p.printing)

#     def is_paused(self):
#         return(self.p.paused)

#     def pause(self):
#         self.p.pause()
#         print("print paused")

#     def resume(self):
#         self.p.resume()
#         print("print resumed")

#     def cancelprint(self):
#         self.p.cancelprint()
#         print("print canceld")













