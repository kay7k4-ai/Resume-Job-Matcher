import os
import re
import pickle
import PyPDF2
from flask import Flask, request, jsonify, render_template
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted
    return text

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.lower().strip()

def get_match_score(resume_text, job_text):
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([resume_text, job_text])
    score = cosine_similarity(vectors[0], vectors[1])[0][0]
    return round(score * 100, 2)

def get_missing_keywords(resume_text, job_text):
    stopwords = {
        "the","and","for","with","you","are","this","that","have",
        "from","will","our","your","was","has","been","they","their",
        "which","would","about","more","also","when","than","into",
        "each","such","only","some","over","both","well","must"
    }
    job_words = set(job_text.lower().split())
    resume_words = set(resume_text.lower().split())
    missing = [
        w for w in job_words - resume_words
        if len(w) > 4 and w not in stopwords and w.isalpha()
    ]
    return sorted(missing)[:15]

def get_feedback(score):
    if score > 60:
        return {"text": "Strong match — you're a great fit!", "level": "strong"}
    elif score > 35:
        return {"text": "Average match — add more keywords", "level": "average"}
    else:
        return {"text": "Low match — tailor your resume more", "level": "low"}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    if "resume" not in request.files:
        return jsonify({"error": "No resume file uploaded"})

    resume_file = request.files["resume"]
    job_desc = request.form.get("job_desc", "")

    if not job_desc.strip():
        return jsonify({"error": "Please paste a job description"})

    try:
        resume_text = clean_text(extract_text_from_pdf(resume_file))
        job_text = clean_text(job_desc)

        if len(resume_text.split()) < 10:
            return jsonify({"error": "Could not extract text from PDF. Try a different file."})

        score = get_match_score(resume_text, job_text)
        missing = get_missing_keywords(resume_text, job_text)
        feedback = get_feedback(score)

        return jsonify({
            "score": score,
            "missing_keywords": missing,
            "feedback": feedback
        })

    except Exception as e:
        return jsonify({"error": f"Error processing file: {str(e)}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))