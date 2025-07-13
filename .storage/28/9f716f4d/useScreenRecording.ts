import { useState, useRef, useEffect } from 'react';

interface RecordingOptions {
  videoQuality: '720p' | '1080p' | '2K' | '4K';
  fps: 30 | 60 | 120;
  audioSources: {
    microphone: boolean;
    system: boolean;
    internal: boolean;
  };
  cameraEnabled: boolean;
  recordingType: 'full' | 'window' | 'area';
  highlightClicks: boolean;
}

export interface Recording {
  id: string;
  name: string;
  duration: number; // in seconds
  date: Date;
  thumbnail: string;
  videoUrl: string;
  size: number; // in bytes
}

export const useScreenRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentFps, setCurrentFps] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [gpuUsage, setGpuUsage] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // For demo purposes, we'll populate with some sample recordings
  useEffect(() => {
    const sampleRecordings: Recording[] = [
      {
        id: '1',
        name: 'Tutorial Recording',
        duration: 600, // 10 minutes
        date: new Date('2025-07-10T14:30:00'),
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"%3E%3Crect width="200" height="120" fill="%23333"%3E%3C/rect%3E%3Ctext x="100" y="60" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="middle"%3ETutorial Recording%3C/text%3E%3C/svg%3E',
        videoUrl: '#',
        size: 45000000, // 45MB
      },
      {
        id: '2',
        name: 'Project Presentation',
        duration: 900, // 15 minutes
        date: new Date('2025-07-11T10:15:00'),
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"%3E%3Crect width="200" height="120" fill="%23444"%3E%3C/rect%3E%3Ctext x="100" y="60" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="middle"%3EProject Presentation%3C/text%3E%3C/svg%3E',
        videoUrl: '#',
        size: 128000000, // 128MB
      },
      {
        id: '3',
        name: 'Game Recording',
        duration: 1800, // 30 minutes
        date: new Date('2025-07-12T09:00:00'),
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"%3E%3Crect width="200" height="120" fill="%23553"%3E%3C/rect%3E%3Ctext x="100" y="60" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="middle"%3EGame Recording%3C/text%3E%3C/svg%3E',
        videoUrl: '#',
        size: 256000000, // 256MB
      },
    ];
    
    setRecordings(sampleRecordings);
  }, []);
  
  // Format seconds to hh:mm:ss
  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Start monitoring system metrics
  const startMetricsMonitoring = () => {
    const metricsInterval = setInterval(() => {
      // In a real app, we would get actual metrics from the system
      // For this demo, we'll simulate random but realistic values
      setCurrentFps(Math.floor(Math.random() * 5) + 56); // 56-60 fps
      setCpuUsage(Math.floor(Math.random() * 15) + 5); // 5-20%
      setGpuUsage(Math.floor(Math.random() * 20) + 15); // 15-35%
    }, 1000);
    
    return () => clearInterval(metricsInterval);
  };
  
  // Start recording
  const startRecording = async (options: RecordingOptions) => {
    try {
      // In a real implementation, we would use the options to configure the recording
      // For this demo, we'll simulate recording with default settings
      
      // Request screen capture
      const displayMediaOptions = {
        video: {
          cursor: 'always',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: options.fps }
        }
      };
      
      // This would normally capture the screen, but in our demo it will fail
      // because we're not in a secure context
      try {
        streamRef.current = await (navigator.mediaDevices as any).getDisplayMedia(displayMediaOptions);
      } catch (e) {
        console.log('In demo mode, using mock stream');
        // Create a mock stream for demo purposes
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#7F00FF';
          ctx.font = '40px Arial';
          ctx.fillText('KNOUX REC Demo Recording', 50, 100);
        }
        const mockStream = canvas.captureStream(options.fps);
        streamRef.current = mockStream;
      }
      
      // Add audio if selected
      if (options.audioSources.microphone) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTracks = audioStream.getAudioTracks();
          audioTracks.forEach(track => streamRef.current?.addTrack(track));
        } catch (e) {
          console.log('Could not add audio track');
        }
      }
      
      // Create MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9',
      });
      
      // Set up event handlers
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        // Create blob from chunks
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        // Create a new recording entry
        const newRecording: Recording = {
          id: Date.now().toString(),
          name: `Recording_${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '_')}`,
          duration: recordingTime,
          date: new Date(),
          thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"%3E%3Crect width="200" height="120" fill="%237F00FF"%3E%3C/rect%3E%3Ctext x="100" y="60" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="middle"%3ENew Recording%3C/text%3E%3C/svg%3E',
          videoUrl: url,
          size: blob.size,
        };
        
        // Add to recordings list
        setRecordings(prev => [newRecording, ...prev]);
        
        // Clean up
        chunksRef.current = [];
        streamRef.current = null;
        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
        startTimeRef.current = null;
        pausedTimeRef.current = 0;
      };
      
      // Start recording
      mediaRecorderRef.current.start(1000); // Record in 1-second chunks
      startTimeRef.current = Date.now();
      setIsRecording(true);
      
      // Start the timer
      timerRef.current = window.setInterval(() => {
        if (!isPaused) {
          const currentTime = Date.now();
          const elapsedTime = (currentTime - (startTimeRef.current || 0) - pausedTimeRef.current) / 1000;
          setRecordingTime(elapsedTime);
        }
      }, 1000);
      
      // Start monitoring metrics
      startMetricsMonitoring();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      // Provide fallback for demo purposes
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      // Start the timer
      timerRef.current = window.setInterval(() => {
        if (!isPaused) {
          const currentTime = Date.now();
          const elapsedTime = (currentTime - (startTimeRef.current || 0) - pausedTimeRef.current) / 1000;
          setRecordingTime(elapsedTime);
        }
      }, 1000);
      
      // Start monitoring metrics
      startMetricsMonitoring();
    }
  };
  
  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      try {
        mediaRecorderRef.current.pause();
      } catch (e) {
        // Fallback for browsers that don't support pause
        console.log('Pause not supported, simulating pause');
      }
      pausedTimeRef.current = Date.now() - (startTimeRef.current || 0) - pausedTimeRef.current;
      setIsPaused(true);
    }
  };
  
  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      try {
        mediaRecorderRef.current.resume();
      } catch (e) {
        // Fallback for browsers that don't support resume
        console.log('Resume not supported, simulating resume');
      }
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      setIsPaused(false);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // For demo, create a mock recording
      const duration = recordingTime;
      
      // Create a new recording entry
      const newRecording: Recording = {
        id: Date.now().toString(),
        name: `Recording_${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '_')}`,
        duration: duration,
        date: new Date(),
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"%3E%3Crect width="200" height="120" fill="%237F00FF"%3E%3C/rect%3E%3Ctext x="100" y="60" font-family="Arial" font-size="12" fill="white" text-anchor="middle" alignment-baseline="middle"%3ENew Recording%3C/text%3E%3C/svg%3E',
        videoUrl: '#',
        size: Math.floor(duration * 1024 * 1024 * 1.5), // Roughly 1.5MB per second
      };
      
      // Add to recordings list
      setRecordings(prev => [newRecording, ...prev]);
      
      // Clean up
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Delete a recording
  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(recording => recording.id !== id));
  };
  
  // Rename a recording
  const renameRecording = (id: string, newName: string) => {
    setRecordings(prev => 
      prev.map(recording => 
        recording.id === id ? { ...recording, name: newName } : recording
      )
    );
  };
  
  return {
    isRecording,
    isPaused,
    recordingTime: formatTime(recordingTime),
    recordings,
    currentFps,
    cpuUsage,
    gpuUsage,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    deleteRecording,
    renameRecording
  };
};