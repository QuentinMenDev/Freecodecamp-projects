import math
class Rectangle:
  def __init__(self, width, height = 0):
    self.width = width
    if height == 0:
      self.height = width
    else:
      self.height = height
  
  def set_width(self, width):
    self.width = width
  
  def set_height(self, height):
    self.height = height
  
  def get_area(self):
    return self.width * self.height
  
  def get_perimeter(self):
    return 2*self.width + 2*self.height
  
  def get_diagonal(self):
    return (self.width ** 2 + self.height ** 2) ** 0.5

  def get_picture(self):
    if self.width > 50:
      return "Too big for picture."
    elif self.height > 50:
      return "Too big for picture."
    else:
      text = "*" * self.width + "\n"

      for row in range(0, self.height - 1):
        text += "*" * self.width + "\n"

      return text
  def get_amount_inside(self, shape):

    return math.floor(self.width/shape.width) * math.floor(self.height/shape.height)

  def __str__(self):
    return "Rectangle(width=" + str(self.width) + ", height=" + str(self.height) + ")"


class Square(Rectangle):
  def set_side(self, side):
    self.width = side
    self.height = side

  def set_width(self, width):
    self.width = width
    self.height = width

  def set_height(self, height):
    self.width = height
    self.height = height

  def __str__(self):
    return "Square(side=" + str(self.width) + ")"
  
