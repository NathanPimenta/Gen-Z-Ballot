import cv2
import webbrowser
import time
import dlib
from scipy.spatial import distance
from deepface import DeepFace

STORED_IMAGE_PATH = "stored_face.jpg"
SUCCESS_URL = "https://idea-hackathon-dfui.vercel.app/"  # Redirect link

# Load face detector and landmark predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("D:/Nathan/PROJECTS/Gen-Z-Ballot1/shape_predictor_68_face_landmarks.dat")

def eye_aspect_ratio(eye):
    """Calculate the eye aspect ratio (EAR) for blink detection."""
    A = distance.euclidean(eye[1], eye[5])  # Vertical eye landmarks
    B = distance.euclidean(eye[2], eye[4])  
    C = distance.euclidean(eye[0], eye[3])  # Horizontal eye landmark
    ear = (A + B) / (2.0 * C)  # EAR formula
    return ear

def detect_blink():
    """Detect if the user blinks using EAR."""
    cap = cv2.VideoCapture(0)

    blink_count = 0
    start_time = time.time()
    blink_threshold = 0.2  # EAR threshold for detecting closed eyes
    blink_frames = 3  # Number of consecutive frames for a blink
    consecutive_frames = 0
    blinked = False  

    print("Blink twice to verify liveness...")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Camera not working")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)

        for face in faces:
            landmarks = predictor(gray, face)

            # Extract eye landmarks
            left_eye = [(landmarks.part(i).x, landmarks.part(i).y) for i in range(36, 42)]
            right_eye = [(landmarks.part(i).x, landmarks.part(i).y) for i in range(42, 48)]

            # Calculate EAR for both eyes
            left_EAR = eye_aspect_ratio(left_eye)
            right_EAR = eye_aspect_ratio(right_eye)
            avg_EAR = (left_EAR + right_EAR) / 2.0

            # Blink detection logic
            if avg_EAR < blink_threshold:
                consecutive_frames += 1  # Eyes closed
            else:
                if consecutive_frames >= blink_frames:
                    blink_count += 1  # Count blink when reopening
                    print(f"Blink detected! Total: {blink_count}")
                consecutive_frames = 0  # Reset counter

            # Draw eye landmarks
            for (x, y) in left_eye + right_eye:
                cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

        cv2.imshow("Liveness Detection", frame)

        if blink_count >= 1:  # Require 2 blinks
            print("✅ Liveness Confirmed! Proceeding to face authentication.")
            cap.release()
            cv2.destroyAllWindows()
            return True

        # if time.time() - start_time > 10:  # Timeout after 10 seconds
        #     print("❌ Liveness check failed! No blink detected.")
        #     cap.release()
        #     cv2.destroyAllWindows()
        #     return False

        if cv2.waitKey(1) & 0xFF == 27:  # ESC key to cancel
            break

    cap.release()
    cv2.destroyAllWindows()
    return False

def capture_image():
    """Capture an image from the webcam for authentication."""
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not access camera")
        return None

    print("Press 'Space' to capture the image for authentication...")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture frame")
            break

        cv2.imshow("Press Space to Capture", frame)

        key = cv2.waitKey(1)
        if key == 32:  # Spacebar pressed
            captured_image_path = "captured_face.jpg"
            cv2.imwrite(captured_image_path, frame)
            print(f"✅ Image captured and saved as {captured_image_path}")
            cap.release()
            cv2.destroyAllWindows()
            return captured_image_path

        elif key == 27:  # Escape key to exit
            print("❌ Exiting...")
            cap.release()
            cv2.destroyAllWindows()
            return None

    cap.release()
    cv2.destroyAllWindows()
    return None

def authenticate_face(captured_image_path, STORED_IMAGE_PATH):
    """Compare the captured image with the stored image using DeepFace."""
    try:
        print("🔍 Authenticating face...")
        result = DeepFace.verify(captured_image_path, STORED_IMAGE_PATH)

        if result["verified"]:
            print("✅ Authentication Successful! Redirecting...")
            webbrowser.open(SUCCESS_URL)  # Open success page
        else:
            print("❌ Authentication Failed! Face does not match.")

    except Exception as e:
        print(f"Error during authentication: {str(e)}")

if __name__ == "__main__":
    if detect_blink():  # Liveness check first
        captured_image = capture_image()
        if captured_image:
            authenticate_face(captured_image, STORED_IMAGE_PATH)
    else:
        print("❌ Authentication aborted due to liveness check failure.")
