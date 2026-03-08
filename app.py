from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import pickle
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'Dataset.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')

def train_and_save():
    df = pd.read_csv(DATA_PATH)
    le_gender = LabelEncoder()
    df['Gender_enc'] = le_gender.fit_transform(df['Gender'])

    features = [
        'Age', 'Gender_enc', 'Sleep_Hours', 'Work_Study_Hours',
        'Physical_Activity_Days_Per_Week', 'Social_Interaction_Score_0_10',
        'Stress_Level_1_10', 'Anxiety_Score_0_21', 'Depression_Score_0_27',
        'Screen_Time_Hours', 'Caffeine_Intake_0_5', 'Alcohol_Consumption_0_5',
        'Family_History_0_1', 'Therapy_History_0_1'
    ]

    X = df[features]
    y = df['Mental_Health_Condition']

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    knn = KNeighborsClassifier(n_neighbors=9)
    knn.fit(X_train, y_train)
    accuracy = knn.score(X_test, y_test)

    with open(MODEL_PATH, 'wb') as f:
        pickle.dump((knn, scaler, le_gender, features, accuracy), f)

    print(f"✅ Model trained and saved. Accuracy: {accuracy:.2%}")
    return knn, scaler, le_gender, features, accuracy

# Load or train model
if os.path.exists(MODEL_PATH):
    print("✅ Loading saved model...")
    with open(MODEL_PATH, 'rb') as f:
        knn, scaler, le_gender, features, accuracy = pickle.load(f)
    print(f"✅ Model loaded. Accuracy: {accuracy:.2%}")
else:
    print("⚙️ Training model for first time...")
    knn, scaler, le_gender, features, accuracy = train_and_save()

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route('/')
def index():
    return send_from_directory('templates', 'index.html')

@app.route('/<path:filename>')
def serve_html(filename):
    if filename.endswith('.html'):
        return send_from_directory('templates', filename)
    return send_from_directory('static', filename)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        gender_map = {'male': 'Male', 'female': 'Female', 'other': 'Other'}
        gender_str = gender_map.get(str(data.get('gender', 'other')).lower(), 'Other')
        gender_enc = le_gender.transform([gender_str])[0]

        input_features = [[
            float(data['age']),
            float(gender_enc),
            float(data['sleep_hours']),
            float(data['work_study_hours']),
            float(data['physical_activity']),
            float(data['social_interaction']),
            float(data['stress_level']),
            float(data['anxiety_score']),
            float(data['depression_score']),
            float(data['screen_time']),
            float(data['caffeine']),
            float(data['alcohol']),
            float(data['family_history']),
            float(data['therapy_history'])
        ]]

        input_df = pd.DataFrame(input_features, columns=features)
        input_scaled = scaler.transform(input_df)
        prediction = knn.predict(input_scaled)[0]
        probabilities = knn.predict_proba(input_scaled)[0]
        classes = knn.classes_
        prob_dict = {cls: round(float(prob) * 100, 1)
                     for cls, prob in zip(classes, probabilities)}

        return jsonify({
            'prediction': prediction,
            'probabilities': prob_dict,
            'model_accuracy': round(accuracy * 100, 1)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/model_info')
def model_info():
    return jsonify({
        'accuracy': round(accuracy * 100, 1),
        'algorithm': 'K-Nearest Neighbors (K=9)',
        'features': features,
        'classes': list(knn.classes_)
    })

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)