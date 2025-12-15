import { useEffect, useState, useRef } from "react";
import "./App.css";
import navbarIcon from "./img/iconoir_book.png";
import pause from "./img/pause.png";
import playing from "./img/play.png";
import lupa from "./img/iconoir_search.png";
import sad from "./img/sad.png";

const fonts = ["Sans Serif", "Serif", "Mono"];

const fontMap = {
  "Sans Serif": "sans-serif",
  Serif: "serif",
  Mono: "monospace",
};

export default function APP() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("keyboard");
  const [dark, setDark] = useState(false);

  const [styles, setStyles] = useState({ defaultFont: "Sans Serif" });

  const ovoz = data?.[0]?.phonetics.find((p) => p.audio)?.audio;

  const song = useRef(null);
  const [play, setPlay] = useState(false);

  const playaudio = () => {
    if (!song.current) return;
    if (play) song.current.pause();
    else song.current.play();
    setPlay(!play);
  };

  useEffect(() => {
    if (dark) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.title === "No Definitions Found") {
          setData([]);
          setError("No Definitions Found");
        } else {
          setData(result);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [search]);

  const handleSearch = (evt) => {
    if (evt.key === "Enter") setSearch(evt.target.value);
  };

  const handleFont = (value) => {
    setStyles((prev) => ({ ...prev, defaultFont: value }));
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div>
      <nav>
        <img src={navbarIcon} alt="logo" />
        <ul className="nav-ul">
          <select
            className="select"
            value={styles.defaultFont}
            onChange={(evt) => handleFont(evt.target.value)}
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
          <button onClick={() => setDark(!dark)}>
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </ul>
      </nav>

      <div className="center">
        <input
          className="search"
          type="text"
          placeholder="Soz yozing"
          onKeyDown={handleSearch}
        />
        <img className="lupa" src={lupa} alt="logo" />
      </div>

      {data?.map((item, index) => (
        <div key={index}>
          <div className="container">
            <div className="text">
              <h2
                className="keybord"
                style={{ fontFamily: fontMap[styles.defaultFont] }}
              >
                {item?.word}
              </h2>
              <h3
                className="sinonim"
                style={{ fontFamily: fontMap[styles.defaultFont] }}
              >
                {item?.phonetic}
              </h3>
            </div>
            {ovoz && (
              <div className="song-button">
                <audio ref={song} src={ovoz} onEnded={() => setPlay(false)} />
                <button onClick={playaudio} className="audio-button">
                  <img src={play ? pause : playing} alt="audio" width={75} />
                </button>
              </div>
            )}
          </div>

          {item.meanings.map((meaning, i) => (
            <div key={i}>
              <div className="flex">
                <p
                  className="noun"
                  style={{ fontFamily: fontMap[styles.defaultFont] }}
                >
                  {meaning?.partOfSpeech}{" "}
                </p>
                <div className="chiziq"></div>
              </div>

              <ul className="center-2">
                {meaning?.definitions.map((def, i) => (
                  <li
                    className="etc"
                    key={i}
                    style={{ fontFamily: fontMap[styles.defaultFont] }}
                  >
                    {def.definition}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}

      {!loading && error === "No Definitions Found" && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <img src={sad} alt="png" />
          <h2>No Definitions Found</h2>
          <p className="pal">
            Sorry pal, we couldn't find definitions for the word you were
            looking for. You can try the search again at later time or head to
            the web instead.
          </p>
        </div>
      )}
    </div>
  );
}
