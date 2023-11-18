import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString } from "firebase/storage";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const CustomWebcam = () => {
  const [imgSrc, setImgSrc] = useState("");
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    // Upload to Firebase Storage
    uploadToFirebase(imageSrc);
  };

  const uploadToFirebase = async (imageSrc) => {
    const storageRef = ref(storage, "images/webcam-image.jpg");

    // Convert base64 image to a Blob
    const byteCharacters = atob(imageSrc.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });

    try {
      // Upload the Blob to Firebase Storage
      await uploadString(storageRef, imageSrc, "data_url");
      console.log("Uploaded successfully");
    } catch (error) {
      console.error("Error uploading to Firebase Storage:", error);
    }
  };

  return (
    <div className="container">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <>
          <Webcam
            height={600}
            width={600}
            ref={webcamRef}
            mirrored={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.8}
          />
          <button onClick={capture}>Capture</button>
        </>
      )}
    </div>
  );
};

export default CustomWebcam;
