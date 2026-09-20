import { useState, useRef } from 'react';

export default function VoiceInput({ onResult, label = 'Voice Input' }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          // In production, send to backend for speech-to-text
          // For now, call onResult with placeholder text
          onResult('Voice input placeholder text');
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  return (
    <button
      className="button"
      onClick={recording ? stopRecording : startRecording}
      style={{ background: recording ? '#ef4444' : '#10b981' }}
    >
      {recording ? '🔴 Stop' : '🎤 ' + label}
    </button>
  );
}
