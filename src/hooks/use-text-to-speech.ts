interface TextToSpeechHook {
  readText(text: string): void;
}

function readText(text: string): void {
  if (!window.speechSynthesis) {
    return;
  }

  const speech: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
  speech.rate = 0.7;
  window.speechSynthesis.speak(speech);
}

export default function useTextToSpeech(): TextToSpeechHook {
  return { readText };
}
