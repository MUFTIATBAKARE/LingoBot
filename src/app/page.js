"use client";

import { useState, useRef } from "react";
import { FiSend } from "react-icons/fi";
export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [isSupported, setIsSupported] = useState(true);
  const [languageTag, setLanguageTag] = useState(null);
  const [textSummary, setTextSummary] = useState("");
  const [translate, setTranslate] = useState("");
  const [selectOption, setSelectOption] = useState("");

  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = inputRef.current.value;
    const newPrompt = { text: data, language: null };
    setPrompts((prevPrompts) => [...prevPrompts, newPrompt]);
    inputRef.current.value = "";
    const detectLanguage = async () => {
      if (!("translation" in self)) {
        setIsSupported(false);
        return;
      }
      try {
        const detector = await self.ai.languageDetector.create();
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
        setLanguageTag(detectedLanguage);
        setPrompts((prevPrompts) => {
          const updatedPrompts = [...prevPrompts];
          updatedPrompts[updatedPrompts.length - 1].language =
            humanReadableLanguage;
          return updatedPrompts;
        });
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    detectLanguage();
  };

  const handleTextSummarize = (e) => {
    e.preventDefault();
    const data = prompts[prompts.length - 1];
    if (data.text.length > 150) {
      const summarizeText = async () => {
        const options = {
          type: "key-points",
          format: "plain-text",
          length: "medium",
        };
        const summarizer = await self.ai.summarizer.create(options);
        const result = await summarizer.summarize(data.text);
        console.log(result);
        setTextSummary(result);
      };
      summarizeText();
    } else {
      setTextSummary("The text must be more than 150 characters!");
    }
  };
  const handleTranslateText = (e) => {
    e.preventDefault();
    const data = prompts[prompts.length - 1];
    const translateText = async () => {
      const translator = await self.ai.translator.create({
        sourceLanguage: languageTag,
        targetLanguage: selectOption,
      });
      const translation = await translator.translate(data.text);
      setTranslate(translation);
    };
    translateText();
  };
  return (
    <div className="main-container">
      {prompts.length > 0 && (
        <div className="container">
          <ul>
            {prompts.map((prompt, index) => (
              <div key={index} className="prompt-container">
                <li>{prompt.text}</li>
                <p>{prompt.language}</p>
                <div className="btn-container">
                  <button
                    type="button"
                    className="summarize_btn"
                    onClick={handleTextSummarize}
                  >
                    Summarize
                  </button>
                  <div>
                    <button
                      type="button"
                      className="translate-select"
                      onClick={handleTranslateText}
                    >
                      Translate
                    </button>
                    <label htmlFor="translate">
                      <select
                        id="translate"
                        value={selectOption}
                        onChange={(e) => {
                          setSelectOption(e.target.value);
                        }}
                      >
                        <option value="en">English</option>
                        <option value="pt">Portuguese</option>
                        <option value="es">Spanish</option>
                        <option value="ru">Russian</option>
                        <option value="tr">Turkish</option>
                        <option value="fr">French</option>
                      </select>
                    </label>
                  </div>
                </div>
                <p>{textSummary}</p>
                <p>{translate}</p>
              </div>
            ))}
          </ul>
        </div>
      )}

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
