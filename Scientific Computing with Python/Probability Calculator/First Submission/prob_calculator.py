import copy
import random
# Consider using the modules imported above.

class Hat:
  def __init__(self, **args):
    self.contents = []
    for elem in args:
      for count in range(0, args[elem]):
        self.contents.append(elem)
    self.newHat = self.contents
  
  def draw(self, nbr):
    if nbr >= len(self.contents):
      return self.contents
    else:
      draw = []
      self.newHat = copy.copy(self.contents)
      for count in range(0, nbr):
        rnd = random.randrange(len(self.contents))
        draw.append(self.contents[rnd])
        del self.contents[rnd]
      
      return draw
  
  def reset(self):
    self.contents = self.newHat




def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
  success = 0
  for exp in range(0, num_experiments):
    draw = hat.draw(num_balls_drawn)

    index = 0
    for item in expected_balls:
      if item in draw:
        count = 0
        for elem in draw:
          if elem == item:
            count += 1
        if count >= expected_balls[item]:
          index += 1
    if index == len(expected_balls):
      success += 1

    hat.reset()

  return success / num_experiments