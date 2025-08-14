import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# Load dataset
df = pd.read_csv("dataset.csv", encoding='latin1')  # make sure the column with headlines is 'text'
X = df["Text"]
y = df["Label"]  # your label column: 0 = fake, 1 = credible

# Build pipeline
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", LogisticRegression(max_iter=1000))
])

# Train model
pipeline.fit(X, y)

# Save model
joblib.dump(pipeline, "credibility_model.pkl")
print("Model trained and saved as credibility_model.pkl")
