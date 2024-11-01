import { useEffect, useState } from "react";

const ReadyButton = ({
  isReady,
  onClick,
}: {
  isReady: boolean;
  onClick: () => void;
}) => {
  if (isReady) {
    return;
  }

  return (
    <button
      className="border-4 border-black rounded-2xl py-4 px-12 bg-white"
      onClick={onClick}
    >
      Ready?
    </button>
  );
};

type State = "notReady" | "countDown" | "waitForShoot" | "shoot!" | "over";

interface PlayerWindowContentProps {
  state: State;
  ready: boolean;
  setReady: (val: boolean) => void;
  countDownValue: number;
  dead: boolean;
}

const PlayerWindowContent = ({
  state,
  ready,
  setReady,
  countDownValue,
  alreadyBoom,
  dead,
}: PlayerWindowContentProps & { alreadyBoom: boolean }) => {
  if (dead) {
    return <p className="text-[25vw]">😵</p>;
  }
  if (alreadyBoom) {
    return <p className="text-[25vw]">💥</p>;
  }

  switch (state) {
    case "notReady":
      return <ReadyButton isReady={ready} onClick={() => setReady(true)} />;
    case "countDown":
      return <p>{countDownValue}</p>;
    case "waitForShoot":
      return <p>...</p>;
    case "shoot!":
      return <p className="font-bold text-[15vw]">BANG!</p>;
    default:
      return <p>todo</p>;
  }
};

interface PlayerWindowProps extends PlayerWindowContentProps {
  boom: number;
  setBoom: (val: number) => void;
}

const PlayerWindow = ({ boom, setBoom, ...props }: PlayerWindowProps) => (
  <div
    className="w-full h-full place-content-center p-auto text-center text-[10vw]"
    onMouseDown={() => {
      if (props.state == "notReady" || props.state == "over" || boom > 0) {
        return;
      }

      setBoom(Date.now());
    }}
  >
    <PlayerWindowContent alreadyBoom={boom > 0} {...props} />
  </div>
);

const App = () => {
  const [redReady, setRedReady] = useState(false);
  const [blueReady, setBlueReady] = useState(false);

  const [redBoom, setRedBoom] = useState(0);
  const [blueBoom, setBlueBoom] = useState(0);

  const [countDownValue, setCountDownValue] = useState(3);

  const [shoot, setShoot] = useState(0);

  const state = !(redReady && blueReady)
    ? "notReady"
    : countDownValue > 0
    ? "countDown"
    : shoot == 0
    ? "waitForShoot"
    : !(
        (shoot > 0 && (redBoom > 0 || blueBoom > 0)) ||
        (redBoom > 0 && blueBoom > 0)
      )
    ? "shoot!"
    : "over";

  if (state == "over") {
    const redTime = redBoom - shoot;
    const blueTime = blueBoom - shoot;

    if (redTime < 0 && blueTime < 0 && shoot == 0) {
      console.log("two cowards");
    } else if (redTime == blueTime) {
      console.log("DOUBLE DIE!");
    } else if (
      redTime < 0 ||
      redTime > blueTime ||
      (redTime == 0 && blueTime > 0 && blueTime > shoot)
    ) {
      console.log("blue won with", blueTime, "ms");
    } else if (
      blueTime < 0 ||
      blueTime < redTime ||
      (blueTime == 0 && redTime > 0 && redTime > shoot)
    ) {
      console.log("red won with", redTime, "ms");
    } else {
      console.log("...wat?");
    }
  }

  useEffect(() => {
    if (state == "countDown") {
      setTimeout(() => {
        setCountDownValue(countDownValue - 1);
      }, 1000);
    } else if (state == "waitForShoot") {
      setTimeout(() => {
        setShoot(Date.now());
      }, Math.floor(Math.random() * 3000) + 100);
    }
  }, [state, countDownValue]);

  return (
    <div className="flex flex-col h-screen w-screen select-none">
      <div className="h-[50%] bg-red-300 rotate-180">
        <PlayerWindow
          state={state}
          ready={redReady}
          setReady={setRedReady}
          countDownValue={countDownValue}
          boom={redBoom}
          setBoom={setRedBoom}
          dead={shoot > 0 && blueBoom > 0 && blueBoom >= shoot}
        />
      </div>
      <div className="h-[50%] bg-blue-300">
        <PlayerWindow
          state={state}
          ready={blueReady}
          setReady={setBlueReady}
          countDownValue={countDownValue}
          boom={blueBoom}
          setBoom={setBlueBoom}
          dead={shoot > 0 && redBoom > 0 && redBoom >= shoot}
        />
      </div>
    </div>
  );
};

export default App;
