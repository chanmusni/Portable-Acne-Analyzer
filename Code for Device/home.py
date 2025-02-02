from flask import Flask, render_template, request, jsonify
from ultralytics import YOLO
import firebase_admin
from firebase_admin import credentials, db, storage
import os
import base64
import json
from datetime import datetime
import cv2
import numpy as np

app = Flask(__name__)

PATIENT_DATA_DIR = 'patientData'
PATIENT_SEVERITY_FILE = 'patient_severity.json'

if not os.path.exists(PATIENT_DATA_DIR):
    os.makedirs(PATIENT_DATA_DIR)

# Firebase setup
cred = credentials.Certificate('test-b.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://test-bafb0-default-rtdb.firebaseio.com/',
    'storageBucket': 'test-bafb0.appspot.com'
})

# Load patient severity data
if os.path.exists(PATIENT_SEVERITY_FILE):
    with open(PATIENT_SEVERITY_FILE, 'r') as f:
        patient_severity = json.load(f)
else:
    patient_severity = {}

def get_last_patient_number():
    patient_folders = sorted(
        [d for d in os.listdir(PATIENT_DATA_DIR) if os.path.isdir(os.path.join(PATIENT_DATA_DIR, d))],
        key=lambda x: int(x.split(' ')[-1]) if x.split(' ')[-1].isdigit() else 0
    )
    if not patient_folders:
        return 0
    last_patient = patient_folders[-1]
    last_patient_number = int(last_patient.split(' ')[-1])
    return last_patient_number

def is_image_blurred(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    variance_of_laplacian = cv2.Laplacian(image, cv2.CV_64F).var()
    return variance_of_laplacian < 75  # Adjust threshold as necessary

@app.route('/')
def home():
    last_patient_number = get_last_patient_number()
    if last_patient_number == 0:
        last_patient = 'No Data Patient'
    else:
        last_patient = f'Patient No. {last_patient_number}'
    return render_template('index.html', last_patient=last_patient)

@app.route('/add_patient', methods=['POST'], endpoint='add_patient')
def add_patient():
    last_patient_number = get_last_patient_number()
    new_patient_number = last_patient_number + 1
    new_patient_folder = f'Patient No. {new_patient_number}'
    os.makedirs(os.path.join(PATIENT_DATA_DIR, new_patient_folder))
    print(f"New patient folder created: {new_patient_folder}")
    return jsonify({'new_patient': new_patient_folder})

@app.route('/save_image', methods=['POST'], endpoint='save_image')
def save_image():
    data = request.json
    if not all(k in data for k in ('patient', 'image', 'area', 'image_type')):
        return jsonify({'status': 'failed', 'message': 'Missing required data'}), 400

    patient_folder = data['patient']
    image_data = data['image']
    area = data['area']
    image_type = data['image_type']

    # Determine the image file extension
    if image_type.lower() in ['jpeg', 'jpg']:
        file_extension = 'jpeg'
    elif image_type.lower() == 'png':
        file_extension = 'png'
    else:
        return jsonify({'status': 'failed', 'message': 'Unsupported image type'}), 400

    # Decode the image and save it to the patient folder
    image_path = os.path.join(PATIENT_DATA_DIR, patient_folder, f'{patient_folder}_{area}.{file_extension}')
    try:
        with open(image_path, 'wb') as image_file:
            image_file.write(base64.b64decode(image_data.split(',')[1]))
    except (IndexError, base64.binascii.Error) as e:
        return jsonify({'status': 'failed', 'message': 'Invalid image data'}), 400

    is_blurred = bool(is_image_blurred(image_path))  # Convert to standard Python boolean

    return jsonify({'status': 'success', 'area': area, 'is_blurred': is_blurred})

@app.route('/check_images/<patient>', endpoint='check_images')
def check_images(patient):
    patient_folder_path = os.path.join(PATIENT_DATA_DIR, patient)
    areas = ['Forehead', 'LeftCheeks', 'RightCheeks', 'Nose', 'Chin']
    existing_images = {}
    for area in areas:
        image_exists = any(os.path.exists(os.path.join(patient_folder_path, f'{patient}_{area}.{ext}')) for ext in ['jpeg', 'png'])
        existing_images[area] = image_exists
    return jsonify(existing_images)

def upload_folder_to_firebase(folder_path, storage_path):
    bucket = storage.bucket()
    for root, _, files in os.walk(folder_path):
        for file in files:
            local_file = os.path.join(root, file)
            blob = bucket.blob(f'{storage_path}/{file}')
            blob.upload_from_filename(local_file)

@app.route('/check_result_folder/<patient>', endpoint='check_result_folder')
def check_result_folder(patient):
    patient_folder_path = os.path.join(PATIENT_DATA_DIR, patient)
    result_folder_path = os.path.join(patient_folder_path, 'result')
    exists = os.path.exists(result_folder_path)
    return jsonify({'exists': exists})

@app.route('/confirm_add_patient', methods=['POST'], endpoint='confirm_add_patient')
def confirm_add_patient():
    return jsonify({'message': 'Do you want to add a new patient?'})

@app.route('/remove_image', methods=['POST'], endpoint='remove_image')
def remove_image():
    data = request.json
    patient_folder = data['patient']
    area = data['area']

    # Construct the image path
    image_path = os.path.join(PATIENT_DATA_DIR, patient_folder, f'{patient_folder}_{area}.jpeg')
    if os.path.exists(image_path):
        os.remove(image_path)
        return jsonify({'status': 'success', 'area': area})
    else:
        return jsonify({'status': 'failed', 'message': 'Image not found'})

@app.route('/save_results', methods=['POST'], endpoint='save_results')
def save_results():
    data = request.json
    patient = data['patient']
    patient_folder_path = data['patient_folder_path']
    result_folder_path = data['result_folder_path']
    results = data['results']
    severity = data['severity']
    recommended_treatment = data['recommended_treatment']
    total_score = data['total_score']

    # Load the YOLO model
    model = YOLO("best.pt")

    # Save the result images
    for area in results:
        image_path = os.path.join(patient_folder_path, f'{patient}_{area}.jpeg')
        if os.path.exists(image_path):
            result = model(image_path, conf=0.01)  # Set confidence threshold to 30%
            result_image_path = os.path.join(result_folder_path, f'{area}_result.jpg')
            result[0].save(filename=result_image_path)

    # Update Firebase and local patient severity record
    ref = db.reference('acnegrade')
    previous_severity = patient_severity.get(patient, None)
    if previous_severity:
        previous_count = ref.child(previous_severity).get() or 0
        ref.child(previous_severity).set(max(0, previous_count - 1))
    current_count = ref.child(severity).get() or 0
    ref.child(severity).set(current_count + 1)

    patient_severity[patient] = severity
    with open(PATIENT_SEVERITY_FILE, 'w') as f:
        json.dump(patient_severity, f)

    # Upload patient folder to Firebase storage
    upload_folder_to_firebase(patient_folder_path, f'patients/{patient}')

    # Add patient data to Firebase under patientData
    patient_number = int(patient.split(' ')[-1])
    patient_data_ref = db.reference(f'patientData/{patient_number}')
    now = datetime.now()
    date_str = now.strftime("%b-%d-%Y")
    time_str = now.strftime("%H:%M %p")
    patient_data_ref.set({
        'date': date_str,
        'severity': severity,
        'time': time_str
    })

    return jsonify({'status': 'success'})

@app.route('/analyze', methods=['POST'], endpoint='analyze')
def analyze():
    data = request.json
    patient = data['patient']
    patient_folder_path = os.path.join(PATIENT_DATA_DIR, patient)
    result_folder_path = os.path.join(patient_folder_path, 'result')

    if not os.path.exists(result_folder_path):
        os.makedirs(result_folder_path)

    # Load the YOLO model
    model = YOLO("best.pt")

    # Define the grading and factors
    grading = {
        'comedones': 1,
        'papules': 2,
        'pustules': 3,
        'nodules': 4
    }
    factors = {
        'Forehead': 2,
        'LeftCheeks': 2,
        'RightCheeks': 2,
        'Nose': 1,
        'Chin': 1
    }

    # Areas to check for images
    areas = ['Forehead', 'LeftCheeks', 'RightCheeks', 'Nose', 'Chin']
    total_score = 0
    area_scores = {}
    highest_lesion_type = None

    for area in areas:
        image_path = os.path.join(patient_folder_path, f'{patient}_{area}.jpeg')
        if os.path.exists(image_path):
            result = model(image_path, conf=0.01)  # Set confidence threshold to 30%
            highest_score = 0
            for cls in result[0].boxes.cls:
                lesion_type = model.names[int(cls)]
                if lesion_type in grading:
                    highest_score = max(highest_score, grading[lesion_type])
                    if not highest_lesion_type or grading[lesion_type] > grading[highest_lesion_type]:
                        highest_lesion_type = lesion_type
            area_score = highest_score * factors[area]
            total_score += area_score
            area_scores[area] = area_score
        else:
            area_scores[area] = 0

    # Determine severity and recommended treatment
    if total_score == 0:
        severity = "None"
        recommended_treatment = "No treatment required."
    elif 1 <= total_score <= 19:
        severity = "Mild"
        recommended_treatment = ("Comedones: Topical Retinoids and Salicylic Acid  <br> Papules: Topical Retinoids +/- BPO or Antibiotic and Azelaic Acid")
    elif 20 <= total_score <= 31:
        severity = "Moderate"
        recommended_treatment = ("Topical Retinoids +/- BPO or Azelaic Acid, Oral Antibiotics (ABO), "
                                 "Hormonal Therapy, Isotretonic")
    elif 32 <= total_score <= 40:
        severity = "Severe"
        recommended_treatment = ("Oral Isotretonin, Topical Antibiotics + Topical Retinoids + BPO, "
                                 "Hormonal Therapy + Topical Retinoids +/- BPO or Topical ABO")
    else:
        severity = "Severe"
        recommended_treatment = ("Oral Isotretonin, Topical Antibiotics + Topical Retinoids + BPO, "
                                 "Hormonal Therapy + Topical Retinoids +/- BPO or Topical ABO")

    result_data = {
        'status': 'success',
        'results': area_scores,
        'total_score': total_score,
        'severity': severity,
        'recommended_treatment': recommended_treatment
    }

    return jsonify(result_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)