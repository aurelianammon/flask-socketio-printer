import time
import getopt
import sys
import getopt

import math

# import custom classes
import point_calc as pc
import numpy as np

class Shapehandler:
    def __init__(self):
        self.params_toolpath = {
            "magnitude": 2,
            "wave_lenght": 8,
            "rasterisation": 40
        }

    # default test shape
    def create_test(self, factor = 0):
        diameter = 50
        number_of_points = 4
        center = pc.point(50, 50, 0)
        radius = math.sqrt(pow(diameter, 2) + pow(diameter, 2)) / 2
        rotation = math.pi / number_of_points + math.pi / 180 * factor

        points = []

        i = 0
        while i < number_of_points:
            x = center[0] + radius * math.cos(2 * math.pi * i / number_of_points + rotation)
            y = center[1] + radius * math.sin(2 * math.pi * i / number_of_points + rotation)
            z = 0
            points.append(pc.point(round(x, 5), round(y, 5), round(z, 5)))
            i += 1

        return points

    # stepover test shape
    def create_stepover(self, angle = 0, stepover_parameter = 10):
        diameter = 50
        center = pc.point(100, 100, 0)

        points = []

        # first line
        x = center[0] - diameter / 2
        y = center[1] - diameter / 2
        z = 0
        points.append(pc.point(round(x, 5), round(y, 5), round(z, 5)))

        x = points[-1][0] + diameter
        y = points[-1][1]
        z = 0
        points.append(pc.point(round(x, 5), round(y, 5), round(z, 5)))

        for i in range(stepover_parameter):
            x = points[-1][0]
            y = points[-1][1] + (diameter/stepover_parameter)
            z = 0
            points.append(pc.point(round(x, 5), round(y, 5), round(z, 5)))

            if (i % 2) == 0:
                x = points[-1][0] - diameter
                y = points[-1][1]
                z = 0
                points.append(pc.point(round(x, 5), round(y, 5), round(z, 5)))
            else:
                x = points[-1][0] + diameter
                y = points[-1][1]
                z = 0
                points.append(pc.point(round(x, 5), round(y, 5), round(z, 5)))

        for i in range(len(points)):
            points[i] = pc.rotate(points[i], center, angle)

        return points
        # return points

    def rotate(self, points, center, angle):
        for i in range(len(points)):
            points[i] = pc.rotate(points[i], center, angle)

        return points

    def toolpath(self, points, shape = "NONE"):

        step_length = self.params_toolpath["wave_lenght"] / self.params_toolpath["rasterisation"]
        rotation = 360 / self.params_toolpath["rasterisation"]

        global_count = 0
        
        new_points = []

        for i in range(len(points) - 1):

            point = points[i]
            point_next = points[(i + 1) % (len(points))]
            distance = pc.distance(point, point_next)
            direction = pc.normalize(pc.vector(point, point_next))
            perpendicular_direction = pc.normalize(pc.perpendicular_2d(direction))

            scope_count = 0
            while (scope_count * step_length) <= distance:
                new_point = None

                # define the different wave shapes
                if (shape == "NONE"):
                    new_point = point + scope_count * step_length * direction
                elif (shape == "SINE"):
                    new_point = point + scope_count * step_length * direction + perpendicular_direction * math.sin(global_count) * self.params_toolpath["magnitude"]
                elif (shape == "SQUARE"):
                    sign = lambda a: 1 if a>0 else -1 if a<0 else 0
                    new_point = point + scope_count * step_length * direction + perpendicular_direction * sign(math.sin(global_count)) * self.params_toolpath["magnitude"]
                elif (shape == "SAW"):
                    saw_wave = lambda a: (1 / math.pi) * (a%(2*math.pi)) - 1
                    new_point = point + scope_count * step_length * direction + perpendicular_direction * saw_wave(global_count) * self.params_toolpath["magnitude"]
                # experimental saw wave function
                elif (shape == "EXPERIMENTAL"):
                    k = np.arange(1, 100)
                    factor = np.sum(np.sin(2 * np.pi * k * global_count)/k)
                    new_point = point + scope_count * step_length * direction + perpendicular_direction * factor * self.params_toolpath["magnitude"]

                new_points.append(new_point)
                global_count = global_count + math.radians(rotation)
                scope_count = scope_count + 1
        
        return new_points