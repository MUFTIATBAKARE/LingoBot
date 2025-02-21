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
    const summarizeText = async () => {
      console.log(prompt.text);
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
  const handleTranslateText = (e) => {
    e.preventDefault();
    const data = prompts[prompts.length - 1];
    const translateText = async () => {
      if (!("createTranslator" in self)) {
        setIsSupported(false);
        return;
      }
      console.log(selectOption);
      console.log(data);
      try {
        console.log(data.text);
        console.log(selectOption);
        console.log(languageTag);
        const translator = await self.ai.translator.create({
          sourceLanguage: languageTag,
          targetLanguage: selectOption,
        });
        const translation = await translator.translate(data.text);
        console.log(translation);
        setTranslate(translation);
      } catch (error) {
        console.log(error);
        setTranslate(error.message);
        return error;
      }
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
                <h5>{textSummary}</h5>
                <h5>{translate}</h5>
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
