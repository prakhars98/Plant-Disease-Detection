from fastapi import FastAPI
import cv2
import keras
import numpy as np
import shutil
import os
from fastapi import FastAPI, File, UploadFile, Request

app = FastAPI()
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/predict")
def predict_class(file: UploadFile = File(...)):
    model = keras.models.load_model("DD3model-20220323T103606Z-001/DD3model")
    file_object = file.file
    upload_folder = open(os.path.join("uploads/", file.filename), 'wb+')
    shutil.copyfileobj(file_object, upload_folder)
    upload_folder.close()
    image=cv2.imread("uploads/"+file.filename)
    image_resized= cv2.resize(image, (224,224))
    image=np.expand_dims(image_resized,axis=0)
    class_names = ['Apple Scab', 'Apple Black rot', ' Apple Rust', 'Apple Healthy', 'Background without leaves', 'Blueberry healthy', 'Cherry Powdery mildew', 'Cherry healthy', 'Corn Cercospora leaf spot', 'Corn Common Rust', 'Corn Northern Leaf Blight', 'Corn Healthy', 'Grape Black Rot', 'Grape Esca (Black Measles)', 'Grape Leaf blight', 'Grape Healthy', 'Orange Haunglongbing(Citrus greening)', 'Peach Bacterial spot', 'Peach Healthy', 'Bell Pepper Bacterial Spot', 'Bell Pepper healthy', 'Potato Early Blight', 'Potato Late Blight', 'Potato Healthy', 'Raspberry Healthy', 'Soybean Healthy', 'Squash Powdery Mildew', 'Strawberry Leaf Scorch', 'Strawberry Healthy', 'Tomato Bacterial Spot', 'Tomato Early Blight', 'Tomato Late Blight', 'Tomato Leaf Mold', 'Tomato Septoria leaf spot', 'Tomato Spider-mites Two-spotted Spider mite', 'Tomato Target Spot', 'Tomato Tomato Yellow Leaf Curl Virus', 'Tomato Mosaic Virus', 'Tomato Healthy']
    pred = model.predict(image)
    output_class= class_names[np.argmax(pred)]
    confidence = np.max(pred[0])
    return {
        "class": output_class,
        "confidence": float(confidence)
    }