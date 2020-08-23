# import libraries (you may add additional imports but you may not have to)
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
import matplotlib.pyplot as plt

# get data files
!wget https://cdn.freecodecamp.org/project-data/books/book-crossings.zip

!unzip book-crossings.zip

books_filename = 'BX-Books.csv'
ratings_filename = 'BX-Book-Ratings.csv'

# import csv data into dataframes
df_books = pd.read_csv(
  books_filename,
  encoding = "ISO-8859-1",
  sep=";",
  header=0,
  names=['isbn', 'title', 'author'],
  usecols=['isbn', 'title', 'author'],
  dtype={'isbn': 'str', 'title': 'str', 'author': 'str'})

df_ratings = pd.read_csv(
  ratings_filename,
  encoding = "ISO-8859-1",
  sep=";",
  header=0,
  names=['user', 'isbn', 'rating'],
  usecols=['user', 'isbn', 'rating'],
  dtype={'user': 'int32', 'isbn': 'str', 'rating': 'float32'})

# add your code here - consider creating a new cell for each section of code
# Thanks Susan Li for a great code explanation
# https://datascienceplus.com/building-a-book-recommender-system-the-basics-knn-and-matrix-factorization/
# 1- Find the average rating and the number of rating each book has.
average_rating = pd.DataFrame(df_ratings.groupby('isbn')['rating'].mean())
average_rating['ratingCount'] = pd.DataFrame(df_ratings.groupby('isbn')['rating'].count())
average_rating.sort_values('ratingCount', ascending=False).head()

# 2- To ensure statistical significance, use the proposed seletion values: users with less than 200 ratings and books with less than 100 ratings
counts1 = df_ratings['user'].value_counts()
counts = df_ratings['rating'].value_counts()
df_ratings = df_ratings[df_ratings['user'].isin(counts1[counts1 >= 200].index)]
df_ratings = df_ratings[df_ratings['rating'].isin(counts[counts >= 100].index)]

# 3- Creation of a rating matrix
ratings_pivot = df_ratings.pivot(index='user', columns='isbn').rating
userID = ratings_pivot.index
ISBN = ratings_pivot.columns
print(ratings_pivot.shape)
ratings_pivot.head()

# 3 Bis - Testing out the data
bones_ratings = ratings_pivot['0316666343']
similar_to_bones = ratings_pivot.corrwith(bones_ratings)
corr_bones = pd.DataFrame(similar_to_bones, columns=['pearsonR'])
corr_bones.dropna(inplace=True)
corr_summary = corr_bones.join(average_rating['ratingCount'])
corr_summary[corr_summary['ratingCount']>=300].sort_values('pearsonR', ascending=False).head(10)

# 3 Ter
books_corr_to_bones = pd.DataFrame(['0312291639', '0316601950', '0446610038', '0446672211', '0385265700', '0345342968', '0060930535', '0375707972', '0684872153'], index=np.arange(9), columns=['isbn'])
corr_books = pd.merge(books_corr_to_bones, df_books, on='isbn')
corr_books

# 4- Combining the tables
combine_book_rating = pd.merge(df_ratings, df_books, on='isbn')
columns = ['author']
combine_book_rating = combine_book_rating.drop(columns, axis=1)
combine_book_rating.head()

# 5- Combine books and check how many ratings they got
combine_book_rating = combine_book_rating.dropna(axis = 0, subset = ['title'])

book_ratingCount = (combine_book_rating.
  groupby(by = ['title'])['rating'].
  count().
  reset_index().
  rename(columns = {'rating': 'totalRatingCount'})
  [['title', 'totalRatingCount']]
)
book_ratingCount.head()

# 6- Combine the needed data ratings
rating_with_totalRatingCount = combine_book_rating.merge(book_ratingCount, left_on = 'title', right_on = 'title', how = 'left')
rating_with_totalRatingCount.head()

# 6 Bis - Looking at the stats
pd.set_option('display.float_format', lambda x: '%.3f' % x)
print(book_ratingCount['totalRatingCount'].describe())
print(book_ratingCount['totalRatingCount'].quantile(np.arange(.9, 1, .01)))

# 7- We need to limit our data as more than 50% of the books only got 1 rating
popularity_threshold = 50
rating_popular_book = rating_with_totalRatingCount.query('totalRatingCount >= @popularity_threshold')
rating_popular_book.head()

# 8- Implement KNN into the problem
rating_popular_book = rating_popular_book.drop_duplicates(['user', 'title'])
rating_popular_book_pivot = rating_popular_book.pivot(index = 'title', columns = 'user', values = 'rating').fillna(0)
rating_popular_book_matrix = csr_matrix(rating_popular_book_pivot.values)

model_knn = NearestNeighbors(metric = 'cosine', algorithm = 'brute')
model_knn.fit(rating_popular_book_matrix)

# function to return recommended books - this will be tested
def get_recommends(book = ""):
  query_index = np.where(rating_popular_book_pivot.index == book)[0][0]
  distances, indices = model_knn.kneighbors(rating_popular_book_pivot.iloc[query_index,:].values.reshape(1, -1), n_neighbors = 5)

  books = []
  recommended_books = []
  
  for i in range(0, len(distances.flatten())):
    if i == 0:
      print('Recommendations for {0}:\n'.format(rating_popular_book_pivot.index[query_index]))
      recommended_books.append(rating_popular_book_pivot.index[query_index])
    else:
      print('{0}: {1}, with distance of {2}:'.format(i, rating_popular_book_pivot.index[indices.flatten()[i]], distances.flatten()[i]))
      books.insert(0, [rating_popular_book_pivot.index[indices.flatten()[i]], distances.flatten()[i]])

  recommended_books.append(books)

  return recommended_books

# Testing area
books = get_recommends("The Queen of the Damned (Vampire Chronicles (Paperback))")

def test_book_recommendation():
  test_pass = True
  recommends = get_recommends("Where the Heart Is (Oprah's Book Club (Paperback))")
  if recommends[0] != "Where the Heart Is (Oprah's Book Club (Paperback))":
    test_pass = False
  recommended_books = ["I'll Be Seeing You", 'The Weight of Water', 'The Surgeon', 'I Know This Much Is True']
  recommended_books_dist = [0.8, 0.77, 0.77, 0.77]
  for i in range(2): 
    if recommends[1][i][0] not in recommended_books:
      test_pass = False
    if abs(recommends[1][i][1] - recommended_books_dist[i]) >= 0.05:
      test_pass = False
  if test_pass:
    print("You passed the challenge! 🎉🎉🎉🎉🎉")
  else:
    print("You havn't passed yet. Keep trying!")

test_book_recommendation()