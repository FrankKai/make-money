import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import { Progress, Form, Button, Input, Select } from "antd";
import { useTranslation } from "react-i18next";
import "../i18n"; // 引入 i18n 配置文件
import GoldPicture from "./images/money.png";
import RMBPicture from "./images/yuan.jpeg";
import DollarPicture from "./images/dollar.jpg";

const { Option } = Select;

function App() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [moneyDailyState, setMoneyDailyState] = useState<string>();
  const [moneyAlreadyEarnedState, setMoneyAlreadyEarnedState] =
    useState<string>();
  const [progressState, setProgressState] = useState<string>();
  const timerRef = useRef<any>();

  const TIMER_SECOND = 1000;

  interface MakingMoneyProps {
    base: number;
    day: number;
    hour: number;
    alreadyBurnedHour?: number;
  }
  const toNumber = (value: any) => {
    const number = parseFloat(value);
    return isNaN(number) ? 0 : number;
  };

  function makingMoney(props: MakingMoneyProps) {
    const { base, day, hour, alreadyBurnedHour } = {
      base: toNumber(props.base),
      day: toNumber(props.day),
      hour: toNumber(props.hour),
      alreadyBurnedHour: toNumber(props.alreadyBurnedHour),
    };
    if (alreadyBurnedHour && alreadyBurnedHour > hour) return;
    const moneyDaily = base / day;
    const seconds = hour * 60 * 60;
    let progress = 0;
    let startSecond = alreadyBurnedHour ? alreadyBurnedHour * 60 * 60 : 0;
    let moneyAlreadyEarned = 0;

    let startTime = Date.now();

    const timer = setInterval(() => {
      const latestTime = Date.now();

      const deltaSecond = (latestTime - startTime) / 1000;
      startSecond += deltaSecond;

      startTime = latestTime;

      progress = startSecond / seconds;
      moneyAlreadyEarned = moneyDaily * progress;
      progress = progress * 100;
      setMoneyAlreadyEarnedState(moneyAlreadyEarned.toFixed(1));
      setProgressState(progress.toFixed(2));
      if (startSecond >= seconds) {
        clearInterval(timer);
      }
    }, TIMER_SECOND);
    timerRef.current = timer;
    setMoneyDailyState(moneyDaily.toFixed(1));
  }

  const onFinish = (values: any) => {
    reset();
    makingMoney(values);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setMoneyDailyState("");
    setMoneyAlreadyEarnedState("");
    setProgressState("");
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    const coins = coinsRef.current;
    coins.forEach((coin) => coin.remove()); // 移除所有 coin 元素
    coinsRef.current = []; // 清空 coins 数组
    clearInterval(intervalRef.current);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const coinsRef = useRef<HTMLImageElement[]>([]);
  const intervalRef = useRef<any>();

  const createCoins = useCallback(() => {
    const container = containerRef.current;
    const coins = coinsRef.current;

    if (container) {
      const createCoin = () => {
        const coin = document.createElement("img");
        coin.src = currentLanguage === "zh" ? RMBPicture : DollarPicture;
        coin.className = "coin";
        coin.style.left = `${Math.random() * 100}vw`;
        coin.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(coin);
        coins.push(coin);

        coin.addEventListener("animationend", () => {
          coin.remove();
        });

        if (coins.length > 100) {
          const oldCoin = coins.shift();
          if (oldCoin) {
            oldCoin.remove();
          }
        }
      };

      for (let i = 0; i < 20; i++) {
        createCoin();
      }

      intervalRef.current = setInterval(createCoin, 1000);
    }
  }, [currentLanguage]);

  useEffect(() => {
    createCoins();
    return () => clearInterval(intervalRef.current);
  }, [currentLanguage]);
  return (
    <div className="container" ref={containerRef}>
      <header>
        <div className="money-bag-container">
          <img src={GoldPicture} alt="Money Bag" className="money-bag" />
        </div>
        <div className="app-name">{t("appName")}</div>
        <div>{t("tip")}</div>
        <div className="progress-container">
          <Progress
            key={progressState}
            percent={Number(progressState)}
            strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
            strokeWidth={30}
            status={"active"}
            // format={(percent) =>
            //   moneyAlreadyEarnedState
            //     ? `${moneyAlreadyEarnedState} (${percent}%)`
            //     : ""
            // }
            percentPosition={{ align: "center", type: "inner" }}
          />
        </div>
      </header>

      <section>
        <Form
          labelCol={{ span: 8 }}
          labelAlign={"right"}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={onFinish}
        >
          <Form.Item label={t("monthlySalary")} name={"base"}>
            <Input type="number" addonAfter={t("yuan")} />
          </Form.Item>
          <Form.Item label={t("workingDays")} name={"day"}>
            <Input type="number" addonAfter={t("days")} />
          </Form.Item>
          <Form.Item label={t("expectedHours")} name={"hour"}>
            <Input type="number" addonAfter={t("hours")} />
          </Form.Item>
          <Form.Item label={t("alreadyWorkedHours")} name={"alreadyBurnedHour"}>
            <Input type="number" addonAfter={t("hours")} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
            <Button type="primary" htmlType="submit">
              {t("startWorking")}
            </Button>
          </Form.Item>
        </Form>
      </section>

      <section className="statistic">
        <div>
          {moneyDailyState &&
            t("expectedEarnings", { amount: moneyDailyState })}
        </div>
        <div>
          {moneyAlreadyEarnedState &&
            t("alreadyEarned", {
              amount:
                Number(moneyAlreadyEarnedState) > Number(moneyDailyState)
                  ? moneyDailyState
                  : moneyAlreadyEarnedState,
            })}
        </div>
      </section>

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

export default App;
