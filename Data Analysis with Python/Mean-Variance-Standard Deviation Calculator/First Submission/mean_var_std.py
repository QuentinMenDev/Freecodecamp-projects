import numpy as np

def calculate(list):
  try:
    arr = np.array(list).reshape((3, 3))
  except ValueError:
    raise ValueError("List must contain nine numbers.")

  ##################################################################
  # This can be shortened into 1 loop but would be less readable.  #
  # calculation = {                                                #
  #   "mean": [[], [], 0],                                         #
  #   "variance": [[], [], 0],                                     #
  #   "standard deviation": [[], [], 0],                           #
  #   "max": [[], [], 0],                                          #
  #   "min": [[], [], 0],                                          #
  #   "sum": [[], [], 0]                                           #
  # }                                                              #
  #                                                                #
  # for i in range(0, len(arr)):                                   #
  #   calculation["mean"][0].append(arr[:, i].mean())              # 
  #   calculation["mean"][1].append(arr[:, i].mean())              #
  #   calculation["variance"][0].append(arr[:, i].var())           #
  #   calculation["variance"][1].append(arr[:, i].var())           #
  #   calculation["standard deviation"][0].append(arr[:, i].std()) #
  #   calculation["standard deviation"][1].append(arr[:, i].std()) #
  #   calculation["max"][0].append(arr[:, i].max())                #
  #   calculation["max"][1].append(arr[:, i].max())                #
  #   calculation["min"][0].append(arr[:, i].min())                #
  #   calculation["min"][1].append(arr[:, i].min())                #
  #   calculation["sum"][0].append(arr[:, i].sum())                #
  #   calculation["sum"][1].append(arr[:, i].sum())                #
  # calculation["mean"][2] = arr.mean())                           #
  # calculation["variance"][2] = arr.var())                        #
  # calculation["standard deviation"][2] = arr.std())              #
  # calculation["max"][2] = arr.max())                             #
  # calculation["min"][2] = arr.min())                             #
  # calculation["sum"][2] = arr.sum())                             #
  #                                                                #
  # return calculation                                             #
  ##################################################################

  # Calculation of the means
  means = [[], [], 0]
  for i in range(0, len(arr)):
    means[0].append(arr[:, i].mean())
    means[1].append(arr[i].mean())
  means[2] = arr.mean()

  # Calculation of the variance
  variances = [[], [], 0]
  for i in range(0, len(arr)):
    variances[0].append(arr[:, i].var())
    variances[1].append(arr[i].var())
  variances[2] = arr.var()

  # Calculation of the standard deviation
  stds = [[], [], 0]
  for i in range(0, len(arr)):
    stds[0].append(arr[:, i].std())
    stds[1].append(arr[i].std())
  stds[2] = arr.std()

  # Calculation of the maximum
  maxs = [[], [], 0]
  for i in range(0, len(arr)):
    maxs[0].append(arr[:, i].max())
    maxs[1].append(arr[i].max())
  maxs[2] = arr.max()

  # Calculation of the minimum
  mins = [[], [], 0]
  for i in range(0, len(arr)):
    mins[0].append(arr[:, i].min())
    mins[1].append(arr[i].min())
  mins[2] = arr.min()

  # Calculation of the sum
  sums = [[], [], 0]
  for i in range(0, len(arr)):
    sums[0].append(arr[:, i].sum())
    sums[1].append(arr[i].sum())
  sums[2] = arr.sum()

  dictToReturn = {
    "mean": means,
    "variance": variances,
    "standard deviation": stds,
    "max": maxs,
    "min": mins,
    "sum": sums
  }

  return dictToReturn