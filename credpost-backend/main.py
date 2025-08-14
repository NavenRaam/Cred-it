from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os # Added os for path handling

app = FastAPI(title="Credibility Score API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow your frontend origin or "*" for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
# Ensure 'credibility_model.pkl' is in the same directory as main.py
model_path = os.path.join(os.path.dirname(__file__), 'credibility_model.pkl')
if not os.path.exists(model_path):
    # Added a more informative error for missing model file
    raise FileNotFoundError(f"Model file not found at {model_path}. Please run train_model.py first.")
model = joblib.load(model_path)


class Headline(BaseModel):
    text: str

@app.post("/predict/")
def predict(headline: Headline):
    try:
        # List of strings works with Pipeline containing TfidfVectorizer
        score = model.predict_proba([headline.text])[0][1]
        return {
            "headline": headline.text,
            "credibility_score": round(score, 2)
        }
    except Exception as e:
        return {"error": str(e)}

# Add this block to run with uvicorn directly from the script
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)