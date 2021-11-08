# importing numpy
import numpy as np

# define point relevant functions
def point(x = 0, y = 0, z = 0):
	return np.array([x, y, z])

def distance(a, b):
    return np.linalg.norm(a - b)

def rotate(p, o=np.array([0, 0, 0]), degrees=0):
    angle = np.deg2rad(degrees)
    R = np.array([[np.cos(angle), -np.sin(angle), 0],
                  [np.sin(angle), np.cos(angle), 0],
                  [0, 0, 0]])
    return np.squeeze((R @ (p.T-o.T) + o.T).T)

def perpendicular_2d(v):
    x = - v[1]
    y = v[0]
    return point(x, y)

def normalize(v):
    norm = np.linalg.norm(v)
    if norm == 0:
        return v
    return v / norm

def vector(a, b):
    return b - a

# Testing functions
if __name__ == "__main__":

    a = point(0, 50, 0)
    b = point(50, 50, 0)

    print(normalize(vector(a, b)))



