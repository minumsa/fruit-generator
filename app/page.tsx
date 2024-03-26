"use client";

import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { fruitEmojiMap } from "./modules/fruitData";
import NoSSR from "./modules/NoSSR";
import styles from "./fruits.module.css";

function getRandomItem(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function Fruits() {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [checkerWidth, setCheckerWidth] = useState<number>(0);

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // FIXME: 리액트 코드로 최대한 바꿔보기
  useEffect(() => {
    const container = document.getElementById("container");

    const interval = setInterval(() => {
      const fruit = document.createElement("div");
      const fruitsArr: string[] = Object.keys(fruitEmojiMap);
      const randomFruit = getRandomItem(fruitsArr);
      fruit.innerHTML = randomFruit;
      fruit.style.left = `${Math.random() * 100}%`;
      container?.appendChild(fruit);

      // TODO: pointerEvents 검색해보기
      fruit.style.pointerEvents = "auto";
      fruit.style.cursor = "pointer";

      const eventName = isMobile ? "touchstart" : "click";
      const clickHandler = () => {
        const fruitArray = fruitEmojiMap[randomFruit];
        if (fruitArray) {
          fruit.removeEventListener(eventName, clickHandler);
          alert(getRandomItem(fruitArray));
        }
      };

      fruit.addEventListener(eventName, clickHandler);

      setTimeout(() => {
        fruit.remove();
      }, 5000);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (isMobile) {
      setCheckerWidth(windowWidth / 6);
    } else {
      setCheckerWidth(windowWidth / 12);
    }
  }, [windowWidth]);

  return (
    <div
      className={styles["container"]}
      style={{
        backgroundSize: `${checkerWidth * 2}px ${checkerWidth * 2}px`,
        backgroundPosition: `0 0, 0 ${checkerWidth}px, ${checkerWidth}px -${checkerWidth}px, -${checkerWidth}px 0px`,
      }}
    >
      <div
        id="container"
        style={{ fontSize: `${checkerWidth}px` }}
        className={styles["falling-fruits"]}
      ></div>
    </div>
  );
}

export default function Page() {
  return (
    <NoSSR>
      <Fruits />
    </NoSSR>
  );
}
