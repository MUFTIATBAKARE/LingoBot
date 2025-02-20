"use client";

import { useState, useRef } from "react";
import { FiSend } from "react-icons/fi";
export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [isSupported, setIsSupported] = useState(true);
  const [language, setLanguage] = useState(null);
  const [textSummary, setTextSummary] = useState(null);

  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = inputRef.current.value;
    setPrompts((prevPrompts) => [...prevPrompts, data]);
    inputRef.current.value = "";
    const detectLanguage = async () => {
      if (!("translation" in self)) {
        setIsSupported(false);
        return;
      }
      try {
        const detector = await self.ai.languageDetector.create();
        // const detector = self.translation.createDetector();
        const { detectedLanguage } = (await detector.detect(data.trim()))[0];
        const languageTagToHumanReadable = (
          detectedLanguage,
          targetLanguage
        ) => {
          const displayNames = new Intl.DisplayNames([targetLanguage], {
            type: "language",
          });
          return displayNames.of(detectedLanguage);
        };
        const humanReadableLanguage = languageTagToHumanReadable(
          detectedLanguage,
          "en"
        );
        setLanguage(humanReadableLanguage);
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    detectLanguage();
  };

  const handleTextSummarize = (e) => {
    e.preventDefault();
    const summarizeText = async () => {
      console.log(prompts);
      const data = prompts[prompts.length - 1];
      console.log(data);
      if (!("summarizer" in self)) {
        setIsSupported(false);
        return;
      }
      try {
        const options = {
          type: "key-points",
          format: "plain-text",
          length: "medium",
        };

        const summarizer = await self.ai.summarizer.create(options);
        const result = await summarizer.summarize(data);
        const { summary } = result[0];
        setTextSummary(summary);
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    summarizeText();
  };
  return (
    <div className="main-container">
      {prompts.length > 0 && (
        <div className="container">
          <ul>
            {prompts.map((prompt, index) => (
              <div key={index} className="prompt-container">
                <li>{prompt}</li>
                <p>{language}</p>
                <button
                  type="button"
                  className="summarize_btn"
                  onClick={handleTextSummarize}
                >
                  Summarize
                </button>
                <label hidden htmlFor="output">
                  Summary/Translation:
                </label>
                <output>{textSummary}</output>
                <label htmlFor="translate">
                  <select id="translate" className="translate-select">
                    <option defaultValue="Translate">Translate</option>
                    <option value="en">English</option>
                    <option value="pt">Portuguese</option>
                    <option value="es">Spanish</option>
                    <option value="ru">Russian</option>
                    <option value="tr">Turkish</option>
                    <option Value="fr">French</option>
                  </select>
                </label>
              </div>
            ))}
          </ul>
        </div>
      )}
      {/* detects language */}

      <form onSubmit={handleSubmit}>
        <label hidden htmlFor="input">
          Input:
        </label>
        <textarea
          id="input"
          ref={inputRef}
          placeholder="Type here..."
        ></textarea>
        <button className="snd-btn" type="submit">
          <FiSend />
        </button>
      </form>
    </div>
  );
}
