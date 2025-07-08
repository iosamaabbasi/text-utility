import React, { useState, useEffect } from 'react';

export default function TextForm(props) {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('ur');
  const [translatedText, setTranslatedText] = useState('');
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ✅ Text History State
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('textHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadVoices = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      setVoices(loadedVoices);
    };

    loadVoices();

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleOnChange = (e) => setText(e.target.value);
  const handleLangChange = (e) => setTargetLang(e.target.value);

  const speakOriginal = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      props.showAlert("Speech stopped!", "warning");
      return;
    }

    if (!text.trim()) {
      props.showAlert("No text to speak!", "warning");
      return;
    }

    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    msg.rate = 1.3;

    msg.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    window.speechSynthesis.speak(msg);
    props.showAlert("Speaking original text...", "info");
  };

  const speakTranslated = () => {
    if (!translatedText.trim()) {
      props.showAlert("No translation to speak!", "warning");
      return;
    }

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(translatedText);
    utter.lang = targetLang;

    const matchedVoice = voices.find(v => v.lang.startsWith(targetLang));
    if (matchedVoice) utter.voice = matchedVoice;

    utter.rate = 1.5;
    window.speechSynthesis.speak(utter);
    props.showAlert("Speaking translation...", "info");
  };

  const handleTranslate = async () => {
    if (!text.trim()) {
      setTranslatedText("❌ No text provided for translation.");
      props.showAlert("Please enter text to translate.", "warning");
      return;
    }

    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      );
      const data = await res.json();
      const translated = data.responseData.translatedText;
      setTranslatedText(translated);
      props.showAlert("Translated successfully!", "success");
    } catch (err) {
      setTranslatedText("Translation failed!");
      props.showAlert("Translation failed!", "danger");
    }
  };

  const handleAddToHistory = () => {
    const cleaned = text.trim();
    if (cleaned && !history.includes(cleaned)) {
      const newHistory = [cleaned, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('textHistory', JSON.stringify(newHistory));
      props.showAlert("Text added to history!", "success");
    } else {
      props.showAlert("Text already in history or empty!", "warning");
    }
  };

  const vowelCount = (text.match(/[aeiouAEIOU]/g) || []).length;
  const consonantCount = (text.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;

  return (
    <>
      <div className="container" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
        <h1>{props.heading}</h1>

        <div className="mb-3">
          <textarea
            className="form-control"
            value={text}
            onChange={handleOnChange}
            style={{
              backgroundColor: props.mode === 'dark' ? '#13466e' : 'white',
              color: props.mode === 'dark' ? 'white' : 'black'
            }}
            rows="8"
          ></textarea>
        </div>

        {/* Buttons */}
        <button className="btn btn-primary mx-1 my-1" onClick={() => {
          setText(text.toUpperCase());
          props.showAlert("Converted to Uppercase!", "success");
        }}>Uppercase</button>

        <button className="btn btn-secondary mx-1 my-1" onClick={() => {
          setText(text.toLowerCase());
          props.showAlert("Converted to Lowercase!", "success");
        }}>Lowercase</button>

        <button className="btn btn-danger mx-1 my-1" onClick={() => {
          setText('');
          props.showAlert("Text Cleared!", "danger");
        }}>Clear</button>

        <button className="btn btn-warning mx-1 my-1" onClick={() => {
          navigator.clipboard.writeText(text);
          props.showAlert("Text Copied!", "info");
        }}>Copy</button>

        <button className="btn btn-info mx-1 my-1" onClick={() => {
          setText(text.split(/[ ]+/).join(' '));
          props.showAlert("Extra spaces removed!", "success");
        }}>Remove Spaces</button>

        <button className="btn btn-success mx-1 my-1" onClick={() => {
          setText(text.split('').reverse().join(''));
          props.showAlert("Text Reversed!", "primary");
        }}>Reverse</button>

        <button className="btn btn-dark mx-1 my-1" onClick={() => {
          setText(text.replace(/\b\w/g, char => char.toUpperCase()));
          props.showAlert("Capitalized!", "success");
        }}>Capitalize</button>

        <button className="btn btn-outline-danger mx-1 my-1" onClick={() => {
          const element = document.createElement("a");
          const file = new Blob([text], { type: 'text/plain' });
          element.href = URL.createObjectURL(file);
          element.download = "myText.txt";
          document.body.appendChild(element);
          element.click();
          props.showAlert("File Downloaded!", "success");
        }}>Download</button>

        <button className="btn btn-outline-success mx-1 my-1" onClick={speakOriginal}>
          {isSpeaking ? "⏹️ Stop" : "🔊 Speak Original"}
        </button>

        <button className="btn btn-outline-info mx-1 my-1" onClick={handleAddToHistory}>
          ➕ Add to History
        </button>

        {/* Translator */}
        <div className="mt-4">
          <h4>Translate to:</h4>
          <select className="form-select w-25 mb-2" value={targetLang} onChange={handleLangChange}>
            <option value="ur">Urdu</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="ar">Arabic</option>
            <option value="zh">Chinese</option>
          </select>

          <button className="btn btn-outline-primary mx-1 my-1" onClick={handleTranslate}>
            🌐 Translate
          </button>

          <button className="btn btn-outline-warning mx-1 my-1" onClick={speakTranslated}>
            🔊 Speak Translation
          </button>

          <h5 className="mt-3">Translated Preview:</h5>
          <p className="border p-2">{translatedText || "Nothing translated yet!"}</p>
        </div>

        {/* ✅ History Section with ➕ and ❌ */}
        <div className="mt-4">
          <h4>Saved Text History:</h4>
          {history.length === 0 ? (
            <p className="text-muted">No history yet.</p>
          ) : (
            <ul className="list-group">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span style={{ flex: 1 }}>
                    {item.length > 50 ? item.slice(0, 50) + '...' : item}
                  </span>

                  <div className="d-flex">
                    {/* ➕ Restore */}
                    <span
                      className="badge bg-success rounded-pill me-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setText(item);
                        props.showAlert("Text restored from history!", "info");
                      }}
                    >
                      ➕
                    </span>

                    {/* ❌ Remove */}
                    <span
                      className="badge bg-danger rounded-pill"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        const newHist = history.filter((_, i) => i !== index);
                        setHistory(newHist);
                        localStorage.setItem('textHistory', JSON.stringify(newHist));
                        props.showAlert("History item removed!", "danger");
                      }}
                    >
                      ❌
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="container my-3" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
        <h2>Your text summary</h2>
        <p>{text.split(/\s+/).filter((el) => el.length !== 0).length} words, {text.length} characters</p>
        <p>{0.008 * text.split(/\s+/).filter((el) => el.length !== 0).length} Minutes read</p>
        <h3>Vowel Letters: {vowelCount}</h3>
        <h3>Consonant Letters: {consonantCount}</h3>

        <h2>Preview</h2>
        <p>{text.length > 0 ? text : "Nothing to preview!"}</p>
      </div>
    </>
  );
}
