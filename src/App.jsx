import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Radio from "./component/Radio";
import demoGif from "./assets/demo.png";
import ProgressBar from "@ramonak/react-progress-bar";

function App() {
  let colors = [
    { name: "Blue", color: "bg-blue-500", text: "text-blue-500" },
    { name: "Red", color: "bg-red-600", text: "text-red-600" },
    { name: "Orange", color: "bg-orange-600", text: "text-orange-600" },
    { name: "Yellow", color: "bg-yellow-500", text: "text-yellow-400" },
    { name: "Gray", color: "bg-gray-600", text: "text-gray-600" },
    { name: "Lime", color: "bg-lime-400", text: "text-lime-400" },
    { name: "Black", color: "bg-black", text: "text-black" },
    { name: "Purple", color: "bg-purple-600", text: "text-purple-600" },
    { name: "Pink", color: "bg-pink-600", text: "text-pink-600" },
  ];

  const [gameStart, setGameStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [level, setLevel] = useState("Easy");
  const [htp, setHTP] = useState(false);
  const [randomColor, setRandomColor] = useState([]);
  const [pause, setPause] = useState(true);
  const [pauseInterval, setPauseInterval] = useState(null);
  const [chosenColor, setChosenColor] = useState([]);
  const [textRandomColor, setTextRandomColor] = useState([]);
  const [score, setScore] = useState(0);
  const [easyHighScore, setEasyHighScore] = useState(0);
  const [midHighScore, setMidHighScore] = useState(0);
  const [hardHighScore, setHardHighScore] = useState(0);
  const [correctClk, setCorrectClk] = useState(0);
  const [incorrectClk, setIncorrectClk] = useState(0);
  let [time, setTime] = useState(59);

  const easyHigh = localStorage.getItem("easyHS");
  const midHigh = localStorage.getItem("midHS");
  const hardHigh = localStorage.getItem("hardHS");

  const initialRandomizer = useCallback(() => {
    let hardness = 4;
    if (level === "Medium") {
      hardness = 6;
    } else if (level === "Hard") {
      hardness = 9;
    } else {
      hardness = 4;
    }
    let numArr = [];
    let color = [];

    while (numArr.length < hardness) {
      let randomNum = Math.floor(Math.random() * colors.length);
      if (numArr.indexOf(randomNum) === -1) {
        numArr.push(randomNum);
      }
    }
    numArr.map((val) => {
      color.push(colors[val]);
    });

    if (color?.length > 0) {
      setRandomColor(color);
    }
    numArr = [];
    color = [];
  }, [level]);

  useEffect(() => {
    if (level === "Easy") {
      if (easyHigh) {
        setEasyHighScore(JSON.parse(easyHigh));
      } else {
        setEasyHighScore(0);
      }
    } else if (level === "Medium") {
      if (midHigh) {
        setMidHighScore(JSON.parse(midHigh));
      } else {
        setMidHighScore(0);
      }
    } else if (level === "Hard") {
      if (hardHigh) {
        setHardHighScore(JSON.parse(hardHigh));
      } else {
        setHardHighScore(0);
      }
    }
  }, [level]);

  useEffect(() => {
    colorRandomizer();
    textRandomizer();
  }, [randomColor]);

  useEffect(() => {
    highScoreCalculatorAndGameOver();
    if (midHigh < midHighScore) {
      localStorage.setItem("midHS", JSON.stringify(midHighScore));
    } else if (hardHigh < hardHighScore) {
      localStorage.setItem("hardHS", JSON.stringify(hardHighScore));
    } else if (easyHigh < easyHighScore) {
      localStorage.setItem("easyHS", JSON.stringify(easyHighScore));
    }
  }, [time === 0]);

  function colorRandomizer() {
    let temp = [];
    const randomNum = Math.floor(Math.random() * randomColor.length);
    if (randomColor?.length > 0) {
      temp.push(randomColor[randomNum]);
    }
    if (temp?.length > 0) {
      setChosenColor(temp);
    }
    temp = [];
  }

  function textRandomizer() {
    let temp = [];
    const randomNum = Math.floor(Math.random() * randomColor.length);
    if (randomColor?.length > 0) {
      temp.push(randomColor[randomNum]);
    }
    if (temp?.length > 0) {
      setTextRandomColor(temp);
    }
    temp = [];
  }

  function timer() {
    setTimeout(() => {
      time--;
      setPauseInterval(
        setInterval(() => {
          if (time >= 0) {
            setTime(time--);
          }
        }, 1000)
      );
    }, 0);
  }
  function reset() {
    setEnd(false);
    setGameStart(true);
    initialRandomizer();
    setScore(0);
    setCorrectClk(0);
    setIncorrectClk(0);
    start();
  }

  function start() {
    timer();
    setGameStart(true);
    initialRandomizer();
  }

  function pauseTime() {
    if (pause) {
      clearInterval(pauseInterval);
    } else {
      timer();
    }
    setPause((prev) => !prev);
  }

  function highScoreCalculatorAndGameOver() {
    if (time === 0) {
      clearInterval(pauseInterval);
      setTimeout(() => {
        setEnd(true);
        setGameStart(false);
        setTime(59);
        setIncorrectClk((prev) => prev + 1);
        if (level === "Easy") {
          setEasyHighScore((prev) => (prev < score ? score : prev));
        } else if (level === "Medium") {
          setMidHighScore((prev) => (prev < score ? score : prev));
        } else if (level === "Hard") {
          setHardHighScore((prev) => (prev < score ? score : prev));
        }
      }, 100);
    }
  }

  function handleChangeRadio(e) {
    if (e.target.value === "Medium") setLevel("Medium");
    else if (e.target.value === "Hard") setLevel("Hard");
    else setLevel("Easy");
  }

  function scoreCalculator(right, val) {
    if (time === 0) {
      return;
    } else {
      right
        ? (setScore((prev) => prev + val), setCorrectClk((prev) => prev + 1))
        : (setScore((prev) => (prev >= val ? prev - val : 0)),
          setIncorrectClk((prev) => prev + 1));
      setShowScore((prev) => !prev),
        setTimeout(() => {
          setShowScore(false);
        }, 300),
        right ? setCorrect(true) : setCorrect(false);

      if (level === "Medium") {
        setTimeout(() => {
          initialRandomizer();
        }, 200);
      } else if (level === "Hard") {
        setTimeout(() => {
          initialRandomizer();
        }, 200);
      } else {
        setTimeout(() => {
          initialRandomizer();
        }, 200);
      }
    }
  }

  return (
    <div className="container relative">
      {!gameStart && !end && (
        <div className="absolute top-0 left-0 min-h-dvh pb-8 flex flex-col items-center z-30 bg-[#f0f0f0] w-full justify-center">
          <div className="absolute top-6 right-6 z-40">
            <button
              onClick={() => setHTP(true)}
              className="cursor-pointer px-2 py-1 h-fit rounded-lg text-xl sm:text-2xl lg:text-3xl lg:p-4 outline-[#a8a8a8] hover:outline-[#000000] outline"
            >
              &#10067;
            </button>
          </div>
          <h1 className="text-xs xsm:p-8 xsm:text-2xl sm:text-4xl lg:text-6xl font-start2P uppercase bg-[linear-gradient(to_top,_#505285_0%,_#585e92_12%,_#65689f_25%,_#7474b0_37%,_#7e7ebb_50%,_#8389c7_62%,_#9795d4_75%,_#a2a1dc_87%,_#b5aee4_100%)] drop-shadow-[0_0_4px_white] bg-clip-text text-transparent ">
            Colors
          </h1>
          {htp && (
            <div className="bg-[#f0f0f0] z-[60] absolute top-0 left-0 h-dvh block xsm:w-full xsm:min-h-fit xsm:grid xsm:place-items-center ">
              <div className="bg-[#d5d5d5] relative rounded-lg xsm:w-11/12 xsm:mx-auto xsm:my-4 sm:max-w-[1000px]">
                <button
                  onClick={() => setHTP(false)}
                  className="absolute right-0 p-4 cursor-pointer text-sm hover:drop-shadow-[0_2px_2px_#000] transition-colors xsm:text-lg xsm:p-8 sm:text-2xl sm:p-12 lg:text-4xl"
                >
                  &#10060;
                </button>
                <img
                  src={demoGif}
                  className="w-24 mx-auto mt-4 xsm:w-56 sm:w-72 lg:w-96"
                  alt="demo"
                />
                <div className="p-8 pt-0 text-xs xsm:text-xl xsm:p-12 xsm:pt-0 sm:text-2xl sm:p-20 sm:pt-0 lg:text-4xl lg:p-28 lg:pt-0 font-lato">
                  <h3 className="font-extrabold">How to Play :</h3>
                  <ol className="list-decimal">
                    <div className="mt-2 ml-8">
                      <li className="mb-2">Look at the word on the screen.</li>
                      <li className="mb-2">
                        The word may be written in a color that is different
                        from its meaning.
                      </li>
                      <li className="mb-4">
                        Pick the color that matches the meaning of the word, not
                        the color it’s written in.
                      </li>
                    </div>
                  </ol>
                  <h3 className="font-extrabold">Remember :</h3>
                  <p className="mt-2 ml-8">
                    The word's meaning is more important than the color it’s
                    written in!
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-center xsm:pb-6">
            <Radio
              onChange={(e) => handleChangeRadio(e)}
              labelInfo={"Easy"}
              defaultChecked
            />
            <Radio
              onChange={(e) => handleChangeRadio(e)}
              labelInfo={"Medium"}
            />
            <Radio onChange={(e) => handleChangeRadio(e)} labelInfo={"Hard"} />
          </div>
          <button
            className="bg-[#d5d5d5] p-4 xsm:px-8 xsm:py-4 sm:px-10 shadow-black shadow-sm hover:bg-[#919191] hover:text-white transition-colors rounded-lg text-slate-500 font-extrabold font-lato text-xs xsm:text-sm sm:text-lg lg:text-xl uppercase mt-2 "
            onClick={start}
          >
            Start
          </button>
          {!htp && (
            <h4
              className={`bottom-2 absolute left-2/4 -translate-x-2/4 z-50 font-lato text-xs xsm:text-sm sm:text-lg lg:text-xl mt-8 text-slate-500 text-center`}
            >
              🧠 Inspired by Super Brain Training app{" "}
              <a
                target="_blank"
                href="https://play.google.com/store/apps/details?id=godlinestudios.brain.training&pcampaignid=web_share"
              >
                🔗
              </a>
            </h4>
          )}
        </div>
      )}
      {gameStart && (
        <div
          className={`max-w-[600px] m-auto ${
            level === "Hard" && "pb-20"
          } xsm:pb-10`}
        >
          <h4
            className={`${showScore ? "score" : "hideScore"} ${
              correct ? "correct" : "incorrect"
            }`}
          >
            {`${
              correct
                ? "+100"
                : level === "Easy" && score >= 40
                ? "-150"
                : level === "Medium" && score >= 40
                ? "-250"
                : level === "Hard" && score >= 40
                ? "-400"
                : "0"
            } `}
          </h4>
          <div className="flex justify-center gap-2 xsm:justify-between flex-wrap max-w-[400px] m-auto">
            <div className="bg-[#d5d5d5] rounded-lg shadow-black shadow-sm">
              <p className="cursor-not-allowed text-slate-800 font-lato font-medium drop-shadow-[1px_0_1px_#000] rounded-lg w-fit px-4 py-2 xsm:text-lg sm:text-xl lg:text-2xl">
                {`${time >= 10 ? "00:" : "00:0"}${time}`}
              </p>
            </div>
            <button
              className="bg-[#d5d5d5] px-4 py-2 shadow-black shadow-sm hover:bg-[#3c3c3c] hover:text-white transition-colors rounded-lg text-slate-800 font-lato font-extrabold xsm:text-lg sm:text-xl lg:text-2xl"
              onClick={pauseTime}
            >
              Pause
            </button>
          </div>
          {!pause && (
            <div className="bg-[#f0f0f0] h-screen w-full min-w-fit z-10 grid place-items-start justify-center pt-56 xsm:pt-0 xsm:place-items-center absolute top-0 left-0 min-h-[1000px] xsm:min-h-0">
              <button
                className="bg-[#b1b1b1] px-8 py-2 shadow-black shadow-sm hover:bg-[#707070] rounded-lg transition-colors text-white font-lato font-extrabold xsm:text-lg sm:text-xl lg:text-2xl"
                onClick={pauseTime}
              >
                Continue
              </button>
            </div>
          )}
          <h3
            className={`${
              textRandomColor?.length > 0 && textRandomColor[0].text
            } text-3xl xsm:text-4xl sm:text-5xl lg:text-6xl xsm:mx-8 cursor-pointer drop-shadow-[1px_1px_2px_#000] text-center my-8 xsm:my-10 sm:my-12 lg:my-14 font-serif font-medium`}
          >
            {chosenColor?.length > 0 && chosenColor[0].name}
          </h3>
          {randomColor?.length > 0 && (
            <div className="grid place-items-center">
              <div
                className={`grid grid-cols-1  xsm:w-fit gap-4 ${
                  level === "Easy" && "xsm:grid-cols-2"
                } ${
                  level === "Medium" || level === "Hard"
                    ? "xsm:grid-cols-3"
                    : ""
                }`}
              >
                {randomColor?.length > 0 &&
                  randomColor.map((clr) => (
                    <button
                      key={clr.name}
                      onClick={() =>
                        chosenColor[0].name === clr.name
                          ? scoreCalculator(true, 100)
                          : level === "Medium"
                          ? scoreCalculator(false, 250)
                          : level === "Hard"
                          ? scoreCalculator(false, 400)
                          : scoreCalculator(false, 150)
                      }
                      className={`${clr.color} cursor-pointer 
                      ${level === "Easy" && "size-20"} 
                        ${
                          level === "Medium" || level === "Hard"
                            ? "size-16"
                            : ""
                        } xsm:size-20 sm:size-24 lg:size-28 shadow-[inset_0_0_1px_black] rounded-lg drop-shadow-[0_0_5px_#a6a6a6] hover:shadow-[inset_0_0_10px_white] hover:drop-shadow-none`}
                    ></button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
      {end && (
        <div>
          <div className="absolute top-0 left-0 h-dvh flex flex-col gap-2 xsm:gap-4 justify-start items-center z-40 bg-[#f0f0f0] min-w-full min-h-dvh">
            <div className="bg-[#d5d5d5] p-4 xsm:px-8 xsm:py-4 shadow-black shadow-sm rounded-lg text-slate-800 font-extrabold font-lato text-xs xsm:text-sm sm:text-lg lg:text-xl mt-8">
              Score : {score}
            </div>

            <h2 className="text-xl xsm:text-2xl sm:text-4xl lg:text-6xl p-8 font-start2P uppercase bg-[linear-gradient(to_top,_#505285_0%,_#585e92_12%,_#65689f_25%,_#7474b0_37%,_#7e7ebb_50%,_#8389c7_62%,_#9795d4_75%,_#a2a1dc_87%,_#b5aee4_100%)] drop-shadow-[0_0_4px_white] bg-clip-text text-transparent">
              Game Over
            </h2>

            <div className="w-[70%] xsm:w-[50%] sm:w-[40%] lg:w-[30%] grid gap-4 font-lato font-extrabold mb-4">
              <div>
                <div className="flex justify-between gap-2 w-[95%] mr-auto mb-1 text-xs xsm:text-sm sm:text-lg lg:text-xl">
                  <h6>Correct</h6>
                  <h6>{correctClk}</h6>
                </div>
                <ProgressBar
                  bgColor="#6f5cdc"
                  baseBgColor="#000"
                  completed={correctClk * 100}
                  isLabelVisible={false}
                  maxCompleted={(correctClk + incorrectClk) * 100}
                />
              </div>
              <div>
                <div className="flex justify-between gap-2 w-[95%] mr-auto mb-1 text-xs xsm:text-sm sm:text-lg lg:text-xl">
                  <h6>Incorrect</h6>
                  <h6>{incorrectClk}</h6>
                </div>
                <ProgressBar
                  bgColor="#6f5cdc"
                  baseBgColor="#000"
                  completed={incorrectClk * 100}
                  isLabelVisible={false}
                  maxCompleted={(correctClk + incorrectClk) * 100}
                />
              </div>
            </div>
            <div className="text-center text-slate-800 font-extrabold font-lato text-xs xsm:text-sm sm:text-lg lg:text-xl mt-2">
              {level === "Easy"
                ? score === easyHighScore
                  ? `❗️❗️ New Record ❗️❗️ `
                  : `High Score : `
                : ""}
              {level === "Medium"
                ? score === midHighScore
                  ? `❗️❗️ New Record ❗️❗️ `
                  : `High Score : `
                : ""}
              {level === "Hard"
                ? score === hardHighScore
                  ? `❗️❗️ New Record ❗️❗️ `
                  : `High Score : `
                : ""}
              <br />
              {level === "Easy"
                ? score === easyHighScore
                  ? score
                  : easyHighScore
                : ""}
              {level === "Medium"
                ? score === midHighScore
                  ? score
                  : midHighScore
                : ""}
              {level === "Hard"
                ? score === hardHighScore
                  ? score
                  : hardHighScore
                : ""}
            </div>
            <div className="flex flex-wrap justify-center">
              <Radio
                onChange={(e) => handleChangeRadio(e)}
                labelInfo={"Easy"}
                defaultChecked
              />
              <Radio
                onChange={(e) => handleChangeRadio(e)}
                labelInfo={"Medium"}
              />
              <Radio
                onChange={(e) => handleChangeRadio(e)}
                labelInfo={"Hard"}
              />
            </div>
            <button
              className="bg-[#d5d5d5] p-4 xsm:px-8 xsm:py-4 sm:px-10 shadow-black shadow-sm hover:bg-[#919191] hover:text-white transition-colors rounded-lg text-slate-500 font-extrabold font-lato text-xs xsm:text-sm sm:text-lg lg:text-xl uppercase mt-2"
              onClick={reset}
            >
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
