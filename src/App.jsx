import { useState } from "react";
import "./App.css";
import { cn } from "./cn";

function App() {
  const [ar, setAr] = useState([]);
  const [err, setErr] = useState(false);
  const [uniqueValues, setUniqueValues] = useState([]);
  const [colors, setColors] = useState({});
  let len = ar?.length;
  let maxLen = Math.max(...ar.map((row) => row.length, len));
  console.log(ar);
  ar?.forEach((row) => {
    row?.forEach((col) => {
      if (uniqueValues.indexOf(col) === -1) {
        setUniqueValues((uniqueValues) => [...uniqueValues, col]);
      }
    });
  });

  console.log(uniqueValues);
  const handle2DArray = (e) => {
    const value = e.target.value;

    try {
      setErr(false);
      const arr = JSON.parse(value) || [];
      const is2DArray =
        Array.isArray(arr) && arr.every((row) => Array.isArray(row));

      const len = arr.length;
      const flag = arr.every(
        (row) =>
          row.length === len &&
          row.every((col) => typeof col === "number" || typeof col === "string")
      );

      if (flag) {
        setAr(arr);
      } else if (is2DArray) {
        try {
          const maxLen = Math.max(...arr.map((row) => row.length, len));
          console.log(maxLen);
          const modArr = arr?.map((row) => {
            const holesCount = maxLen - row.length;
            for (let i = 0; i < holesCount; i++) {
              row.push("X");
            }
            return row;
          });
          setAr(modArr);
        } catch (error) {
          setErr(true);
        }
      }
    } catch (err) {
      setErr(true);
    }
  };
  const handleSetColor = (e, cellValue) => {
    const value = e.target.value;
    setColors((colors) => ({ ...colors, [cellValue]: value }));
  };
  console.log(colors);

  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-screen">
      <div>
        <textarea
          rows="5"
          placeholder={`[
    [0, 1, 5],
    [1, 1, 4],
    [1, 1, 4],
]`}
          className="focus:shadow-soft-primary-outline min-w-[500px] resize-none min-h-unset text-sm leading-5.6 ease-soft-primary-outline focus:ring-0 focus:ring-soft-primary-outline focus block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
          onChange={handle2DArray}
        ></textarea>
        {uniqueValues?.map((value, index) => {
          return (
            <div key={index} className="text-gray-500">
              {value}
              <input type="color" onChange={(e) => handleSetColor(e, value)} />
            </div>
          );
        })}
      </div>
      {err && <div className="text-red-500">Invalid input</div>}
      <div className={cn(maxLen ? `grid grid-cols-${maxLen}` : "hidden")}>
        {ar.map((row, i) =>
          row.map((col, j) => (
            <div
              key={i * len + j}
              style={{ backgroundColor: colors[col] }}
              className={cn(
                " h-12 w-12 flex justify-center items-center border border-gray-600",
                !colors[col] && "bg-gray-100",
                i === 0 && "rounded-t-lg",
                i === maxLen - 1 && "rounded-b-lg",
                j === 0 && "rounded-l-lg",
                j === maxLen - 1 && "rounded-r-lg"
                // len === 1 && "rounded-lg"
              )}
            >
              {col}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
