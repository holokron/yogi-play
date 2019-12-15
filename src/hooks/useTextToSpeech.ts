interface TextToSpeechHook {
  readText(text: string): void;
}

export default function useTextToSpeech(): TextToSpeechHook {
  const doReadText = (text: string): void => {
    if (!window.speechSynthesis) {
      return;
    }

    const speech: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speech.rate = 0.7;
    window.speechSynthesis.speak(speech);
  };

  return {
    readText: doReadText
  };
}
