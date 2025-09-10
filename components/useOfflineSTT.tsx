// // stt.tsx
// import Vosk from 'react-native-vosk';
// import { useEffect, useState } from 'react';
// import { PermissionsAndroid, Platform } from 'react-native';
// const vosk = new Vosk();

// export function useOfflineSTT() {
//   const [recognizing, setRecognizing] = useState(false);
//   const [transcript, setTranscript] = useState('');

//   // request mic permission (Android)
//   const requestMic = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   const startRecognition = async () => {
//     const ok = await requestMic();
//     if (!ok) return;

//     setTranscript('');
//     setRecognizing(true);

//     vosk
//     .loadModel('model-en-en')
//     .then(() => {
//       const options = {
//         grammar: ['left', 'right', '[unk]'],
//       };
  
//       vosk
//         .start(options)
//         .then(() => {
//           console.log('Recognizer successfuly started');
//         })
//         .catch((e) => {
//           console.log('Error: ' + e);
//         });
  
//       const resultEvent = vosk.onResult((res) => {
//         console.log('A onResult event has been caught: ' + res);
//       });
  
//       // Don't forget to call resultEvent.remove(); to delete the listener
//     })
//     .catch((e) => {
//       console.error(e);
//     });
//   };

//   const stopRecognition = async () => {
//     await vosk.stop();
//     setRecognizing(false);
//   };

//   useEffect(() => {
//     return () => {
//       vosk.stop();
//     };
//   }, []);

//   return {
//     recognizing,
//     transcript,
//     startRecognition,
//     stopRecognition,
//   };
// }
