"use client";

import { usePathname } from "next/navigation";
import { Category } from "./Category";
import { MobileHamburgerMenu } from "./MobileHamburgerMenu";
import { MobileTitle } from "./MobileTitle";
import styles from "../music.module.css";
import { isUploadPage } from "../modules/data";

export const MusicLayout = ({ children }: { children: React.ReactNode }) => {
  const fullPathName = usePathname();

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center" }}>
      <div className={styles["container"]}>
        {/* FIXME: 나중에 TopNav 살리기 */}
        {/* <TopNav isVisible={isUploadPage(pathName) || isPostPage(pathName) ? false : true} /> */}
        <div className={styles["category-container"]}>
          <MobileTitle />
          <MobileHamburgerMenu />
          <Category pathName={pathName} fullPathName={fullPathName} />
        </div>
        <div
          className={styles["content-container"]}
          style={{ alignItems: isUploadPage(pathName) ? "center" : undefined }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
