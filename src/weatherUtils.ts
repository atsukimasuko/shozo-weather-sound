// src/weatherUtils.ts

export async function getWeatherData(city: string): Promise<{ weather: string; temp: number }> {
    const apiKey = "75339d4673de8475d6b5a67c4589f26a"; // ← あとで.envで管理してもOK
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();
  
    const weather = data.weather[0].main;
    const temp = data.main.temp;
  
    return { weather, temp };
  }
  
  export function classifyWeather(weather: string): "Clear" | "Rain" | "Clouds" | "Other" {
    if (["Clear", "Rain", "Clouds"].includes(weather)) {
      return weather as "Clear" | "Rain" | "Clouds";
    }
    return "Other";
  }
  
  export function classifyTemp(temp: number): "cold" | "moderate" | "hot" {
    if (temp <= 10) return "cold";
    if (temp <= 20) return "moderate";
    return "hot";
  }


  