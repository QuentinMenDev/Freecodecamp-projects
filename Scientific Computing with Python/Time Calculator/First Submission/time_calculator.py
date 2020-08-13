import re
import math

def add_time(start, duration, startDay = ""):
  time = re.split(":", re.split("\s", start)[0])
  meridiem = re.split("\s", start)[1]
  period = re.split(":", duration)
  dayList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  
  twelves = 0
  days = 0
  newMeridiem = "AM"

  answer = ""

  newTime = [
    int(time[0]) + int(period[0]),
    int(time[1]) + int(period[1])
  ]

  # We check if the minutes are above 60. If so, we add 1 to the hours
  if newTime[1] >= 60:
    newTime[0] += 1
    newTime[1] -= 60
  
  # We check if the hours are above 12. If so, we count how many times it did so and calculate how many days it represents
  if newTime[0] >= 12:
    twelves = math.floor(newTime[0] / 12)
    newTime[0] -= twelves * 12

    if newTime[0] == 0:
      newTime[0] = 12
  
  # We add the missing 1 if the start time was in PM
  if meridiem == "PM":
    twelves += 1
  
  # We find if the new time is AM or PM
  if twelves % 2 == 1:
    newMeridiem = "PM"

  # We find how many days have passed
  days = math.floor(twelves / 2)

  newMinute = ""
  
  if newTime[1] < 10:
    newMinute = "0" + str(newTime[1])
  else:
    newMinute = str(newTime[1])

  answer = str(newTime[0]) + ":" + newMinute + " " + newMeridiem

  # We check which day it is if a startDay as been passed
  if startDay != "":
    cleanDay = startDay.lower().capitalize()
    i = 0
    dayNbr = 0
    for day in dayList:
      if day == cleanDay:
        dayNbr = i
        break
      i += 1
    
    answer += ", " + dayList[(dayNbr + days)%7]


  if days == 1:
    answer += " (next day)"
  elif days > 1:
    answer += " (" + str(days) + " days later)"

  return answer