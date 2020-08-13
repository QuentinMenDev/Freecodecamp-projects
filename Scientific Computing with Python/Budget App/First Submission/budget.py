import math
class Category:
  def __init__(self, category):
    self.name = category
    self.ledger = []
    self.funds = 0

  def deposit(self, amount, description = ""):
    self.ledger.append({"amount": amount, "description": description})
    self.funds += amount

  def withdraw(self, amount, description = ""):
    if self.check_funds(amount):
      self.ledger.append({"amount": -amount, "description": description})
      self.funds -= amount
      return True
    else:
      return False

  def get_balance(self):
    return self.funds

  def transfer(self, amount, category):
    if self.check_funds(amount):
      self.ledger.append({"amount": -amount, "description": "Transfer to " + category.name})
      self.funds -= amount

      newTxt = "Transfer from " + self.name
      category.deposit(amount, newTxt)
      return True
    else:
      return False
  
  def check_funds(self, amount):
    if self.funds - amount >= 0:
      return True
    else:
      return False

  def __str__(self):
    text = ""
    txtLength = len(self.name)
    if txtLength % 2 == 0:
      text = "*" * int(15 - txtLength/2) + self.name + "*" * int(15 - txtLength/2) + "\n"
    else:
      text = "*" * (15 - math.floor(txtLength/2)) + self.name + "*" * (15 - math.ceil(txtLength/2)) + "\n"
    
    for entry in self.ledger:
      description = entry["description"]
      amount = entry["amount"]
      # Creation of the decription column, always 23 characters wide
      if len(description) > 23:
        text += description[0:23]
      else:
        text += description + " " * int(23 - len(description))

      # Creation of the amount column, always 7 characters wide
      amountTxt = str(format(amount, '.2f'))
      if len(amountTxt) > 7:
        text += amountTxt[len(amountTxt) - 8:len(amountTxt)-1] + "\n"
      else:
        text += " " * int(7 - len(amountTxt)) + amountTxt + "\n"
      
    # Creation of the total
    text += "Total: " + str(self.funds)

    return text


def create_spend_chart(categories):
  data = []
  total = 0
  for elem in categories:
    fullAmount = 0
    for entry in elem.ledger:
      if entry["amount"] < 0:
        fullAmount += entry["amount"] * 100
        total += entry["amount"] * 100

    data.append(fullAmount)
  
  pourcentages = []
  for item in data:
    pourcentages.append(int(math.floor((item*100/total)/10)) * 10)

  text = "Percentage spent by category\n"

  for i in range(0, 101, 10):
    if i == 0:
      text += "100| "
    elif i == 100:
      text += "  0| "
    else:
      text += " " + str(100 - i) + "| "

    for elem in pourcentages:
      if elem >= 100 - i:
        text += "o" + "  "
      else:
        text += "   "
    text += "\n"
  text += "    ----------\n"

  titles = []
  maxLength = 0
  for elem in categories:
    titles.append(elem.name)
    if len(elem.name) > maxLength:
      maxLength = len(elem.name)
  
  for count in range(0, maxLength, 1):
    text += " " * 5

    for title in titles:
      if count < len(title):
        text += title[count] + "  "
      else:
        text += "   "
    
    if count < maxLength - 1:
      text += "\n"

  return text