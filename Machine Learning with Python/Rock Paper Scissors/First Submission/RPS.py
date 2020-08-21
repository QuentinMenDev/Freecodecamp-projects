# The example function below keeps track of the opponent's history and plays whatever the opponent played two plays ago. It is not a very good player so you will need to change the code to pass the challenge.

# Note: This is a discret Markov Chain type of problem. This method would bring up to a 70% win rate!
# Need to make morethan 1 strategy!

# It is not more than 60% all the time but it's at least 55% win rate for each!
import random

# The different states
states = ["R", "P", "S"]
beat = {'R': 'P', 'P': 'S', 'S': 'R'}

# Appearance Matrix
probabilities = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

# Score of each model:
scores = {
  "markov": 0,
  "markovBis": 0,
  "logic": 0,
  "prev_play": 0
}

predictions = {
  "markov": "",
  "markovBis": "",
  "logic": "",
  "prev_play": ""
}

prev_output = ''

def player(prev_play, history=[]):
  global scores, predictions, prev_output

  if prev_play == "":
    scores = {
      "markov": 0,
      "markovBis": 0,
      "logic": 0,
      "prev_play": 0
    }

    predictions = {
      "markov": states[random.randint(0, 2)],
      "markovBis": states[random.randint(0, 2)],
      "logic": states[random.randint(0, 2)],
      "prev_play": states[random.randint(0, 2)]
    }

    prev_output = ''
    history = []

  if prev_play != "":
    history.append(prev_play)
  
  if len(history) <= 2:
    prev_output = states[random.randint(0, 2)]
    return prev_output

  # Update appearance Matrix
  probabilities[states.index(history[-2])][states.index(history[-1])] += 1

  # Update the score of each model
  # Markov
  if prev_play == predictions["markov"]:
    scores["markov"] = scores["markov"] + 1
  elif prev_play == beat[predictions["markov"]]:
    scores["markov"] = scores["markov"]
  else:
    scores["markov"] = scores["markov"] - 1
  
  # Markov second stage
  if prev_play == predictions["markovBis"]:
    scores["markovBis"] = scores["markovBis"] + 1
  elif prev_play == beat[predictions["markovBis"]]:
    scores["markovBis"] = scores["markovBis"]
  else:
    scores["markovBis"] = scores["markovBis"] - 1
  
  # Logic
  if prev_play == predictions["logic"]:
    scores["logic"] = scores["logic"] + 1
  elif prev_play == beat[predictions["logic"]]:
    scores["logic"] = scores["logic"]
  else:
    scores["logic"] = scores["logic"] - 1

  # Previous play
  if prev_play == predictions["prev_play"]:
    scores["prev_play"] = scores["prev_play"] + 1
  elif prev_play == beat[predictions["prev_play"]]:
    scores["prev_play"] = scores["prev_play"]
  else:
    scores["prev_play"] = scores["prev_play"] - 1

  # Check which model is the best for now
  best_model = "markov"
  best_score = 0
  for score in scores:
    if scores[score] > best_score:
      best_score = scores[score]
      best_model = score

  # debugging
  if len(history) % 10000 == 0:
    print(scores)

  # Simple Markov Chain prediction
  i = 0
  prediction = 0

  # We predict what will be used depending on the number of occurences saved in the appearance matrix
  while i < 3:
    if probabilities[states.index(history[-1])][i] > probabilities[states.index(history[-1])][prediction]:
      prediction = i
    i += 1

  # We find what counter the prediction and send the result
  predictions['markov'] = states[prediction]

  # We find what counter counter the prediction and send the result
  predictions['markovBis'] = beat[states[prediction]]

  # Strategy to beat kris
  predictions["prev_play"] = beat[prev_output]

  # Logic prediction
  if prev_play == predictions["logic"]:
    predictions['logic'] = prev_output
  elif prev_play == prev_output:
    predictions['logic'] = states[random.randint(0, 2)]
  else:
    predictions['logic'] = prev_play

  prev_output = beat[predictions[best_model]]
  return prev_output
