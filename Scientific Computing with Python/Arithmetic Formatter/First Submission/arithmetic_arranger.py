import re

def arithmetic_arranger(problems, show = False):
  arranged_problems = ""
  newText = ["", "", "", ""]
  response = ""
  error = False

  if len(problems) > 5:
    error = True
    arranged_problems = "Error: Too many problems."
  else:
    index = 0
    for item in problems:
      separated = re.split("\s", item)
      length = 0
      i = 0

      for elem in separated:
        if elem.isdecimal():
          if len(elem) > 4:
            error = True
            arranged_problems = "Error: Numbers cannot be more than four digits."
          elif len(elem) > length:
            length = len(elem)
        elif elem.isdecimal() == False and i == 1 and (elem != '+' and elem != '-'):
          error = True
          arranged_problems = "Error: Operator must be '+' or '-'."
        elif elem.isdecimal() == False and (i == 0 or i == 2):
          error = True
          arranged_problems = "Error: Numbers must only contain digits."
        i += 1
      
      newText[0] += " " * (length + 2 - len(separated[0])) + separated[0]
      newText[1] += separated[1] + " " * (length + 1 - len(separated[2])) + separated[2]
      newText[2] += "-" * (length+2)

      if error == False:
        answer = str(eval(problems[index]))
        newText[3] += " " * (length + 2 - len(answer)) + answer

        if index == len(problems) - 1:
          newText[0] += "\n"
          newText[1] += "\n"
        else:
          newText[0] += " " * 4
          newText[1] += " " * 4
          newText[2] += " " * 4
          newText[3] += " " * 4

      index += 1

  response = newText[0] + newText[1] + newText[2] 
  
  if show:
    response += "\n" + newText[3]
  
  if error:
    print(arranged_problems)
    return arranged_problems
  else:
    print(response)
    return response