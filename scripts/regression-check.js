const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(app, context);

const builder = context.window.KekePacketBuilder;
if (!builder) throw new Error("KekePacketBuilder was not exposed");
if (!builder.TEACHER_MODES || Object.keys(builder.TEACHER_MODES).length !== 7) {
  throw new Error("Teacher modes regression: expected 7 teacher modes");
}

const requiredIds = [
  "modeGrid",
  "topicGrid",
  "teacherContainer",
  "question",
  "outputType",
  "buildBtn",
  "copyBtn",
  "downloadBtn",
  "output"
];

for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    throw new Error(`Missing UI id: ${id}`);
  }
}

const ziweiData = {
  modeId: "ziwei",
  topics: ["今日總覽", "此時此刻流時"],
  topicLabels: ["今日", "流時"],
  teacherId: "daily",
  question: "紫微回歸測試。",
  outputType: "md",
  analysisDate: "",
  ziweiText: [
    "App版本 : 0.0.0",
    "安星碼 : TEST",
    "基本信息",
    "命宮 兄弟宮 夫妻宮 子女宮 財帛宮 疾厄宮 遷移宮 交友宮 官祿宮 田宅宮 福德宮 父母宮",
    "流年",
    "流月",
    "流日",
    "流時",
    "時曜"
  ].join("\n"),
  focusPalaces: "官祿宮、命宮"
};

const ziweiResults = builder.analyzeMode("ziwei", ziweiData);
if (!ziweiResults.every(item => item.stateText === "已偵測")) {
  throw new Error("Ziwei regression: expected all fake fields detected");
}

const packet = builder.createPacket("ziwei", ziweiData);
const requiredSections = [
  "# 科科紫微解盤任務包",
  "## 1. 任務類型",
  "## 2. 小科解盤規則",
  "## 小科老師模式",
  "## 3. 科科本次問題",
  "## 4. 資料檢查",
  "## 5. 需補齊或確認",
  "## 6. 建議附上的截圖",
  "## 7. 本次重點宮位",
  "## 8. 原始文墨天機文字包"
];

for (const section of requiredSections) {
  if (!packet.includes(section)) {
    throw new Error(`Ziwei regression: missing ${section}`);
  }
}

if (!packet.includes("日常貼心小科")) {
  throw new Error("Ziwei regression: missing default teacher mode");
}

console.log("regression-check OK");
