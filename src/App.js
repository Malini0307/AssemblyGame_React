import './App.css';
import React from 'react'
import { languages } from './language';
import clsx from 'clsx';
import Confetti from 'react-confetti'
import {getFarewellText, getRandomWord} from './utils'

function App() {

// State values
    const [currentWord,setCurrentWord] = React.useState(getRandomWord())
    const [guessed,setGuessed] = React.useState([])

// Derived Values
    const wrongGuessCount =
        guessed.filter(char => !currentWord.includes(char)).length
    
    const numGuessesLeft = guessed[guessed.length - 1]
    const isGamwWon = 
        currentWord.split('').every(char => guessed.includes(char))
    const isGameLost = wrongGuessCount >= languages.length-1
    const isGameOver = isGamwWon || isGameLost
    const lastGuessedLetter = numGuessesLeft
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  
    
// Static value
    const alphabet = "abcdefghijklmnopqrstuvwxyz"


// To render a word and we don't want to type a same letter if it presents more than one time,it automatically fill the blanks when one click
    function handleKeyPress(char){
      setGuessed((prevGuessed) => 
        prevGuessed.includes(char) ? 
            prevGuessed :
            [...prevGuessed, char])
    }

// Start a new game
    function startNewGame(){
      setCurrentWord(getRandomWord())
      setGuessed([])

    }
  
// Split the alphabet and map them with a random word if its mached or not
    const keyboardElements = alphabet.split('').map(char => {
      const isGuessed = guessed.includes(char)
      const isCorrect = isGuessed && currentWord.includes(char)
      const isWrong = isGuessed && !currentWord.includes(char)
      const className = clsx({
        correct: isCorrect,
        wrong: isWrong
      })
      return(
        <button
        className={className}
           key={char}
           disabled={isGameOver}
           aria-label={`Letter ${char}`}
           aria-disabled={guessed.includes(char)}
           onClick={() => handleKeyPress(char)}
        >
        {char.toUpperCase()}
        </button>

      )
})
    
// This block shows the letter we typed and we missed in uppercase
      const letterElements = currentWord.split('').map((letter,index) => {
        const shouldRevealLetter = isGameLost || guessed.includes(letter)
        const letterClassName = clsx(
          isGameLost && !guessed.includes(letter) && "missed-letter"
        )
        return(
          <span key={index} className={letterClassName}>
            {shouldRevealLetter ? letter.toUpperCase() : ""}
          </span>
        )
})
    
  
// import the languages from external file called language.js and assign them a colors
    const languageElements = languages.map((lang,index) => {
      const isLanguageLost = index < wrongGuessCount
      const styles = {
        backgroundColor: lang.backgroundColor,
        color: lang.color
      }
      const className = clsx("chip", isLanguageLost && "lost")
      return(
        <span 
          className={className}
          style = {styles}
          key={lang.name}
        >
          {lang.name}
        </span>
      )
    })


// To exhibit the current status like win,loss or farewell
    const gameStatusClass = clsx("status", {
      won: isGamwWon,
      lost: isGameLost,
      farewell: !isGameOver && isLastGuessIncorrect
    })

// Based on game status the messages are displayed
    function renderGameStatus(){
      if(!isGameOver && isLastGuessIncorrect){
        return (
            <p className='farewell-message'>
              {getFarewellText(languages[wrongGuessCount - 1].name)}
            </p>
        )
      }
      if(isGamwWon){
        return(
          <>
              <h4>You win!</h4>
              <p>Well done! 🎉</p>
          </>
        )
      }
      if(isGameLost){
        return(
          <>
              <h4>Game Over!</h4>
              <p>You lose! Better start learning Assembly 😰</p>
          </>
        )
      }
    }




  return (
    <main>
      {isGamwWon && <Confetti 
            recycle={false}
            numberOfPieces={1000}
            width={window.innerWidth} 
            height={window.innerHeight}
          />
      }

      <div className="container">
            <h1 className='title'>Assembly: Endgame</h1>
            <p className='instructions'>
                Guess the word within 8 attempts to keep the programming world 
                safe from Assembly!
            </p>
        </div>

        <div className={gameStatusClass}
           aria-live='polite' 
           role='status'
        > 
            {renderGameStatus()}
        </div>

        <div className='language-chips'>
          {languageElements}
        </div>

        <div className='word'>
          {letterElements}
        </div>

        <div className='characters'>
          {keyboardElements}
        </div>

        {isGameOver && <button className='newGame' onClick={startNewGame}>New Game</button>}

        <section 
            className='sr-only' 
            aria-live='polite' 
            role='status'
        >
           <p>
                {currentWord.includes(lastGuessedLetter) ? 
                    `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                    `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                }
                 You have {numGuessesLeft} attempts left.
            </p>
            <p>
                Current Word: {
                    currentWord.split("").map(char =>
                    guessed.includes(char) ? char + "":"blank").join("")
            }
           
            </p>

        </section>
    </main>
  );
}

export default App;
