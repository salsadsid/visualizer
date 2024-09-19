import React from "react";

const Arrow = ({ width = 20, height = 20, color = "#9c36b5", className }) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 53.38541274269414 22.883076023129888"
      width={width}
      height={height}
      className={className}
    >
      <defs>
        <style className="style-fonts"></style>
      </defs>
      <rect
        x="0"
        y="0"
        width="53.38541274269414"
        height="22.883076023129888"
        fill="#ffffff"
      ></rect>
      <g strokeLinecap="round">
        <g transform="translate(9.90338407177478 11.408433699980378) rotate(0 16.66666666666663 0.8333333333332575)">
          <path
            d="M0.74 -1.41 C11.42 -0.39, 21.14 1.72, 31.51 1.45 M0.1 -0.25 C11.26 -0.39, 21.48 0.57, 33.48 1.34"
            stroke={color}
            strokeWidth="4"
            fill="none"
          ></path>
        </g>
        <g transform="translate(9.90338407177478 11.408433699980378) rotate(0 16.66666666666663 0.8333333333332575)">
          <path
            d="M33.51 0.21 L21.31 7.01 L21.18 -5.22 L34.9 1.39"
            stroke="none"
            strokeWidth="0"
            fill={color}
            fillRule="evenodd"
          ></path>
          <path
            d="M34.04 0.28 C30.42 2.53, 26.09 5.34, 18.12 6.58 M33.55 1.15 C29.04 2.77, 23.77 4.86, 19.6 6.49 M19.43 7.77 C18.45 3.84, 20.28 -1.38, 19.36 -5.18 M19.19 6.17 C19.55 3.86, 20.3 0.33, 20.81 -5.41 M20.02 -7.28 C24.03 -2.98, 28.55 -0.98, 32.48 0.93 M19.66 -6.4 C24.04 -3.93, 28.79 -1.48, 33.24 0.69 M33.48 1.34 C33.48 1.34, 33.48 1.34, 33.48 1.34 M33.48 1.34 C33.48 1.34, 33.48 1.34, 33.48 1.34"
            stroke={color}
            strokeWidth="4"
            fill="none"
          ></path>
        </g>
      </g>
      <mask></mask>
    </svg>
  );
};

export default Arrow;
