// src/App.tsx

import { useState } from "react";
import { getWeatherData, classifyWeather, classifyTemp } from "./weatherUtils";
import { PREFS } from "./prefs";

function App() {
  //const [city] = useState("Tokyo");
  const [pref, setPref] = useState("Tokyo"); 
  const [weather, setWeather] = useState("");
  const [temp, setTemp] = useState<number | null>(null);
  const [playingCities, setPlayingCities] = useState<{ city: string, sound: string, 
  
  audio: HTMLAudioElement }[]>([]); // 音源ごとのオーディオと都市情報を保持
  
  // ✅ デバッグ用 state
  const [debugCity, setDebugCity] = useState("Tokyo");
  const [dbgWeather, setDbgWeather] = useState<"Clear"|"Rain"|"Clouds">("Clear");
  const [dbgTemp, setDbgTemp] = useState<"hot"|"moderate"|"cold">("moderate");

  const handleCheckWeather = async () => {
    const { weather, temp } = await getWeatherData(pref);
    setWeather(weather);
    setTemp(temp);
  };

  const handlePlay = () => {
    if (!weather || temp === null) return;
  
    const weatherClass = classifyWeather(weather);
    const tempClass = classifyTemp(temp);
    const key = `${pref}_${weatherClass}_${tempClass}`;
    
    // BASE_URLの確認
    console.log("BASE_URL:", import.meta.env.BASE_URL);
  
    // 音源がすでに再生中か確認し、再生する都市が重複しないようにする
    if (!playingCities.some(item => item.city === pref && item.sound === key)) {
      // base URL を考慮してパスを設定
      const audioUrl = `${import.meta.env.BASE_URL}sounds/${key}.wav`;
      console.log("Audio URL:", audioUrl);  // ここで生成されるURLも確認

      const newAudio = new Audio(audioUrl);
      newAudio.play();
      newAudio.onended = () => {
        setPlayingCities((prevCities) => prevCities.filter(item => item.city !== pref)); // 音が終わったらリストから削除
      };
  
      // 再生中の都市と音源名をリストに追加
      setPlayingCities((prevCities) => [
        ...prevCities, 
        { city: pref, sound: key, audio: newAudio }
      ]);
    }
  };

  const handleDebugPlay = () => {
    const key = `${debugCity}_${dbgWeather}_${dbgTemp}`;
    const url = `${import.meta.env.BASE_URL}sounds/${key}.wav`;
  
    // すでに再生中なら何もしない
    if (playingCities.some(item => item.city === key)) return;
  
    const audio = new Audio(url);
  
    // 再生開始
    audio.play()
      .then(() => {
        // 再生中リストに追加
        setPlayingCities(prev => [
          ...prev,
          { city: key, sound: key, audio }
        ]);
      })
      .catch(err => console.error("Audio playback failed", err));
  
    // 再生終了時にリストから削除
    audio.onended = () => {
      setPlayingCities(prev => prev.filter(item => item.city !== key));
    };
  };
  
  const stopAudio = (cityToStop: string, soundToStop: string) => {
    const target = playingCities.find(
      (item) => item.city === cityToStop && item.sound === soundToStop
    );
    if (target) {
      target.audio.pause();
      target.audio.currentTime = 0;
      setPlayingCities((prevCities) =>
        prevCities.filter(
          (item) => !(item.city === cityToStop && item.sound === soundToStop)
        )
      );
    }
  };

  const tempClass = temp !== null ? classifyTemp(temp) : ""; // 温度クラスを取得

  return (
    <div style={{ padding: "2rem" }}>
      <h1>天気で音を鳴らす</h1>

      <select value={pref} onChange={(e) => {
        setPref(e.target.value);
        console.log("pref selected:", e.target.value);
      }}
    >
      {PREFS.map((p) => (
        <option key={p} value={p}>{p}</option>
      ))}
      </select>

      <p>例: Tokyo, New York, Cairo, Sydney, Rio de Janeiro</p>

      <div>{/* <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="都市名を入力"
      />
      */}
      <button onClick={handleCheckWeather}>天気を確認</button>
      </div>
  
      {weather && temp !== null && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            天気: <strong>{weather}</strong>
          </p>
          <p>
            気温: <strong>{temp} ℃ ({tempClass})</strong>
          </p>

          <button onClick={handlePlay}>音を鳴らす</button>
        </div>
      )}

      {/* 再生中の音源リスト */}
      <div style={{ marginTop: "2rem" }}>
        <h3>🔊 再生中の音源</h3>
        {playingCities.length > 0 ? (
          <ul>
            {playingCities.map((item, index) => (
              <li key={index}>
                {item.sound}
                <button
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => stopAudio(item.city, item.sound)}
                >
                  停止
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>再生中の音源はありません。</p>
        )}
      </div>
      
      <hr style={{margin:"2rem 0"}} />

    <h2>デバッグ用</h2>

    {/* 都道府県は既存 select を再利用してOK */}
    <div style={{ marginBottom: "1rem" }}>
      <label>
        都市:
        <select
          value={debugCity}
          onChange={(e) => setDebugCity(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        >
          <option value="Tokyo">Tokyo</option>
          <option value="Osaka">Osaka</option>
          <option value="Kyoto">Kyoto</option>
          <option value="Hokkaido">Hokkaido</option>
          <option value="Yamanashi">Yamanashi</option>
        </select>
      </label>
    </div>

    {/* 天気ボタン */}
    <div>
      {["Clear", "Rain", "Clouds"].map(w => (
        <button
          key={w}
          onClick={() => setDbgWeather(w as any)}
          style={{ fontWeight: dbgWeather === w ? "bold" : "normal", marginRight: "0.5rem" }}
        >
          {w}
        </button>
      ))}
    </div>

    {/* 気温ボタン */}
    <div style={{ marginTop: "0.5rem" }}>
      {["hot", "moderate", "cold"].map(t => (
        <button
          key={t}
          onClick={() => setDbgTemp(t as any)}
          style={{ fontWeight: dbgTemp === t ? "bold" : "normal", marginRight: "0.5rem" }}
        >
          {t}
        </button>
      ))}
    </div>

    <div style={{ marginTop: "1rem" }}>
      <button onClick={handleDebugPlay}>デバッグ再生</button>
    </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>🗾 日本の都市の例（20件）</h3>
        <ul>
        <li>Tokyo（東京都）</li>
        <li>Sapporo（北海道）</li>
        <li>Okinawa（沖縄県）</li>
        <li>Sendai（宮城県）</li>
        <li>Aomori（青森県）</li>
        <li>Akita（秋田県）</li>
        <li>Fukushima（福島県）</li>
        <li>Niigata（新潟県）</li>
        <li>Nagano（長野県）</li>
        <li>Kanazawa（石川県）</li>
        <li>Fukui（福井県）</li>
        <li>Utsunomiya（栃木県）</li>
        <li>Mito（茨城県）</li>
        <li>Yokohama（神奈川県）</li>
        <li>Chiba（千葉県）</li>
        <li>Saitama（埼玉県）</li>
        <li>Shizuoka（静岡県）</li>
        <li>Hamamatsu（静岡県）</li>
        <li>Gifu（岐阜県）</li>
        </ul>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <h3>🌍 海外の都市の例（20件）</h3>
        <ul>
        <li>New York（アメリカ）</li>
        <li>Los Angeles（アメリカ）</li>
        <li>Miami（アメリカ）</li>
        <li>Chicago（アメリカ）</li>
        <li>San Francisco（アメリカ）</li>
        <li>London（イギリス）</li>
        <li>Paris（フランス）</li>
        <li>Rome（イタリア）</li>
        <li>Berlin（ドイツ）</li>
        <li>Madrid（スペイン）</li>
        <li>Lisbon（ポルトガル）</li>
        <li>Amsterdam（オランダ）</li>
        <li>Brussels（ベルギー）</li>
        <li>Stockholm（スウェーデン）</li>
        <li>Oslo（ノルウェー）</li>
        <li>Vienna（オーストリア）</li>
        <li>Geneva（スイス）</li>
        <li>Zurich（スイス）</li>
        <li>Cape Town（南アフリカ）</li>
        <li>Johannesburg（南アフリカ）</li>
        </ul>
      </div>
    </div>
  );
}

export default App;