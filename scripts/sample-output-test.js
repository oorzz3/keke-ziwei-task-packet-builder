const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const code = fs.readFileSync(path.join(root, "app.js"), "utf8");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(code, context);

const builder = context.window.KekePacketBuilder;
if (!builder) throw new Error("KekePacketBuilder was not exposed");

const allowedStates = new Set(["已偵測", "未偵測", "建議補齊"]);
const fakeZiwei = [
  "App版本 : 0.0.0",
  "安星碼 : TEST",
  "基本信息",
  "命宮 兄弟宮 夫妻宮 子女宮 財帛宮 疾厄宮 遷移宮 交友宮 官祿宮 田宅宮 福德宮 父母宮",
  "流年",
  "流月",
  "流日",
  "流時",
  "時曜"
].join("\n");
const fakeBazi = [
  "基本資料",
  "四柱",
  "日主",
  "喜用",
  "忌神",
  "十神對照",
  "財星定義"
].join("\n");

const cases = [
  {
    mode: "ziwei",
    data: {
      modeId: "ziwei",
      topics: ["今日總覽", "此時此刻流時"],
      topicLabels: ["今日", "流時"],
      question: "請用假資料測試紫微任務包。",
      outputType: "md",
      analysisDate: "",
      ziweiText: fakeZiwei,
      focusPalaces: "官祿宮、命宮"
    },
    expected: "# 科科紫微解盤任務包"
  },
  {
    mode: "bazi",
    data: {
      modeId: "bazi",
      topics: ["今日能量配比", "財務 / 資源"],
      topicLabels: ["今日能量", "財務"],
      question: "請用假資料測試八字任務包。",
      outputType: "md",
      analysisDate: "2026-07-03",
      baziText: fakeBazi
    },
    expected: "# 科科八字任務包"
  },
  {
    mode: "compare",
    data: {
      modeId: "compare",
      topics: ["財務 / 資源", "工作 / 任務"],
      topicLabels: ["財務", "工作"],
      question: "請用假資料測試合併對照包。",
      outputType: "md",
      analysisDate: "2026-07-03",
      baziCompareText: fakeBazi,
      ziweiCompareText: fakeZiwei
    },
    expected: "# 科科命理任務包｜合併對照包"
  }
];

for (const item of cases) {
  const results = builder.analyzeMode(item.mode, item.data);
  if (!results.every(result => allowedStates.has(result.stateText))) {
    throw new Error(`${item.mode}: unexpected state text`);
  }
  const packet = builder.createPacket(item.mode, item.data);
  if (!packet.includes(item.expected)) {
    throw new Error(`${item.mode}: missing expected heading`);
  }
  if (!packet.includes("v0.2-alpha")) {
    throw new Error(`${item.mode}: missing version`);
  }
}

console.log("sample-output-test OK");
