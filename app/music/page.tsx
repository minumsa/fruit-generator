"use client";

import { usePathname } from "next/navigation";
import styles from "./music.module.css";
import Content from "./components/Content";
import { MobileTitle } from "./components/MobileTitle";
import { Hamburger } from "./components/Hamburger";
import { Category } from "./components/Category";
import { Grid } from "./components/Grid";
import Snowfall from "react-snowfall";
import { isMobile } from "react-device-detect";

export default function Page() {
  const pathName = "";
  const fullPathName = usePathname();

  return (
    <div className={styles["container"]}>
      <div style={{ position: "fixed", height: "100%", width: "100%" }}>
        <Snowfall snowflakeCount={100} speed={[0, 2.5]} />
      </div>
      <div className={styles["category-container"]}>
        <MobileTitle />
        <Hamburger pathName={pathName} />
        <Category pathName={pathName} fullPathName={fullPathName} />
      </div>
      <div className={styles["content-container"]}>
        <Grid />
        {/* <Content pathName={pathName} fullPathName={fullPathName} currentPage={1} /> */}
      </div>
    </div>
  );
}
