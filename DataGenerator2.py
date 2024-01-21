import math
import pygame as py
import time
import random

data = []

def withinBounds(pos, boundsX, boundsY, extra=False):
    if 0 < pos[0] < boundsX and 0 < pos[1] < boundsY:
        return True
    elif extra == True:
        return 0 < pos[0] < boundsX, 0 < pos[1] < boundsY
    return False

class Mouse:

    def __init__(self, boundsX, boundsY):
        self.boundsX = boundsX
        self.boundsY = boundsY
        
        self.pos = [100,100]
        self.vector = [0,0]
        self.steps = 0
        
        self.idleTimer = 0

    def idle(self):
        self.idleTimer -= 1

    def newGoal(self):
        goal = [random.randint(1,self.boundsX-1), random.randint(1,self.boundsY-1)]
        distance = [goal[0] - self.pos[0], goal[1] - self.pos[1]]
        self.steps = 100
        self.vector = [distance[0]//100, distance[1]//100]

    def move(self):
        self.pos = [self.pos[0] + self.vector[0], self.pos[1] + self.vector[1]]
        self.steps -= 1

    def do(self):
        if self.idleTimer <= 0 and self.steps <= 0:
            if random.randint(0,1) == 0:
                self.idleTimer = 100 + random.randint(0, 100)
            else:
                self.newGoal()
        if self.idleTimer > 0:
            self.idle()
        else:
            self.move()

class Cat:

    def __init__(self, boundsX, boundsY):
        self.boundsX = boundsX
        self.boundsY = boundsY

        self.pos = [300,300]
        self.vector = [0,0]

        self.state = 0
        self.direction = 0
        self.score = 0

        self.timer = 0

    def setMove(self):
        if self.state == 2 or self.state == 3:
            self.vector[0] = 0
            self.vector[1] = 0
            return
        if self.state == 0:
            if self.direction == 0:
                self.vector[0] = -4
                self.vector[1] = -3
            elif self.direction == 1:
                self.vector[0] = 4
                self.vector[1] = -3
            elif self.direction == 2:
                self.vector[0] = -4
                self.vector[1] = 3
            elif self.direction == 3:
                self.vector[0] = 4
                self.vector[1] = 3
        if self.state == 1:
            if self.direction == 0:
                self.vector[0] = -8
                self.vector[1] = -5
            elif self.direction == 1:
                self.vector[0] = 8
                self.vector[1] = -5
            elif self.direction == 2:
                self.vector[0] = -8
                self.vector[1] = 5
            elif self.direction == 3:
                self.vector[0] = 8
                self.vector[1] = 5

    def move(self):
        newpos = [self.pos[0] + self.vector[0], self.pos[1] + self.vector[1]]
        if withinBounds(newpos, self.boundsX, self.boundsY):
            self.pos = newpos
        else:
            # bounce when an edge is hit
            x,y = withinBounds(newpos, self.boundsX, self.boundsY, extra=True)
            if not x:
                self.vector[0] *= -1
            if not y:
                self.vector[1] *= -1
            self.pos = newpos
        self.timer -= 1

    def choose(self):
        self.state = random.randint(0,3)
        self.direction = random.randint(0,3)
        self.setMove()

    def do(self, mouse):
        global data
        if self.timer <= 0:
            self.timer = 500
            self.choose()
            if data:
                data[-1]["output"] = self.score
            data.append({"input":[mouse[0] - self.pos[0], mouse[1] - self.pos[1], self.state, self.direction],"output":0})
            self.score = 0

        self.move()
        self.score += int(math.sqrt((mouse[0] - self.pos[0])**2 + (mouse[1] - self.pos[1])**2))
        
        

def writeToFile(data):
    asString = "input,output\n"
    for elt in data:
        inputAsString = str(elt['input']).replace(" ", "")
        asString += f"{inputAsString},{elt['output']}\n"
    with open("All_Data.txt","w") as f:
        f.writelines(asString)

def runGraphic():
    global data
    boundsX = 600
    boundsY = 500
    iterations = 10000
    py.init()
    win = py.display.set_caption("visualizer")
    win = py.display.set_mode((boundsX, boundsY))
    
    mouse = Mouse(boundsX,boundsY)
    cat = Cat(boundsX,boundsY)
    
    for i in range(0, iterations):
        win.fill((255,255,255))
        cat.do(mouse.pos)
        py.draw.circle(win, (255,0,0), cat.pos, 20)
        mouse.do()
        py.draw.circle(win, (0,0,255), mouse.pos, 20)
        py.display.update()
    data = data[:-1]
    writeToFile(data)

def run():
    global data
    boundsX = 600
    boundsY = 500
    iterations = 10000
    
    mouse = Mouse(boundsX,boundsY)
    cat = Cat(boundsX,boundsY)
    
    for i in range(0, iterations):
        cat.do(mouse.pos)
        mouse.do()
    data = data[:-1]
    writeToFile(data)

run()
