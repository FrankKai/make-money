import { useState, useRef } from "react";
import "./App.css";
import Avatar from "boring-avatars";
import { Progress, Form, InputNumber, Button } from "antd";

function App() {
  const [moneyDailyState, setMoneyDailyState] = useState<string>();
  const [moneyAlreadyEarnedState, setMoneyAlreadyEarnedState] =
    useState<string>();
  const [progressState, setProgressState] = useState<string>();
  const timerRef = useRef<any>();

  const APP_NAME = "打工人挣钱进度条";
  const TIP = "激活打工人赚钱欲！！！";
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
    const timer = setInterval(() => {
      startSecond += 5;
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

  return (
    <div className="container">
      <header>
        <Avatar size={100} name="钱" variant="marble" />
        <div className="app-name">{APP_NAME}</div>
        <div>{TIP}</div>
        <div className="progress-container">
          <Progress
            percent={Number(progressState)}
            strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
            strokeWidth={30}
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
          <Form.Item label="月薪" name={"base"}>
            <InputNumber min={0} addonAfter="元" />
          </Form.Item>
          <Form.Item label="每月工作天数" name={"day"}>
            <InputNumber min={1} max={31} addonAfter="天" />
          </Form.Item>
          <Form.Item label="今日预计工时" name={"hour"}>
            <InputNumber min={1} max={24} addonAfter="小时" />
          </Form.Item>
          <Form.Item label="今日已工作工时" name={"alreadyBurnedHour"}>
            <InputNumber min={0} max={24} addonAfter="小时" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
            <Button type="primary" htmlType="submit">
              开始打工
            </Button>
          </Form.Item>
        </Form>
      </section>
      <section>
        <div>{moneyDailyState && `今日预计赚${moneyDailyState}元`}</div>
        <div>
          {moneyAlreadyEarnedState &&
            `已经赚了${
              Number(moneyAlreadyEarnedState) > Number(moneyDailyState)
                ? moneyDailyState
                : moneyAlreadyEarnedState
            }元`}
        </div>
      </section>
    </div>
  );
}

export default App;
