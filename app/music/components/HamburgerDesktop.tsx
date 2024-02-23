import { useRouter } from "next/navigation";
import styles from "../music.module.css";
import { activeStyle, contents } from "../modules/data";
import { useState } from "react";

interface HamburgerProps {
  pathName: string;
}

// FIXME: 컴포넌트화 시킬 수 있는 부분 전부 작업
// FIXME: 컴포넌트화 시키면서 안 쓰게 된 코드들 모두 삭제
export const HamburgerDesktop = ({ pathName }: HamburgerProps) => {
  const router = useRouter();
  const isMainPage = Number(pathName) > 0;
  const [showCategory, setShowCategory] = useState<boolean>(false);

  return (
    <div
      className={styles["desktop-hamburger-container"]}
      onClick={() => {
        setShowCategory(!showCategory);
      }}
    >
      <div
        className={styles["hamburger-icon"]}
        style={{ display: showCategory ? "none" : "flex" }}
      ></div>
      <div className={styles["close-icon"]} style={{ display: showCategory ? "flex" : "none" }}>
        <div>×</div>
      </div>
      {showCategory ? (
        <div className={styles["desktop-genre-category"]}>
          <div
            className={styles["hamburger-item-title"]}
            onClick={() => {
              // router.push(`/music/${category}/1`);
            }}
          >
            장르
          </div>
          {Object.keys(contents).map(category => {
            const isActiveCategory = pathName === category || (isMainPage && category === "");
            return (
              <div
                key={category}
                className={styles["hamburger-item"]}
                onClick={() => {
                  router.push(`/music/${category}/1`);
                }}
                style={isActiveCategory ? activeStyle : {}}
              >
                {contents[category]}
              </div>
            );
          })}
        </div>
      ) : null}
      {showCategory && (
        <div className={styles["desktop-introduction-category"]}>
          <div className={styles["hamburger-item-title"]}>소개</div>
          <div className={styles["hamburger-item"]}>카버</div>
          <div className={styles["hamburger-item"]}>카버차트</div>
          <div className={styles["hamburger-item"]}>연락처</div>
        </div>
      )}
    </div>
  );
};
