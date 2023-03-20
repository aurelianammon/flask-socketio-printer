# -*- coding: utf-8 -*-
"""
Name: Point Calculation Library
Description: all the neccessary functions to do the vector and point calculations.
"""

# importing numpy
import numpy as np

def point(x = 0, y = 0, z = 0):
    # definition of a point as an array
	return np.array([x, y, z])

def distance(a, b):
    # calculate the discance between twho points
    return np.linalg.norm(a - b)

def rotate(p, o=np.array([0, 0, 0]), degrees=0):
    # rotate a point around a center 'o' with an angle
    angle = np.deg2rad(degrees)
    R = np.array([[np.cos(angle), -np.sin(angle), 0],
                  [np.sin(angle), np.cos(angle), 0],
                  [0, 0, 0]])
    return np.squeeze((R @ (p.T-o.T) + o.T).T)

def perpendicular_2d(v):
    # calculate the perpendicular vector
    x = - v[1]
    y = v[0]
    return point(x, y)

def normalize(v):
    # normaliza a vector
    norm = np.linalg.norm(v)
    if norm == 0:
        return v
    return v / norm

def vector(a, b):
    # calculate a vector from two pionts
    return b - a

# Testing functions
if __name__ == "__main__":

    a = point(0, 50, 0)
    b = point(50, 50, 0)

    print(normalize(vector(a, b)))



