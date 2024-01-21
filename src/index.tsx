import { program } from "commander";
import { render, Text } from "ink";
import { useEffect, useState } from "react";

function Row({ cells, char }: { cells: number[]; char: string; }) {
  return (
    <>
      <Text>{cells.map(cell => (cell ? char : " ")).join("")}</Text>
    </>
  );
}

function randomRange(l: number, r: number) {
  const len = r - l + 1;
  return Math.floor(Math.random() * len + l);
}

function App({
  width,
  height,
  initialCells,
  interval,
  char,
}: {
  width: number;
  height: number;
  initialCells: number;
  interval: number;
  char: string;
}) {
  const [mp, setMp] = useState<number[][]>(() => {
    const res = Array.from(
      { length: height },
      _ => Array.from({ length: width }, _ => 0),
    );

    for (let i = 1; i <= initialCells; ++i) {
      while (true) {
        let x = randomRange(0, height - 1);
        let y = randomRange(0, width - 1);
        if (!res[x][y]) {
          res[x][y] = 1;
          break;
        }
      }
    }

    return res;
  });

  function update() {
    setMp(mp => {
      const newMp: number[][] = JSON.parse(JSON.stringify(mp));
      for (let i = 0; i < height; ++i) {
        for (let j = 0; j < width; ++j) {
          let dx = [0, 1, 0, -1, 1, 1, -1, -1];
          let dy = [1, 0, -1, 0, 1, -1, 1, -1];
          let cnt = 0;
          for (let k = 0; k < 8; ++k) {
            let nx = i + dx[k];
            let ny = j + dy[k];
            if (nx < 0 || nx >= height || ny < 0 || ny >= width) {
              continue;
            }
            if (mp[nx][ny]) {
              ++cnt;
            }
          }
          if (mp[i][j]) {
            if (cnt >= 5) {
              newMp[i][j] = 0;
            } else if (cnt >= 2) {
              newMp[i][j] = 1;
            } else {
              newMp[i][j] = 0;
            }
          } else {
            if (cnt >= 3) {
              newMp[i][j] = 1;
            } else {
              newMp[i][j] = 0;
            }
          }
        }
      }
      return newMp;
    });
  }

  useEffect(() => {
    const timer = setInterval(() => update(), interval);
    return () => clearInterval(timer);
  });

  return (
    <>
      {mp.map((row, index) => <Row cells={row} key={index} char={char}></Row>)}
    </>
  );
}

program
  .option("-w, --width <number>", "width", "20")
  .option("-h, --height <number>", "height", "20")
  .option("-t, --interval <number>", "interval", "500")
  .option("-i, --init <number>", "initial cells", "50")
  .option("-c, --char <char>", "chatacter", "X");

program.parse();

const opts = program.opts();
const width = Number.parseInt(opts.width) || 20;
const height = Number.parseInt(opts.height) || 20;
const interval = Number.parseInt(opts.interval) || 500;
const init = Number.parseInt(opts.init) || 50;
const char = opts.char?.[0] || "X";

render(
  <App
    width={width}
    height={height}
    initialCells={init}
    interval={interval}
    char={char}
  />,
);
