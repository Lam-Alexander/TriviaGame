import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API calls
import './MainPage.css';

const MainPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); 
  const [score, setScore] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); 

  // Fetch questions from the server
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/questions');
      const shuffledQuestions = shuffleArray(response.data);
      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && answer === currentQuestion.correctAnswer) {
      setFeedback('Correct!');
      setFeedbackType('correct'); // Set feedback type for correct answer
      setScore(score + 1);
    } else {
      setFeedback(`Wrong! The correct answer is: ${currentQuestion?.correctAnswer}`);
      setFeedbackType('wrong'); // Set feedback type for wrong answer
    }
    setShowNext(true);
    // Add question to answered set
    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionIndex));
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback('');
    setFeedbackType(''); // Reset feedback type
    setShowNext(false);
    
    // Move to the next question or reset if all questions are answered
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      alert(`Quiz completed! Your score: ${score}/${questions.length}`);
      setCurrentQuestionIndex(0);
      setScore(0);
      setAnsweredQuestions(new Set()); // Reset answered questions
      fetchQuestions(); // Fetch new questions
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Combine correct answer with wrong answers for the options
  const options = [
    ...(Array.isArray(currentQuestion.answers) ? currentQuestion.answers : []),
  ];
  if (!options.includes(currentQuestion.correctAnswer)) {
    options.push(currentQuestion.correctAnswer);
  }

  const shuffledOptions = options.sort(() => Math.random() - 0.5);

  return (
    <div>
      <h1 className='header-title'>Trivia Game</h1>
      <div>
        <h2 className='question'>{currentQuestion?.questionText || 'No Question Available'}</h2>

        <div className="button-container">
          {shuffledOptions.map((answer, index) => (
            <button
              className='answer-button'
              key={index}
              onClick={() => handleAnswerSelection(answer)}
              disabled={!!selectedAnswer}
            >
              {answer}
            </button>
          ))}
        </div>
        
        {feedback && (
          <p className={feedbackType === 'correct' ? 'feedback-correct' : 'feedback-wrong'}>
            {feedback}
          </p>
        )}
      </div>

      {showNext && (
        <button className='next-question-button' onClick={handleNextQuestion}>
          Next Question
        </button>
      )}
      <div>
        <p>Score: {score}</p>
        <p>Total Questions: {questions.length}</p> {/* Display total questions */}
      </div>
    </div>
  );
};

export default MainPage;
