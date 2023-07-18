"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FetchItem {
  [x: string]: any;
  fetchMusicData: any;
  text: string;
  genre: string;
  link: string;
}

interface UploadItem {
  albumId: string;
  genre: string;
  link: string;
  text: string;
}

export default function Page() {
  const router = useRouter();
  const pathName = usePathname();
  const genreByPath =
    pathName.split("/").length > 2 ? pathName.split("/")[2].toUpperCase() : "";

  const contents = [
    "POP",
    "K-POP",
    "ROCK",
    "DISCO",
    "FOLK",
    "JAZZ",
    "CLASSICAL",
    "SOUNDTRACK",
    "ALL",
  ];

  const initialUploadItem: any[] = JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("uploadItems") || "[]"
      : "[]"
  );

  const [uploadItems, setUploadItems] = useState<any[]>(initialUploadItem);
  const [uploadItem, setUploadItem] = useState<UploadItem>({
    albumId: "",
    text: "",
    genre: "",
    link: "",
  });

  useEffect(() => {
    localStorage.setItem("uploadItems", JSON.stringify(uploadItems));
  }, [uploadItems]);

  const [activeGenre, setActiveGenre] = useState("ALL");
  const [loginPage, setLoginPage] = useState(false);

  const handleGenreClick = (genre: any) => {
    setLoginPage(false);
    const genrePath = genre.toLowerCase();
    genrePath === "all"
      ? router.push(`/music`)
      : router.push(`/music/${genrePath}`);
  };

  const [musicDatas, setMusicDatas] = useState<any[]>([]);

  const fetchAccessToken = async () => {
    try {
      const url = "https://accounts.spotify.com/api/token";
      const clientId = "9ba8de463724427689b855dfcabca1b1";
      const clientSecret = "7cfb4b90f97a4b1a8f02f2fe6d2d42bc";
      const basicToken = btoa(`${clientId}:${clientSecret}`);
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicToken}`,
      };
      const data = "grant_type=client_credentials";

      const accessTokenResponse = await fetch(url, {
        method: "POST",
        headers,
        body: data,
      });

      if (!accessTokenResponse.ok) {
        console.error("Error: Access token fetch failed");
      }

      const accessTokenData = await accessTokenResponse.json();
      return accessTokenData.access_token;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const [dataTest, setDataTest] = useState<any>();
  const fetchData = async () => {
    try {
      const accessToken = await fetchAccessToken();
      if (!accessToken) {
        // throw new Error("Access token is not available");
        console.error("Error: Access token is not available");
      }

      const musicDataArray: FetchItem[] = await Promise.all(
        uploadItems.map(async uploadItem => {
          const url = `https://api.spotify.com/v1/albums/${uploadItem.albumId}`;
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };
          const musicDataResponse = await fetch(url, { headers });

          if (!musicDataResponse.ok) {
            // throw new Error("music fetch failed");
            console.error("Error: music fetch failed");
          }

          const fetchedMusicData = await musicDataResponse.json();
          return {
            fetchMusicData: fetchedMusicData,
            text: uploadItem.text,
            genre: uploadItem.genre,
            link: uploadItem.link,
          };
        })
      );

      setMusicDatas(prevMusicDatas => [...musicDataArray, ...prevMusicDatas]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [uploadItems]);

  async function fetchMusic() {
    try {
      const response = await fetch("/api/music", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload music data");
      }

      const data = await response.json();
      setDataTest(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchMusic();
  }, []);

  console.log("dataTest", dataTest);

  return (
    <>
      <div
        className="music-left-container"
        style={{ width: "250px", height: "100%" }}
      >
        <div className="music-genre-container" style={{ paddingTop: "10px" }}>
          {contents.map((genre, index) => (
            <div
              key={genre}
              className={`music-genre ${activeGenre === genre ? "active" : ""}`}
              onClick={() => {
                setActiveGenre(genre);
                handleGenreClick(genre);
              }}
              style={
                (genreByPath === genre && !loginPage) ||
                (genreByPath.length < 1 && activeGenre === genre)
                  ? {
                      backgroundColor: "#ffccff",
                      borderRadius: 0,
                      color: "#000000",
                      fontWeight: "bold",
                    }
                  : {}
              }
            >
              {genre}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          height: "100%",
        }}
      >
        <div
          className="music-right-container"
          style={{ overflow: "scroll", width: "90%" }}
        >
          <div
            className="music-top-menu"
            onClick={() => {
              router.push("/music/upload");
              setActiveGenre("");
            }}
          >
            업로드
          </div>
          <div className="music-bottom-title">카버 차트 v1.1.1</div>

          {musicDatas
            ? musicDatas.map((data, index) => {
                return (
                  <div className="music-post-container" key={index}>
                    <div className="album-container">
                      <div style={{ marginRight: "20px" }}>
                        <Image
                          src={data.fetchMusicData.images[0].url}
                          alt="album art"
                          width={250}
                          height={250}
                        />
                      </div>
                      <div className="music-post-container-block">
                        <div>
                          <span>{data.fetchMusicData.artists[0].name},</span>{" "}
                          <span>{`｟${data.fetchMusicData.name}｠`}</span>
                        </div>
                        <div>
                          <span>{data.fetchMusicData.label},</span>{" "}
                          <span>{data.fetchMusicData.release_date}</span>
                        </div>
                        <div>
                          <a
                            href={data.link}
                            target="_blank"
                            style={{
                              textDecoration: "none",
                              color: "#ffccff",
                            }}
                          >
                            <div className="play-applemusic">
                              Play on Apple Music ↵
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="music-post-container-block">
                      {data.text}
                    </div>
                    <div
                      style={{
                        borderBottom: "1px solid #ffccff",
                        padding: "20px",
                      }}
                    ></div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </>
  );
}
