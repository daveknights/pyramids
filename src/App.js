import React, { Fragment, useEffect, useState, useCallback } from 'react';
import Levels from './Levels';
import Pyramid from './Pyramid';
import BonusLevel from './BonusLevel';
import TimeIndicator from './TimeIndicator';
import Navigation from './Navigation';
import DisplayMessage from './DisplayMessage';
import './App.css';
const initialBlockWidths = ['320', '280', '240', '200', '160', '120'];
const initialBonusParts = [...Array(11).keys()];
const levels = {
  1: {widths: [...initialBlockWidths]},
  2: {widths: [...initialBlockWidths, '360']},
  3: {widths: [...initialBlockWidths, '360', '400']},
  4: {widths: [...initialBlockWidths, '360', '400', '440']},
  5: {widths: [...initialBlockWidths, '360', '400', '440', '480']},
  6: {widths: [...initialBlockWidths, '360', '400', '440', '480', '520']},
};

const initialLevelData = {};
// Populate initialLevelData
for (const level in levels) {
  parseInt(level) === 1 ? initialLevelData[level] = {locked: false, star: false} :
    initialLevelData[level] = {locked: true, star: false};
}
initialLevelData['bonus'] = {locked: true, star: false}

let timeClass = '';
let gameTimer;
let gameTime = 0;

const App = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [level, setLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [blockWidths, setBlockWidths] = useState(initialBlockWidths);
  const [bonusParts, setBonusParts] = useState(initialBonusParts);
  const [timeIndicatorValue, setTimeIndicatorValue] = useState(0);
  const [levelData, setLevelData] = useState(initialLevelData);
  const [playing, setPlaying] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [message, setMessage] = useState('');

  const stopTimer = () => {
    clearInterval(gameTimer);
    gameTimer = null;
    setMessage(`Time's Up!`);
  };

  const upDateTimeIndicator = useCallback((chosenLevel, widthArray = null) => {
    const levelDifficulty = difficulty === 'normal' ? 1 : 1.5;
    const bonusDifficulty = difficulty === 'normal' ? 1.5 : 2;
    const partsLength = chosenLevel === 'bonus' ? bonusParts.length * bonusDifficulty : widthArray.length * levelDifficulty;

    gameTime += 0.1;
    setTimeIndicatorValue((gameTime / partsLength) * 100);

    if (!timeClass && gameTime > partsLength - 1) {
      timeClass = ' final-second';
    }

    gameTime >= partsLength && stopTimer();
  }, [bonusParts.length, difficulty]);

  const startTimer = useCallback((chosenLevel, widthArray) => {
    !gameTimer && (gameTimer = setInterval(() => upDateTimeIndicator(chosenLevel, widthArray), 100));
  }, [upDateTimeIndicator]);

  const showLevels = () => {
    setPlaying(false);
    setIsSolved(false);
    stopTimer();
    setMessage('');
  };

  const handleSelectLevel = e => {
    if (e.target.classList.contains('playable') || e.target.classList.contains('unlocked')) {
      setPlaying(true);

      if (e.target.textContent === 'Bonus Level') {
        startLevel('bonus')
      } else if (e.target.parentNode.classList.contains('level')) {
        startLevel(parseInt(e.target.textContent));
      }
    }
  };

  const handleSetDifficulty = e => setDifficulty(e.target.dataset.difficulty);

  const shuffle = widths => widths
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value).slice(0, widths.length);

  const startLevel = useCallback((chosenLevel,  action = null) => {
    let widthArray = null;
    setMessage('');

    if (action === 'next level' && (chosenLevel !== 'bonus' && chosenLevel !== 6)) {
      setLevel(level => level + 1);
      setBlockWidths(shuffle(levels[level + 1].widths));
      chosenLevel = chosenLevel + 1;
      widthArray = levels[level + 1].widths;
    } else if ((action === 'next level' && level === 6) || chosenLevel === 'bonus') {
      chosenLevel = 'bonus';
      setLevel('bonus');
      setBonusParts(bP => shuffle(bP));
    } else {
      setLevel(chosenLevel);
      setBlockWidths(shuffle(levels[chosenLevel].widths));
      widthArray = levels[chosenLevel].widths
    }

    timeClass = '';
    startTimer(chosenLevel, widthArray);
  }, [startTimer, level]);

  useEffect (() => {
    let sorted;

    const updateLevelData = () => {
      gameTimer && setMessage('Well Done!');
      clearInterval(gameTimer);

      if (gameTimer && !completedLevels.includes(level)) {
        const updatedLevelData = {...levelData};

        setCompletedLevels(current => [...current, level]);

        updatedLevelData[level].locked === true && (updatedLevelData[level].locked = false);
        updatedLevelData[level].star === false && (updatedLevelData[level].star = true);

        if (level < 6 && updatedLevelData[level + 1].locked === true) {
          updatedLevelData[level + 1].locked = false;
        }

        if (completedLevels.length + 1 === 6) {
          updatedLevelData['bonus'].locked = false;
        }

        setLevelData(updatedLevelData);
      }
    };

    const checkBonusSorting = () => {
      for (const part of bonusParts) {
          if (bonusParts[part] > bonusParts[part + 1]) {
            sorted = false;
            break;
          } else {
            sorted = true;
          }
      }

      sorted && updateLevelData();

      gameTimer && setIsSolved(sorted);
      isSolved && (gameTimer = null);
    };

    const checkSorting = () => {
      for (const width in blockWidths) {
          if (parseInt(width) > 0 && parseInt(blockWidths[width]) !== parseInt(blockWidths[parseInt(width) - 1]) + 40) {
            sorted = false;
            break;
          } else {
            sorted = true;
          }
      }

      sorted && updateLevelData();

      gameTimer && setIsSolved(sorted);
      isSolved && (gameTimer = null);
    }

    playing && (level !== 'bonus' ? checkSorting() : checkBonusSorting());
  }, [completedLevels, isSolved, levelData, bonusParts, level, blockWidths, playing]);

  const handleNavBtnClick = e => {
    gameTime = 0;
    setIsSolved(false);

    switch (e.target.dataset.action) {
      case 'to levels':
        showLevels();
        break;
      case 'try again':
        startLevel(level);
        break;
      case 'next level':
        startLevel(level, e.target.dataset.action);
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      <h1>PYR▲MIDS</h1>
      {!playing && <Levels
        levelData={levelData}
        handleSelectLevelFn={handleSelectLevel}
        difficulty={difficulty}
        handleSetDifficultyFn={handleSetDifficulty} />}
      {playing && (!gameTimer || isSolved) && <Navigation
        showNext={completedLevels.includes(level) && level !== 'bonus' }
        handleNavBtnClickFn={handleNavBtnClick} />}
      {(playing && level !== 'bonus') && <Pyramid
        blockWidths={blockWidths}
        setBlockWidths={setBlockWidths}
        isSolved={isSolved} />}
      {(playing && level === 'bonus') && <BonusLevel
        parts={bonusParts}
        setBonusParts={setBonusParts} />}
      {message && <DisplayMessage message={message} />}
      {playing && <TimeIndicator
        timeClass={timeClass}
        value={timeIndicatorValue} />}
    </Fragment>
  );
}

export default App;
