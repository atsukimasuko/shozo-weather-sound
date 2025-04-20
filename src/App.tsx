// src/App.tsx

import { useState } from "react";
import { getWeatherData, classifyWeather, classifyTemp } from "./weatherUtils";

function App() {
  const [city, setCity] = useState("Tokyo");
  const [weather, setWeather] = useState("");
  const [temp, setTemp] = useState<number | null>(null);
  const [playingCities, setPlayingCities] = useState<{ city: string, sound: string, audio: HTMLAudioElement }[]>([]); // 音源ごとのオーディオと都市情報を保持

  const handleCheckWeather = async () => {
    const { weather, temp } = await getWeatherData(city);
    setWeather(weather);
    setTemp(temp);
  };

  const handlePlay = () => {
    if (!weather || temp === null) return;
  
    const weatherClass = classifyWeather(weather);
    const tempClass = classifyTemp(temp);
    const key = `${weatherClass}_${tempClass}`;
  
    // 音源がすでに再生中か確認し、再生する都市が重複しないようにする
    if (!playingCities.some(item => item.city === city && item.sound === key)) {
      const newAudio = new Audio(`/sounds/${key}.wav`);
      newAudio.play();
      newAudio.onended = () => {
        setPlayingCities((prevCities) => prevCities.filter(item => item.city !== city)); // 音が終わったらリストから削除
      };
  
      setPlayingCities((prevCities) => [...prevCities, { city, sound: key, audio: newAudio }]); // 再生中の都市と音源名をリストに追加
    }
  };
  
  const stopAudio = (cityToStop: string) => {
    const targetCity = playingCities.find(item => item.city === cityToStop);
    if (targetCity) {
      targetCity.audio.pause();
      targetCity.audio.currentTime = 0;
      setPlayingCities((prevCities) => prevCities.filter(item => item.city !== cityToStop)); // 停止した都市をリストから削除
    }
  };

  const tempClass = temp !== null ? classifyTemp(temp) : ""; // 温度クラスを取得

  return (
    <div style={{ padding: "2rem" }}>
      <h1>天気で音を鳴らす</h1>

      <p>例: Tokyo, New York, Cairo, Sydney, Rio de Janeiro</p>

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="都市名を入力"
      />
      <button onClick={handleCheckWeather}>天気を確認</button>

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
                {item.city} - {item.sound}
                <button onClick={() => stopAudio(item.city)}>停止</button> {/* 特定の音源を停止 */}
              </li>
            ))}
          </ul>
        ) : (
          <p>再生中の音源はありません。</p>
        )}
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