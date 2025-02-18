"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = e.target.elements.input.value;
    setPrompts((prevPrompts) => [...prevPrompts, data]);
    e.target.elements.input.value = "";
  };
  // language detection
  const [language, setLanguage] = useState(null);
  useEffect(() => {
    const detectLanguage = async () => {
      if ("languageDetection" in window) {
        const languageDetection = new window.LanguageDetection();
        languageDetection.setToken(process.env.Language_Detection_Token);
        const detectedLanguage = await languageDetection.detectLanguage();
        setLanguage(detectedLanguage);
      }
    };
    detectLanguage();
  }, []);

  return (
    <div>
      {/* Display the list of user prompts */}
      {prompts.length > 0 && (
        <div>
          <ul>
            {prompts.map((prompt, index) => (
              <div key={index}>
                <li>{prompt}</li>
                <p>{language}</p>
                <button type="submit">Summarize</button>
                {/* summarize reply */}
                <label hidden for="output">
                  Summary/Translation:
                </label>
                <output></output>
                <label hidden for="translate">
                  Translate to
                  <select id="translate">
                    <option value="en">English</option>
                    <option value="pt">Portuguese</option>
                    <option value="es">Spanish</option>
                    <option value="ru">Russian</option>
                    <option value="tr">Turkish</option>
                    <option defaultValue="fr">French</option>
                  </select>
                </label>
                <button hidden type="submit">
                  Translate
                </button>
              </div>
            ))}
          </ul>
        </div>
      )}
      {/* detects language */}

      <form onSubmit={handleSubmit}>
        {/* user input textarea */}
        <label for="input">Input:</label>
        <textarea id="input" placeholder="Type here..."></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
