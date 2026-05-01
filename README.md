# 🎯 Resume-Job-Matcher

A Flask-based AI resume analyzer that instantly matches your CV against any job description using TF-IDF and Cosine Similarity. Get instant scores, missing keywords, and smart feedback to optimize your application in seconds.

## 🚀 Live Demo
[Click here to try it live](https://resume-job-matcher-ya1z.onrender.com/)

## 🌟 Features
- **Instant PDF Analysis**: Upload your resume and get a match score immediately.
- **Smart Keyword Extraction**: Identifies key skills and requirements from the job description.
- **Gap Detection**: Pinpoints exactly which keywords and skills are missing from your resume.
- **AI Feedback**: Provides actionable advice to improve your match score.
- **Clean UI**: Simple, modern interface for quick and easy use.

## 🚀 Quick Start

### Prerequisites
- Python 3.6+
- pip (Python package installer)

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd Resume-Job-Matcher
    ```

2.  Create a virtual environment (recommended):
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Run the application:
    ```bash
    python app.py
    ```

5.  Open your browser and navigate to:
    [http://localhost:5000](http://localhost:5000)

## 🛠️ Usage
1.  Click **"Upload Resume (PDF)"** and select your CV file.
2.  Paste the job description into the text area.
3.  Click **"Analyze Match"**.
4.  View your match score, missing keywords, and AI feedback instantly!

## 🧪 Technical Details
- **Framework**: Flask
- **PDF Processing**: PyPDF2
- **NLP**: scikit-learn (TF-IDF, Cosine Similarity)
- **Styling**: Custom CSS for a modern look

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.