export const speak = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve(); // Mock for SSR or unsupported browsers
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve(); // Resolve anyway so game doesn't get stuck
    
    window.speechSynthesis.speak(utterance);
  });
};
