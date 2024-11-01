import { useState, useRef } from "react";
import "./App.css";
import Avatar from "boring-avatars";
import { Progress, Form, InputNumber, Button, Input, Select } from "antd";
import { useTranslation } from "react-i18next";
import "../i18n"; // 引入 i18n 配置文件

const { Option } = Select;

function App() {
  const { t, i18n } = useTranslation();
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

  function makingMoney(props: MakingMoneyProps) {
    const { base, day, hour, alreadyBurnedHour } = props;
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
      setMoneyAlreadyEarnedState(moneyAlreadyEarned.toFixed(2));
      setProgressState(progress.toFixed(2));
      if (startSecond >= seconds) {
        clearInterval(timer);
      }
    }, TIMER_SECOND);
    timerRef.current = timer;
    setMoneyDailyState(moneyDaily.toFixed(2));
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
  };

  return (
    <div className="container">
      <header>
        <Avatar size={100} name="钱" variant="marble" />
        <div className="app-name">{t("appName")}</div>
        <div>{t("tip")}</div>
        <div className="progress-container">
          <Progress
            key={progressState}
            percent={Number(progressState)}
            strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
            strokeWidth={30}
            status={"active"}
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
      <section>
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
