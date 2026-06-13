
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface EyeTrackerProps {
  onStatusChange: (isFocused: boolean) => void;
  isActive: boolean;
}

const EyeTracker: React.FC<EyeTrackerProps> = ({ onStatusChange, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const landmarkerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Fix: Initializing useRef with null to satisfy the expected 1 argument in strict TypeScript environments.
  const requestRef = useRef<number | null>(null);

  const initTracker = async () => {
    try {
      // Import MediaPipe from the importmap
      const vision = await import("@mediapipe/tasks-vision");
      
      const filesetResolver = await vision.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      
      landmarkerRef.current = await vision.FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
      });
      setIsLoaded(true);
    } catch (err: any) {
      console.error("Failed to load FaceLandmarker", err);
      setError(err.message || "Face tracking engine failed to initialize.");
    }
  };

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access denied", err);
      setError("Camera permission is required for focus tracking.");
    }
  };

  const detect = useCallback(() => {
    if (!isActive || !landmarkerRef.current || !videoRef.current || videoRef.current.readyState < 2) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }

    try {
      const startTimeMs = performance.now();
      const results = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        
        // Face landmarks for gaze detection
        // 1: Nose Tip, 33: Left Eye Outer, 263: Right Eye Outer
        const noseTip = landmarks[1];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        const eyeCenter = (leftEye.x + rightEye.x) / 2;
        const horizontalOffset = Math.abs(noseTip.x - eyeCenter);
        const eyeVerticalCenter = (leftEye.y + rightEye.y) / 2;
        const verticalOffset = Math.abs(noseTip.y - eyeVerticalCenter);

        // Thresholds for "looking away"
        // horizontalOffset > 0.07 (yaw/turning side)
        // verticalOffset > 0.18 (pitch/looking up or down)
        const isLookingAway = horizontalOffset > 0.07 || verticalOffset > 0.18;
        onStatusChange(!isLookingAway);
      } else {
        // No face in frame
        onStatusChange(false);
      }
    } catch (e) {
      console.debug("Frame processing error", e);
    }

    requestRef.current = requestAnimationFrame(detect);
  }, [isActive, onStatusChange]);

  useEffect(() => {
    initTracker();
    startCamera();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      requestRef.current = requestAnimationFrame(detect);
    }
  }, [isLoaded, detect]);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl ring-1 ring-white/10">
      <video 
        ref={videoRef} 
        className="w-full h-full object-cover scale-x-[-1]"
        muted
        playsInline
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-950/90 p-6 text-center backdrop-blur-sm">
          <div className="space-y-2">
            <svg className="w-8 h-8 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-white text-xs font-bold leading-tight">{error}</p>
          </div>
        </div>
      )}

      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-3"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Initializing AI</span>
          </div>
        </div>
      )}

      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[9px] uppercase tracking-widest font-black text-white pointer-events-none">
        Focus Feed
      </div>
    </div>
  );
};

export default EyeTracker;
