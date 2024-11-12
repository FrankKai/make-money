import { useState, useEffect, useMemo } from "react";
import { DatePicker, Progress, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import "./rank.css";
import RankLogo from "../images/rank.png";
import "react-step-progress-bar/styles.css";
// @ts-ignore
import { ProgressBar, Step } from "react-step-progress-bar";

function Timer() {
  const { t, i18n } = useTranslation();
  const { Option } = Select;

  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(t("rank.notReached"));
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [timeToNextLevel, setTimeToNextLevel] = useState("");
  const [nextLevelTitle, setNextLevelTitle] = useState("");

  const levels = [9.5, 10, 10.5, 11, 11.5, 12];
  const colors = [
    "#4D4D4D",
    "#CD7F32",
    "#C0C0C0",
    "#FFD700",
    "#1E90FF",
    "#FFA500",
  ];
  const titles = t("rank.titles", { returnObjects: true }) as string[];

  useEffect(() => {
    if (!startTime) return;

    const calculateProgress = () => {
      const now = dayjs(); // Current time
      const diffInSeconds = now.diff(startTime, "second");

      // Calculate elapsed time and format it
      const totalSeconds = diffInSeconds;
      const seconds = totalSeconds % 60;
      const minutes = Math.floor((totalSeconds / 60) % 60);
      const hours = Math.floor(totalSeconds / 3600);

      setElapsedTime(
        `${hours.toString().padStart(2, "0")}${t("rank.hours")}${minutes
          .toString()
          .padStart(2, "0")}${t("rank.minutes")}${seconds
          .toString()
          .padStart(2, "0")}${t("rank.seconds")}`
      );

      // Calculate overall progress
      const maxHours = levels[levels.length - 1];
      const totalTargetSeconds = maxHours * 3600;
      const percent = Math.min((diffInSeconds / totalTargetSeconds) * 100, 100);
      setOverallProgress(percent);

      // Determine current level and time to next level
      let reachedLevel = t("rank.notReached");
      let reachedLevelIndex = 0;
      let nextLevelTime = null;
      let nextLevelIndex = -1;

      for (let i = 0; i < levels.length; i++) {
        const targetTime = startTime.add(levels[i], "hour");
        if (now.isAfter(targetTime) || now.isSame(targetTime)) {
          reachedLevel = titles[i];
          reachedLevelIndex = i;
        } else if (!nextLevelTime) {
          nextLevelTime = targetTime;
          nextLevelIndex = i;
        }
      }
      setCurrentLevel(reachedLevel);
      setCurrentLevelIndex(reachedLevelIndex);

      if (nextLevelTime) {
        const remainingSeconds = nextLevelTime.diff(now, "second");
        const remainingHours = Math.floor(remainingSeconds / 3600);
        const remainingMinutes = Math.floor((remainingSeconds % 3600) / 60);
        const remainingSecondsLeft = remainingSeconds % 60;
        setTimeToNextLevel(
          `${remainingHours}${t("rank.hours")}${remainingMinutes}${t(
            "rank.minutes"
          )}${remainingSecondsLeft}${t("rank.seconds")}`
        );
        setNextLevelTitle(titles[nextLevelIndex]);
      } else {
        setTimeToNextLevel(t("rank.reachedMaxRank"));
        setNextLevelTitle("");
      }
    };

    const interval = setInterval(calculateProgress, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleTimeChange = (value: Dayjs | null) => {
    setStartTime(value);
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  // calculate dynamic fill background
  const dynamicFillBackground = useMemo(() => {
    if (currentLevelIndex === 5) {
      return colors[5];
    }
    return `linear-gradient(to right, ${colors[currentLevelIndex]},  ${
      colors[currentLevelIndex + 1]
    })`;
  }, [currentLevelIndex]);
  return (
    <div className="rank-container">
      <div className="timer-container">
        <div className="money-bag-container">
          <img src={RankLogo} alt="Rank" className="rank-logo" />
        </div>
        <h1>{t("rank.title")}</h1>
        <DatePicker
          showTime
          onChange={handleTimeChange}
          placeholder={t("rank.selectTime")}
          className="date-picker"
        />
        {startTime && (
          <div className="elapsed-time">
            {t("rank.workedToday", { elapsedTime })}
          </div>
        )}
        {startTime && (
          <div className="progress-list">
            <h3>{t("rank.rankProgress")}</h3>
            <div className="progress-item">
              <div
                className="progress-title"
                style={{ color: colors[currentLevelIndex] }}
              >
                {t("rank.currentRank", { currentLevel })}
              </div>
              <ProgressBar
                filledBackground={dynamicFillBackground}
                height="20px"
                percent={overallProgress}
                stepPositions={levels?.map((level) => (level / 12) * 100)}
              >
                {titles?.map((title, index) => (
                  <Step transition="scale">
                    {/* @ts-ignore */}
                    {({ accomplished }) => (
                      <div
                        className={`transitionStep ${
                          accomplished ? "accomplished" : null
                        }`}
                        style={{ color: colors[index] }}
                      >
                        <div>{title}</div>
                        <div>|</div>
                      </div>
                    )}
                  </Step>
                ))}
              </ProgressBar>
            </div>
            <div
              className="time-to-next-level"
              style={{ color: colors[currentLevelIndex + 1] }}
            >
              {t("rank.timeToNextRank", { nextLevelTitle, timeToNextLevel })}
            </div>
            <div className="level-legend">
              <h4>{t("rank.rankTable")}</h4>
              <div>
                {levels.map((level, index) => {
                  const targetTime = startTime.add(level, "hour");
                  const isReached =
                    dayjs().isAfter(targetTime) || dayjs().isSame(targetTime);
                  return (
                    <div
                      key={index}
                      style={{
                        color: isReached ? "green" : "red",
                      }}
                    >
                      {titles[index]} -{" "}
                      {t("rank.estimatedOffTime", {
                        estimatedTime: targetTime.format("HH:mm:ss"),
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="language-switcher">
        <Select
          defaultValue={i18n.language}
          style={{ width: 120 }}
          onChange={handleLanguageChange}
        >
          <Option value="en">English</Option>
          <Option value="zh">中文</Option>
        </Select>
      </div>
    </div>
  );
}

export default Timer;
