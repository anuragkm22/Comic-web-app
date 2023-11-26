import React, { useState, useEffect } from 'react';
import './App.css';
import { query } from './Api';
import FeedbackForm from './FeedbackForm.js';

function App() {
  const [panels, setPanels] = useState(Array(10).fill(''));
  const [comicImages, setComicImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isComicGenerated, setIsComicGenerated] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [annotations, setAnnotations] = useState(Array(10).fill([]));
  const [showBackButton, setShowBackButton] = useState(false);

  const handleTextChange = (index, text) => {
    if (/[^a-zA-Z\s\d]/.test(text)) {
      setError(`Panel ${index + 1} should only contain alphabetic characters and spaces.`);
    } else {
      const sanitizedText = text.replace(/[^a-zA-Z\s\d]/g, '').substring(0, 500);

      const newPanels = [...panels];
      newPanels[index] = sanitizedText;
      setPanels(newPanels);
      setError('');
    }
  };


  const generateComic = () => {
    if (panels.some(panel => !panel.trim())) {
      setErrorMessage('ERROR:All panels must have text');
      return;
    }
    setComicImages([]);
    setErrorMessage('');
    setIsLoading(true);
    Promise.all(panels.map((panelText) => query({ inputs: panelText })))
      .then(imageUrls => {
        setComicImages(imageUrls);
        setIsComicGenerated(true);
      })
      .catch(error => {
        setErrorMessage(error.message);
      });
  };

  const handleFeedbackButtonClick = () => {
    setShowFeedbackForm(true);
  };

  const closeFeedbackForm = () => {
    setShowFeedbackForm(false);
  };

  const addAnnotation = (panelIndex, text, x, y) => {
    const newAnnotations = [...annotations];
    newAnnotations[panelIndex] = [...newAnnotations[panelIndex], { text, x, y }];
    setAnnotations(newAnnotations);
  };

  const handlePanelClick = (panelIndex, event) => {
    event.preventDefault();
    event.stopPropagation();
    const { offsetX, offsetY } = event.nativeEvent;
    const text = prompt("Enter text for the speech bubble:");
    if (text) {
      addAnnotation(panelIndex, text, offsetX, offsetY);
    }
  };



  useEffect(() => {
    const handleScroll = () => {
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
      setShowBackButton(bottom);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  const handleBackButtonClick = () => {
    setPanels(Array(10).fill(''));
    setIsComicGenerated(false);
    window.scrollTo(0, 0);
    setIsLoading(false);
  };

  const handleFeedbackBackClick = () => {
    setShowFeedbackForm(false);
  };

  return (
    <div className="App">
      {showFeedbackForm ? (
        <FeedbackForm
          onSubmit={() => { }}
          onBack={handleFeedbackBackClick}
        />
      ) : (
        <>
          <h1>Comic Strip Generator</h1>

          {!isComicGenerated && (
            <div className="comic-form">
              {panels.map((panelText, index) => (
                <div key={index} className="panel">
                  <label htmlFor={`panel${index + 1}`}>{`Panel ${index + 1}:`}</label>
                  <textarea
                    id={`panel${index + 1}`}
                    value={panelText}
                    onChange={(e) => handleTextChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
              <button onClick={generateComic} className="button1-style" disabled={isLoading}>
                {isLoading ? 'Generating, please wait...' : 'Generate Comic'}
              </button>

              <button type="reset" className="reset-button" onClick={() => {
                setPanels(Array(10).fill(''));
                setIsLoading(false);
              }}>
                Reset Comic Form
              </button>

            </div>
          )}

          {isComicGenerated && (
            <div className="comic-display">
              {comicImages.map((image, index) => (
                <div key={index} className="comic-panel" onClick={(e) => handlePanelClick(index, e)}>
                  <img src={image} alt={`Panel ${index + 1}`} />
                  {annotations[index].map((annotation, annIndex) => (
                    <div key={annIndex} className="speech-bubble" style={{ left: annotation.x, top: annotation.y }}>
                      {annotation.text}
                    </div>
                  ))}
                  <p className="overlay-text">{panels[index]}</p>

                </div>
              ))}
              {showBackButton && (
                <div className="bottom-button">
                  <button onClick={(e) => handleBackButtonClick(e)} className="button-style">
                    Back to Comic Form
                  </button>
                </div>
              )}
            </div>
          )}



          {!isComicGenerated && (<button onClick={handleFeedbackButtonClick} className="button1-style">
            Provide Feedback
          </button>
          )}

          {!showFeedbackForm && <p className="error-message">{errorMessage}</p>}

        </>
      )}
    </div>
  );
}
export default App;


