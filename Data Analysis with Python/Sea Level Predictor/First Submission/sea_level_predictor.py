import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress

def draw_plot():
    # Read data from file
    df = pd.read_csv('epa-sea-level.csv')

    # Create scatter plot
    fig, ax = plt.subplots(1, 1)
    plt.scatter(x = df['Year'], y = df['CSIRO Adjusted Sea Level'])

    # Create first line of best fit
    year_prediction = 2050
    slope, intercept, r_value, p_value, std_err = linregress(df['Year'], df['CSIRO Adjusted Sea Level'])

    df_prediction = df[['Year', 'CSIRO Adjusted Sea Level']].copy()

    for i in range(df_prediction['Year'].max() + 1, year_prediction):
      df_prediction = df_prediction.append(
        {
          'Year': i,
          'CSIRO Adjusted Sea Level': intercept + slope * i
        },
        ignore_index=True
      )

    plt.plot(
        df_prediction['Year'],
        intercept + slope * df_prediction['Year'],
        'tab:blue',
        label='Prediction 1880-2050')
    plt.legend()

    # Create second line of best fit
    df2 = df[df['Year'] >= 2000]

    slope2, intercept2, r_value2, p_value2, std_err2 = linregress(df2['Year'], df2['CSIRO Adjusted Sea Level'])

    df_prediction2 = df2[['Year', 'CSIRO Adjusted Sea Level']].copy()

    for i in range(df_prediction2['Year'].max() + 1, year_prediction):
      df_prediction2 = df_prediction2.append(
        {
          'Year': i,
          'CSIRO Adjusted Sea Level': intercept2 + slope2 * i
        },
        ignore_index=True
      )

    plt.plot(
        df_prediction2['Year'],
        intercept2 + slope2 * df_prediction2['Year'],
        'tab:red',
        label='Prediction 2000-2050')
    plt.legend()

    # Add labels and title
    plt.title('Rise in Sea Level')
    plt.xlabel('Year')
    plt.ylabel('Sea Level (inches)')
    
    # Save plot and return data for testing (DO NOT MODIFY)
    plt.savefig('sea_level_plot.png')
    return plt.gca()