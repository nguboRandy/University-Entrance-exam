import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import questionsData from './questions.json';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  useEffect(() => {
    const shuffledQuestions = shuffleArray(questionsData).slice(0, 10);
    setQuestions(shuffledQuestions);
  }, []);

  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const calculateFinalScore = () => {
    const totalScore = Math.min(correctAnswers * 10, 100);
    return `${totalScore}%`;
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAttempts(0);
      setSelectedOption(null);
    } else {
      setAssessmentComplete(true);
    }
  };

  const handleOptionSelect = (selectedOptionIndex) => {
    if (attempts < 3) {
      const selectedQuestion = questions[currentQuestionIndex];
      setSelectedOption(selectedOptionIndex);

      if (attempts === 2) {
        if (selectedOptionIndex === selectedQuestion.correctAnswer) {
          setCorrectAnswers(correctAnswers + 1);
        }
        setAttempts(3); 
      } else {
        setAttempts(attempts + 1);
      }
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = questions.length;
    const remainingAttempts = 3 - attempts;  //calculating remaining attemts

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.subjectText}>Information Technology Entrance Exam 2023</Text>
        <Image source={require('./logo.png')} style={styles.image} />
        <Text style={styles.questionNumber}>{`Question ${questionNumber} of ${totalQuestions}`}</Text>
       
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        <Text style={styles.remainingAttempts}>{`Attempts Remaining: ${remainingAttempts}`}</Text>
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              title={option}
              onPress={() => handleOptionSelect(index)}
              disabled={attempts >= 3}
              style={[
                styles.optionButton,
                selectedOption === index || (attempts === 3 && index === currentQuestion.correctAnswer)
                  ? styles.selectedOptionButton
                  : {},
                selectedOption === index && attempts === 3
                  ? styles.finalSelectedOptionButton
                  : {},
              ]}
            />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          {currentQuestionIndex === 9 ? (
            <Button
              title="Complete Assessment"
              onPress={moveToNextQuestion}
              disabled={attempts < 3}
              style={styles.nextButton}
            />
          ) : (
            <Button
              title="Next Question"
              onPress={moveToNextQuestion}
              disabled={attempts < 3}
              style={styles.nextButton}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {questions.length > 0 ? (
        renderQuestion()
      ) : (
        <Text>Loading questions...</Text>
      )}
      {assessmentComplete && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Assessment Complete!</Text>
          <Text style={styles.finalScoreText}>{`Your final score: ${calculateFinalScore()}`}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  questionContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    marginBottom: 30,
  },
  selectedOptionButton: {
    backgroundColor: 'gray',
    opacity: 0.7,
  },
  finalSelectedOptionButton: {
    backgroundColor: 'green',
    opacity: 0.7,
  },
  nextButton: {
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 18,
  },
  optionsContainer: {
    marginBottom: 30, 
    marginTop:20,
    
  },
  buttonContainer: {
    marginTop: 20, 
  },
  image: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain', 
    marginBottom: 10, 
  },
 subjectText:{
    marginBottom:50,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight:'bold', 
    marginBottom: 10,
  },

});


export default App;
