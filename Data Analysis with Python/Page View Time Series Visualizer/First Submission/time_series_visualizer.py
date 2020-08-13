import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()

# Import data (Make sure to parse dates. Consider setting index column to 'date'.)
df = pd.read_csv('fcc-forum-pageviews.csv').set_index('date')
df.index = [pd.Timestamp(dt) for dt in df.index]

# Clean data
df = df[
  (df['value'] >= df['value'].quantile(0.025)) &
  (df['value'] <= df['value'].quantile(0.975))
]

def draw_line_plot():
    # Draw line plot
    fig, ax = plt.subplots(1, 1)

    plt.plot(df.index, df['value'], color = 'crimson')

    plt.title('Daily freeCodeCamp Forum Page Views 5/2016-12/2019')
    plt.xlabel('Date')
    plt.ylabel('Page Views')

    fig.set_figwidth(15)
    fig.set_figheight(4.5)

    # Save image and return fig (don't change this part)
    fig.savefig('line_plot.png')
    return fig

def draw_bar_plot():
    # Copy and modify data for monthly bar plot
    df_bar = df.copy()

    df_bar['date'] = df_bar.index
    df_bar['month'] = df_bar['date'].map(lambda x: x.strftime('%B'))
    df_bar['year'] = df_bar['date'].map(lambda x: x.strftime('%Y'))
    df_bar = pd.DataFrame({
        'average':
        df_bar.groupby(['year', 'month'])['value'].mean()
    }).reset_index()
    df_bar = df_bar.sort_values(['year', 'month'])

    # Draw bar plot
    months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    fig, ax = plt.subplots(figsize=(20, 15))

    sns.barplot(
      x = 'year',
      y = 'average',
      hue = 'month',
      hue_order = months,
      palette = 'bright',
      data = df_bar
    )

    ax.set_ylabel('Average Page Views', fontsize = 20)
    ax.set_xlabel('Years', fontsize = 20)
    # Increase size of the ticks
    ax.tick_params(
      axis = 'both',
      labelsize = 18
    )
    # Legend position upper left --> 2
    ax.legend(
      loc = 2,
      fontsize = 20
    )
    # Rotate x label
    plt.xticks(
      rotation = 90,
      horizontalalignment = 'center'
    )

    # Save image and return fig (don't change this part)
    fig.savefig('bar_plot.png')
    return fig

def draw_box_plot():
    # Prepare data for box plots (this part is done!)
    df_box = df.copy()
    df_box['date'] = df_box.index
    df_box.reset_index(inplace=True)
    df_box['year'] = [d.year for d in df_box.date]
    df_box['month'] = [d.strftime('%b') for d in df_box.date]

    # Draw box plots (using Seaborn)
    df_box['numbered_month'] = [d.strftime('%m') for d in df_box.date]

    df_box = df_box.sort_values(by='numbered_month')

    fig, axes = plt.subplots(1, 2)
    fig.set_figwidth(25)
    fig.set_figheight(10)

    axes[0] = sns.boxplot(
      x = "year",
      y = "value",
      ax = axes[0],
      data = df_box
    )
    axes[1] = sns.boxplot(
      x = "month",
      y = "value",
      ax = axes[1],
      data = df_box
    )

    axes[0].set_title('Year-wise Box Plot (Trend)', fontsize = 20)
    axes[1].set_title('Month-wise Box Plot (Seasonality)', fontsize = 20)

    axes[0].set_xlabel('Year', fontsize = 20)
    axes[1].set_xlabel('Month', fontsize = 20)

    axes[0].set_ylabel('Page Views', fontsize = 20)
    axes[1].set_ylabel('Page Views', fontsize = 20)

    axes[0].tick_params(
      axis = 'both',
      labelsize = 18
    )
    axes[1].tick_params(
      axis = 'both',
      labelsize = 18
    )

    # Save image and return fig (don't change this part)
    fig.savefig('box_plot.png')
    return fig
