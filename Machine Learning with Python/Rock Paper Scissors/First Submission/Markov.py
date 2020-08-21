# More advanced Markov Chain with different strategies
# Thanks to Piotr Gabrys for this code and explanaition on how it works
import random
import itertools

beat = {'R': 'P', 'P': 'S', 'S': 'R'}

# score_memory: represent at which rate the Markov Chain forgets
class MarkovChain():
  def __init__(self, type, beat, level, memory, score = 0, score_memory = 0.9):
    self.type = type
    self.matrix = self.create_matrix(beat, level, memory)
    self.memory = memory
    self.level = level
    self.beat = beat
    self.score = score
    self.score_memory = score_memory
    self.prediction = ''
    self.name = 'level: {}, memory: {}'.format(self.level, self.memory)
    self.last_updated_key = ''

  @staticmethod
  def create_matrix(beat, level, memory):
    def create_keys(beat, level):
      keys = list(beat)

      if level > 1:
        for i in range(level - 1):
          key_len = len(keys)

          for i in itertools.product(keys, ''.join(beat)):
            keys.append(''.join(i))
          
          keys = keys[key_len:]

      return keys
    
    keys = create_keys(beat, level)
    matrix = {}

    for key in keys:
      matrix[key] = {
        'R': 3 / (1 - memory) /3,
        'P': 3 / (1 - memory) /3,
        'S': 3 / (1 - memory) /3
      }
    
    return matrix

  def update_matrix(self, key_lagged, response):
    for key in self.matrix[key_lagged]:
      self.matrix[key_lagged][key] = self.memory * self.matrix[key_lagged][key]
    
    self.matrix[key_lagged][response] += 1
    self.last_updated_key = key_lagged

  def update_score(self, inp, out):
    if self.beat[out] == inp:
      self.score = self.score * self.score_memory - 1
    elif out == inp:
      self.score = self.score * self.score_memory
    else:
      self.score = self.score * self.score_memory + 1
  
  def predict(self, key_current):
    probs = self.matrix[key_current]

    if max(probs.values()) == min(probs.values()):
      self.prediction = random.choice(list(beat.keys()))
    else:
      self.prediction = max([(i[1], i[0]) for i in probs.items()])[1]

    if self.type == 'input_oriented':
      return self.prediction
    elif self.type == 'output_oriented':
      return self.beat[self.prediction]

class Ensembler():
  def __init__(self, type, beat, min_score = -10, score = 0, score_memory = 0.9):
    self.type = type
    self.matrix = { i: 0 for i in beat}
    self.beat = beat
    self.min_score = min_score
    self.score = score
    self.score_memory = score_memory
    self.prediction = ''

  def update_score(self, inp, out):
    if self.beat[out] == inp:
      self.score = self.score * self.score_memory - 1
    elif out == inp:
      self.score = self.score * self.score_memory
    else:
      self.score = self.score * self.score_memory + 1
  
  def update_matrix(self, pred_dict, pred_score):
    norm_dict = {key: pred_dict[key] / sum(pred_dict.values()) for key in pred_dict}

    for key in self.matrix:
      if pred_score >= self.min_score:
        self.matrix[key] = self.matrix[key] + pred_score * norm_dict[key]

  def predict(self):
    if max(self.matrix.values()) == min(self.matrix.values()):
      self.prediction = random.choice(list(beat.keys()))
    else:
      self.prediction = max([(i[1], i[0]) for i in self.matrix.items()])[1]
    
    return self.prediction

class History():
  def __init__(self):
    self.history = ''
  
  def history_collector(self, inp, out):
    self.history = self.history + inp
    self.history = self.history + out

    if len(self.history) > 10:
      self.history = self.history[10:]
  
  def create_keys(self, level):
    return self.history[-level:]

  def create_keys_history(self, level):
    key_history = self.history[-level -2: -1]
    inp_latest = self.history[-2]
    out_latest = self.history[-1]

    return key_history, inp_latest, out_latest

#Initialisation
history = History()
memory = [0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.975, 0.987, 0.99]
level = [1, 2, 3, 4]
ensemble_min_score = [5]
models_inp = [MarkovChain('input_oriented', beat, i[0], i[1]) for i in itertools.product(level, memory)]
models_out = [MarkovChain('output_oriented', beat, i[0], i[1]) for i in itertools.product(level, memory)]
models_ens = [Ensembler('ensemble', beat, i) for i in ensemble_min_score]
models = models_inp + models_out + models_ens
output = random.choice(list(beat.keys()))

def player(input, hist = []):
  global history
  global emory
  global level
  global models_inp
  global models_out
  global models_ens
  global models
  global output

  if input == '':
    output = random.choice(list(beat.keys()))

    history = History()

    memory = [0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.975, 0.987, 0.99]
    level = [1]

    models_inp = [MarkovChain('input_oriented', beat, i[0], i[1]) for i in itertools.product(level, memory)]
    models_out = [MarkovChain('output_oriented', beat, i[0], i[1]) for i in itertools.product(level, memory)]
    models_ens = [Ensembler('ensemble', beat, i) for i in ensemble_min_score]

    models = models_inp + models_out

  elif len(history.history) == 10:
    history.history_collector(input, output)
    max_score = 0

    for model in models:
      if model.type in ('input_oriented', 'output_oriented'):
        key_history, inp_latest, out_latest = history.create_keys_history(model.level)
        key_current = history.create_keys(model.level)

      if model.prediction != '':
        model.update_score(input, beat[model.prediction])

      if model.type == 'input_oriented':
        model.update_matrix(key_history, inp_latest)
      elif model.type == 'output_oriented':
        model.update_matrix(key_history, out_latest)
      else:
        for mod in models:
          if mod.type in ('input_oriented', 'output_oriented'):
            model.update_matrix(mod.matrix[mod.last_updated_key], model.score)
      
      if model.type in ('input_oriented', 'output_oriented'):
        predicted_input = model.predict(key_current)
      elif model.type == 'ensemble':
        predicted_input = model.predict()

      if model.score > max_score:
        max_score = model.score
        output = beat[predicted_input]
    
    if max_score < 1:
      output = random.choice(list(beat.keys()))
  
  else:
    history.history_collector(input, output)
    output = random.choice(list(beat.keys()))
  
  return output