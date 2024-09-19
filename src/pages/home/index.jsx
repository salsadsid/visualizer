/**
 * Functional component representing the Home page.
 * Handles input of a 2D array, visualization, and color selection.
 * Utilizes state hooks for array, error, unique values, and colors.
 * Renders a dynamic grid based on the input array with customizable cell colors.
 * Supports error handling for invalid input and array modification.
 * Displays a header, input textarea, color selection options, and a footer with GitHub links.
 */

import React, { useState } from "react";
import { cn } from "../../cn";
import Arrow from "../../components/Arrow";

const TwoDArrayVisualizer = () => {
  const [ar, setAr] = useState([]);
  const [err, setErr] = useState(false);
  const [colors, setColors] = useState({});
  let len = ar?.length;
  let maxLen = Math.max(...ar.map((row) => row.length, len));

  //
  const isAtleastOneElement =
    ar?.length > 0 && ar.some((row) => row.length > 0);

  const handle2DArray = (e) => {
    const value = e.target.value;

    try {
      setErr(false);

      // Basic validation
      if (value === "") {
        setAr([]);
        setErr(false);
        return;
      } else if (value === "[" || value === "]") {
        setAr([]);
        setErr(false);
        return;
      } else if (value === "[]" || value === "[[" || value === "]]") {
        setAr([]);
        setErr(false);
        return;
      } else if (value === "[[]" || value === "[]]") {
        setAr([]);
        setErr(false);
        return;
      } else if (value === "[[]]") {
        setAr([]);
        setErr(false);
        return;
      } else if (value === "[[],[]]") {
        setAr([]);
        setErr(false);
        return;
      } else if (value === "[[],[],[]]") {
        setAr([]);
        setErr(false);
        return;
      }
      const arr = JSON.parse(value) || [];

      // Check if input is a 2D array
      const is2DArray =
        Array.isArray(arr) && arr.every((row) => Array.isArray(row));

      const len = arr.length;

      // Check if input is a square array
      const isSquareArray = arr.every(
        (row) =>
          row.length === len &&
          row.every((col) => typeof col === "number" || typeof col === "string")
      );

      if (isSquareArray) {
        setAr(arr);
      } else if (is2DArray) {
        try {
          // 2D array modification
          const maxLen = Math.max(...arr.map((row) => row.length, len));
          const modArr = arr?.map((row) => {
            const holesCount = maxLen - row.length;
            for (let i = 0; i < holesCount; i++) {
              row.push("X");
            }
            return row;
          });
          setAr(modArr);
        } catch (error) {
          console.log(error);
          setErr(true);
        }
      }
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };

  // Handle color selection
  const handleSetColor = (e, cellValue) => {
    const value = e.target.value;
    setColors((colors) => ({ ...colors, [cellValue]: value }));
  };

  return (
    <main className="font-rubik min-h-screen flex flex-col justify-between">
      <div>
        <header>
          <h1 className="flex justify-center text-4xl items-center pt-20 bg-soft-primary-outline">
            <span className="bg-slate-900 text-white p-1 rounded">[[2D]]</span>
            &nbsp;Array Visualizer
          </h1>
        </header>
        <div className="flex md:flex-row flex-col md:gap-6 pt-20 gap-5 justify-center items-center">
          <div>
            <h3 className=" text-center mb-3">Input 2D Array</h3>
            <textarea
              rows="7"
              placeholder={`[
      [0, 1, 0],
      [1, 1, 0],
      [1, 1, 1]
]`}
              className="w-full shadow md:min-w-[400px] md:max-w-2xl resize-none text-slate-600 bg-white border border-slate-300 appearance-none rounded px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              onChange={handle2DArray}
            ></textarea>
            {err && <div className="text-red-500">Invalid input</div>}

            {isAtleastOneElement && (
              <h3 className="mt-5 text-center">Choose colors</h3>
            )}

            {isAtleastOneElement && (
              <div className="grid grid-cols-2 gap-3 mt-3 ">
                <div className="text-gray-500  shadow p-1 rounded flex justify-center items-center gap-1">
                  <span className="text-indigo-700 text-base  p-1 rounded">
                    Border color
                  </span>
                  <Arrow />
                  <input
                    type="color"
                    className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                    title="Choose your color"
                    defaultValue="#ffeb3b"
                    onChange={(e) => handleSetColor(e, "border")}
                  />
                </div>
                <div className="text-gray-500  shadow p-1 rounded flex justify-center items-center gap-1">
                  <span className="text-indigo-700  p-1 rounded text-base">
                    Text color
                  </span>
                  <Arrow />
                  <input
                    type="color"
                    className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                    title="Choose your color"
                    onChange={(e) => handleSetColor(e, "textColor")}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mt-3 ">
              {/* 2D Array visualization color selection */}
              {isAtleastOneElement &&
                ar
                  .flat(Infinity)
                  .filter(
                    (value, index, array) => array.indexOf(value) === index
                  )
                  ?.map((value, index) => {
                    return (
                      <div
                        key={index}
                        className="text-gray-500 shadow p-1 rounded flex justify-center items-center gap-1"
                      >
                        <span className="text-indigo-700  p-1 rounded text-xl">
                          {value}
                        </span>
                        <Arrow />
                        <input
                          type="color"
                          className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                          title="Choose your color"
                          onChange={(e) => handleSetColor(e, value)}
                        />
                      </div>
                    );
                  })}
            </div>
          </div>
          {isAtleastOneElement && (
            <Arrow width={44} height={32} className={"md:rotate-0 rotate-90"} />
          )}
          <div
            className={cn(
              maxLen
                ? `grid grid-cols-${maxLen} md:mt-0 mt-5 opacity-100 `
                : "opacity-0 hidden transition-opacity ease-in-out delay-150 duration-300"
            )}
          >
            {/* 2D Array visualization */}
            {isAtleastOneElement &&
              ar.map((row, i) =>
                row.map((col, j) => (
                  <div
                    key={i * len + j}
                    style={{
                      backgroundColor: colors[col],
                      borderColor: colors["border"],
                      color: colors["textColor"],
                    }}
                    className={cn(
                      " h-16 w-16 flex justify-center text-xl [text-shadow:_1px_1px_1px_rgb(256_256_256_/_40%)] items-center border border-yellow-500",

                      !colors[col] && "bg-gray-100",
                      col === "X" && "bg-gray-600 text-gray-50"
                    )}
                  >
                    {col}
                  </div>
                ))
              )}
          </div>
        </div>
      </div>

      <div className="flex justify-center"></div>
      <footer className="flex flex-col items-center gap-5 mt-8">
        <a href="https://github.com/salsadsid/array-visualizer" target="_blank">
          <button className="group  relative inline-flex h-12 w-44 items-center justify-center overflow-hidden rounded-md bg-neutral-950 font-medium text-neutral-200">
            <img src="github-mark-white.png" alt="" className="w-6 mr-2" />
            <span>Give it a star</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-8 bg-white/20"></div>
            </div>
          </button>
        </a>
        <span className="bg-indigo-50 flex justify-center w-full">
          <a href="https://github.com/salsadsid" target="_blank">
            {" "}
            &copy; Salman Sadik Siddiquee
          </a>
        </span>
      </footer>
    </main>
  );
};

export default TwoDArrayVisualizer;
