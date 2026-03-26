import cv2
from ultralytics import YOLO
import easyocr
import numpy as np
import mysql.connector
import re
from dotenv import load_dotenv
import os

load_dotenv()  # reads .env and sets env vars

# Initialize EasyOCR Reader
reader = easyocr.Reader(['en'])
num_list = set()  #test

# Connect to MySQL database
db = mysql.connector.connect(
    host= os.getenv("DB_HOST"),
    user= os.getenv("DB_USER"),
    password= os.getenv("DB_PASSWORD"),
    database= os.getenv("DB_DATABASE")
)
cursor = db.cursor()

# Function to insert data into MySQL
def insert_into_db(number_plate_text):
    sql = "CALL InsertPlateInfo(%s)"
    val = (number_plate_text,)
    cursor.execute(sql, val)
    db.commit()
    print(f"Inserted: {number_plate_text}")

# Load your custom YOLOv8 model
model = YOLO('best.pt')  # Replace with your model path

# Initialize webcam
cap = cv2.VideoCapture(0)  # '0' is typically the default webcam device


# Set desired frame width and height
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
fps = cap.get(cv2.CAP_PROP_FPS)
if fps == 0:
    fps = 30  # Manually set a default FPS

# Define codec and create VideoWriter object
out = cv2.VideoWriter('output_video.mp4', cv2.VideoWriter_fourcc(*'mp4v'), 30, (1920, 1080))

frame_count = 0
ocr_interval = int(fps)  # Process OCR roughly once per second

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Run YOLOv8 inference
    results = model(frame)

    # Visualize YOLO results
    annotated_frame = results[0].plot()

    if frame_count % ocr_interval == 0:
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                cropped_image = frame[int(y1):int(y2), int(x1):int(x2)]

                # Preprocess the cropped image
                gray = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
                enhanced_image = cv2.bilateralFilter(gray, 9, 75, 75)
                resized_image = cv2.resize(enhanced_image, (640, 320))

                # Use EasyOCR to read the cropped image
                ocr_result = reader.readtext(resized_image)

                if ocr_result:
                    detected_text = ocr_result[0][-2]
                    cleaned_text = re.sub(r'[^a-zA-Z0-9]', '', detected_text).strip()
                    
                    if len(cleaned_text)>=9 and len(cleaned_text)<= 10:
                        print(f"Detected number plate: {cleaned_text}")
                        num_list.add(cleaned_text)
                        insert_into_db(cleaned_text)
                    else:
                        print("Detected text is not 10 characters long.")

    out.write(annotated_frame)
    cv2.imshow('Webcam Feed', annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    frame_count += 1

cap.release()
out.release()
cv2.destroyAllWindows()

print(num_list)