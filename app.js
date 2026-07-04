(function () {
  const VERSION = "科科命理任務包產生器 v0.3-alpha";
  const ALLOWED_STATES = {
    ok: "已偵測",
    miss: "未偵測",
    warn: "建議補齊"
  };

  const TEACHER_COMMON_BOUNDARIES = [
    "命理只作為生活觀察與決策輔助，不作絕對預言。",
    "不得輸出保證吉凶。",
    "不得提供醫療診斷。",
    "不得提供投資買賣指令。",
    "不得恐嚇使用者。",
    "若資料不足，必須標示資料不足。",
    "若八字、紫微、黃曆互相衝突，必須標示衝突，不得硬凹。",
    "百分比只代表注意力 / 作息配置比重，不代表事件發生機率。",
    "若涉及健康、疾病、疼痛、用藥、復健，現實醫師評估優先於命理。",
    "若涉及金錢、投資、消費，現實風險與資金狀況優先於命理。"
  ];

  const TEACHER_MODES = {
    daily: {
      id: "daily",
      title: "日常貼心小科",
      shortLabel: "日常",
      tagline: "陪科科過一天",
      description: "溫柔白話、今日提醒",
      bestFor: ["今日運勢", "今日摘要", "今天適合做什麼", "今天要注意什麼", "日常行程安排", "心情整理"],
      style: ["溫柔", "白話", "不恐嚇", "不玄學堆砌", "把命理翻成科科能實際使用的生活提醒"],
      focus: ["今日主氣", "今日副氣", "精神狀態", "身體修復", "財務注意", "人際互動", "今日適合安排", "今日不適合安排"],
      outputFormat: ["今日一句話", "今日能量配比", "主偏向", "副偏向", "適合做", "不適合做", "小提醒", "浪漫提醒"],
      boundaries: ["不可誇大吉凶，不可把提醒講成必然事件。"],
      promptBlock: "請用日常貼心小科的語氣，把資料整理成科科今天能用的提醒。"
    },
    risk: {
      id: "risk",
      title: "嚴格風控小科",
      shortLabel: "風控",
      tagline: "幫科科踩煞車",
      description: "先看風險，再看可行",
      bestFor: ["身體不穩或外出", "出行安排", "花費決策", "工作衝突", "高消耗行程", "想做但怕硬撐"],
      style: ["直接", "不安慰優先", "先扣分再看條件", "必要時建議取消或延後"],
      focus: ["最大風險", "可承受條件", "停損線", "現實條件優先於命理", "八字 / 紫微警訊", "資料不足處"],
      outputFormat: ["先講結論", "最大風險", "命理加分", "命理扣分", "現實條件扣分", "可以做的條件", "必須取消 / 暫停條件", "小科裁判"],
      boundaries: ["健康狀況以醫師與身體反應優先。", "不可因命理偏吉就鼓勵過度消耗。"],
      promptBlock: "請用嚴格風控小科的角度，先找風險，再給可行條件與停損線。"
    },
    technical: {
      id: "technical",
      title: "命理技術派小科",
      shortLabel: "技術",
      tagline: "拆盤給科科看",
      description: "八字紫微逐項說明",
      bestFor: ["想知道為什麼", "交叉驗證", "流年 / 流月 / 流日", "十神與宮位", "學習命理邏輯"],
      style: ["結構化", "可使用術語", "術語必須翻成白話", "分來源說明訊號"],
      focus: ["八字：日主、流年、流月、流日、十神、五行、喜忌、合沖刑害", "紫微：流年 / 月 / 日落宮、被點亮宮位、四化、大限與流年疊象、財帛、疾厄、遷移、福德、官祿", "黃曆：流日干支、節氣、沖煞、值神、建除十二神", "一致點", "衝突點"],
      outputFormat: ["技術總結", "八字訊號", "紫微信號", "黃曆輔助", "一致點", "衝突點", "解讀信心", "白話結論"],
      boundaries: ["資料不足或流派差異時必須標示，不得假裝唯一正解。"],
      promptBlock: "請用命理技術派小科的方式，逐項拆解訊號來源，再給白話結論。"
    },
    decision: {
      id: "decision",
      title: "決策軍師小科",
      shortLabel: "軍師",
      tagline: "幫科科二選一",
      description: "結論、評分、條件、停損",
      bestFor: ["A / B 選擇", "去不去", "買不買", "今天做不做", "先休息或施工", "行程比較"],
      style: ["結論先行", "可評分", "條件明確", "文字精簡"],
      focus: ["選項 A / B 加分扣分", "命理支持", "現實支持", "最佳情境", "最壞情境", "停損線"],
      outputFormat: ["直接結論", "選項評分", "命理支持", "現實支持", "風險比較", "建議方案", "備用方案", "停損線", "小科裁判一句話"],
      boundaries: ["命理分數不可當成事件機率。", "不可鼓勵不可逆的高風險決策。"],
      promptBlock: "請用決策軍師小科的方式，幫科科把選項拆清楚並給出可執行建議。"
    },
    healing: {
      id: "healing",
      title: "療癒浪漫小科",
      shortLabel: "療癒",
      tagline: "幫科科補心",
      description: "安定、祝福、心情整理",
      bestFor: ["心情亂", "佛光山", "考試祝福", "日常祝福", "低潮", "需要被安定"],
      style: ["溫柔", "有畫面感", "浪漫但務實", "不空泛灌雞湯"],
      focus: ["心要放在哪裡", "今天可以放下什麼", "要保護哪一部分", "祝福", "詩意提醒"],
      outputFormat: ["今日心象", "今日適合", "今日不必勉強", "命理溫柔提醒", "科科可以做的小儀式", "浪漫提醒", "小科祝福"],
      boundaries: ["不可掩蓋重大風險。", "若涉及健康或安全，必須提醒停止硬撐並以現實評估優先。"],
      promptBlock: "請用療癒浪漫小科的語氣，給科科安定、具體、能落地的提醒。"
    },
    audit: {
      id: "audit",
      title: "反證審查小科",
      shortLabel: "審查",
      tagline: "防止科科硬凹",
      description: "挑矛盾、抓資料不足",
      bestFor: ["想做但怕硬湊吉象", "八字與紫微不一致", "資料不足", "需要被反駁", "想做決策審查"],
      style: ["冷靜", "批判", "不討好", "不恐嚇"],
      focus: ["資料是否足夠", "支持訊號", "反對訊號", "想像成分", "命理不能判斷的現實問題", "需補醫師或現實評估", "保守讀法"],
      outputFormat: ["審查結論", "目前可支持的判斷", "目前不能支持的判斷", "八字與紫微衝突點", "資料不足", "可能硬凹之處", "最保守建議", "需要補充的資料"],
      boundaries: ["資料不足時不可戲劇化斷語。", "不可把模糊訊號講成神秘預言。"],
      promptBlock: "請用反證審查小科的角度，優先找矛盾、資料缺口與可能硬凹處。"
    },
    verdict: {
      id: "verdict",
      title: "鐵口直斷小科",
      shortLabel: "直斷",
      tagline: "早上開盤定吉凶",
      description: "先斷吉凶，再講依據",
      bestFor: ["早上快速總判", "重大決策前總覽", "交叉驗證後需要明確結論", "想要刺激但有邊界的判斷"],
      style: ["先斷後解", "清楚明快", "可以使用吉凶傾向", "不宣稱必然", "不恐嚇"],
      focus: ["財運 / 資源", "健康 / 修復", "親人 / 家庭", "事業 / 工作", "學習 / 技能", "人際 / 合作", "感情 / 桃花", "心理 / 情緒", "出行 / 安全", "口舌 / 衝突", "隱藏提醒", "今日最該做"],
      outputFormat: ["鐵口總斷：小吉 / 中吉 / 吉中藏凶 / 凶中有救 / 小凶 / 大凶不宜", "一句斷語", "今日十二項", "八字依據", "紫微依據", "八字 × 紫微衝突驗證", "趨吉避凶", "小科鐵口一句"],
      boundaries: ["不可輸出絕對會發生的預言。", "不可提供醫療診斷或投資買賣指令。", "不可使用恐嚇式死亡、災難、分手、背叛斷語。", "若訊號衝突，必須列反證與停損線。"],
      promptBlock: "請用鐵口直斷小科的方式，先給吉凶傾向，再說依據、反證與停損。"
    }
  };

  const palaceNames = ["命宮", "兄弟宮", "夫妻宮", "子女宮", "財帛宮", "疾厄宮", "遷移宮", "交友宮", "僕役宮", "官祿宮", "事業宮", "田宅宮", "福德宮", "父母宮"];

  const MODES = {
    ziwei: {
      id: "ziwei",
      icon: "紫",
      title: "紫微任務包",
      subtitle: "文墨天機文字包整理，今日 / 流日 / 流時 / 工作 / 財務等解盤用。",
      eyebrow: "ZIWEI",
      description: "貼上文墨天機紫微文字包，整理成小科可讀的紫微任務包。",
      buildLabel: "產生紫微任務包",
      topicHelp: "短標籤只用來選任務；完整說明會放進產出的任務包。",
      fields: [
        {
          id: "ziweiText",
          label: "文墨天機文字命盤包",
          placeholder: "請把文墨天機輸出的文字命盤包貼在這裡。資料只會留在目前瀏覽器畫面，不會上傳、不會儲存。",
          large: true,
          counter: true
        }
      ],
      extraFields: [
        {
          id: "focusPalaces",
          label: "本次重點宮位",
          placeholder: "例：官祿宮、命宮、遷移宮"
        }
      ],
      topics: [
        ["☀", "今日", "今日總覽", "三合日盤截圖"],
        ["🕒", "流時", "此時此刻流時", "三合時盤截圖", "requiresHour"],
        ["💼", "工作", "工作 / 事業", "官祿宮局部圖"],
        ["💰", "財務", "財務 / 投資心態", "財帛宮局部圖"],
        ["❤", "感情", "感情 / 婚姻", "夫妻宮局部圖"],
        ["🌿", "健康", "健康 / 身體能量", "疾厄宮局部圖"],
        ["👥", "人際", "人際 / 合作", "交友宮 / 兄弟宮局部圖"],
        ["☆", "本命", "本命總覽", "三合本命盤截圖"],
        ["🔟", "大限", "大限十年", "大限盤截圖"],
        ["📅", "指定年", "指定年份", "流年截圖"],
        ["🌙", "指定月", "指定月份", "流月截圖"],
        ["📆", "指定日", "指定日期", "流日截圖"]
      ],
      defaultTopic: "今日",
      defaultShots: ["三合日盤截圖", "四化 / 飛星圖（選配）"],
      checks: [
        {
          id: "appVersion",
          label: "App版本",
          shortLabel: "App",
          help: "建議保留文墨天機版本，方便小科知道資料來源。",
          test: data => /(App\s*版本|APP\s*版本|版本)\s*[:：]?\s*[0-9][0-9A-Za-z._-]*/i.test(data.ziweiText)
        },
        {
          id: "starCode",
          label: "安星碼",
          shortLabel: "安星",
          help: "用來標記這份命盤文字包來源。",
          test: data => /安星碼\s*[:：]?\s*[A-Za-z0-9]{3,}/i.test(data.ziweiText)
        },
        {
          id: "basicInfo",
          label: "基本信息",
          shortLabel: "基本",
          help: "姓名、性別、出生時間、陰陽曆等基本資料。",
          test: data => /(基本信息|基本資料|姓名|性別|出生|陽曆|陰曆|農曆|命主|身主)/.test(data.ziweiText)
        },
        {
          id: "palaces",
          label: "命盤十二宮",
          shortLabel: "十二宮",
          help: "至少偵測到 10 個常見宮位名稱。",
          test: data => uniqueMatches(data.ziweiText, palaceNames).length >= 10,
          detail: data => `${uniqueMatches(data.ziweiText, palaceNames).length} / 12+`
        },
        { id: "year", label: "流年", shortLabel: "流年", help: "今日與指定年份任務通常需要。", test: data => /流年/.test(data.ziweiText) },
        { id: "month", label: "流月", shortLabel: "流月", help: "今日與近期狀態任務建議包含。", test: data => /流月/.test(data.ziweiText) },
        { id: "day", label: "流日", shortLabel: "流日", help: "今日任務建議包含。", test: data => /流日/.test(data.ziweiText) },
        {
          id: "hour",
          label: "流時 / 時曜",
          shortLabel: "流時",
          help: "勾選流時時建議確認。",
          test: data => /(流時|時曜)/.test(data.ziweiText),
          requiredWhen: data => data.topics.includes("此時此刻流時")
        }
      ],
      buildPacket: buildZiweiPacket
    },
    bazi: {
      id: "bazi",
      icon: "八",
      title: "八字任務包",
      subtitle: "匯入科科固定八字 TXT，產生給小科推算今日能量的任務包。",
      eyebrow: "BAZI",
      description: "貼上或匯入固定八字 TXT，網站只整理資料，不推算今日干支。",
      buildLabel: "產生八字任務包",
      topicHelp: "八字任務只整理資料與問題；日柱、流日、十神對照交給小科。",
      dateLabel: "分析日期",
      fields: [
        {
          id: "baziText",
          label: "固定八字 TXT",
          placeholder: "請貼上科科固定八字 TXT。也可匯入本機 TXT 檔案，不會上傳、不會儲存。",
          large: true,
          counter: true,
          file: true,
          fileLabel: "匯入本機 TXT / MD"
        }
      ],
      topics: [
        ["☀", "今日能量", "今日能量配比"],
        ["💰", "財務", "財務 / 資源"],
        ["🌿", "健康", "健康 / 修復"],
        ["👥", "人際", "人際 / 合作"],
        ["💼", "工作", "工作 / 任務"],
        ["🧘", "精神", "精神 / 休息"],
        ["📆", "指定日期", "指定日期"]
      ],
      defaultTopic: "今日能量",
      defaultShots: ["固定八字 TXT", "分析日期", "科科本次問題"],
      checks: [
        { id: "basic", label: "基本資料", shortLabel: "基本", help: "八字固定 TXT 內的基本資料段落。", test: data => /(基本資料|基本信息|姓名|性別|出生|生辰)/.test(data.baziText) },
        { id: "pillars", label: "四柱", shortLabel: "四柱", help: "年柱、月柱、日柱、時柱或四柱段落。", test: data => /(四柱|年柱|月柱|日柱|時柱)/.test(data.baziText) },
        { id: "dayMaster", label: "日主", shortLabel: "日主", help: "日主資訊留給小科對照十神。", test: data => /日主/.test(data.baziText) },
        { id: "useful", label: "喜用", shortLabel: "喜用", help: "喜用或用神資訊。", test: data => /(喜用|用神|喜神)/.test(data.baziText) },
        { id: "avoid", label: "忌神", shortLabel: "忌神", help: "忌神或需保守處。", test: data => /忌神/.test(data.baziText) },
        { id: "tenGods", label: "十神對照", shortLabel: "十神", help: "十神對照表或十神段落。", test: data => /(十神對照|十神|比肩|劫財|食神|傷官|正財|偏財|正官|七殺|偏印|正印)/.test(data.baziText) },
        { id: "wealth", label: "財星定義", shortLabel: "財星", help: "財星、正財或偏財定義。", test: data => /(財星|正財|偏財)/.test(data.baziText) },
        { id: "date", label: "分析日期", shortLabel: "日期", help: "要交給小科推算的日期。", test: data => Boolean(data.analysisDate) },
        { id: "question", label: "科科本次問題", shortLabel: "問題", help: "本次要問小科的內容。", test: data => Boolean(data.question.trim()) }
      ],
      buildPacket: buildBaziPacket
    },
    compare: {
      id: "compare",
      icon: "合",
      title: "合併對照包",
      subtitle: "八字候選日 × 紫微流日資料，交給小科做交叉對照與反證。",
      eyebrow: "COMPARE",
      description: "整理八字與紫微兩邊資料，請小科比對一致點、違和點與資料不足處。",
      buildLabel: "產生合併對照包",
      topicHelp: "合併對照不由網站判斷吉凶，只產出交叉對照任務包。",
      dateLabel: "分析日期",
      fields: [
        {
          id: "baziCompareText",
          label: "八字候選日 / 八字分析摘要",
          placeholder: "可貼上八字候選日、八字任務包摘要，或固定八字資料 + 問題。",
          counter: true,
          file: true,
          fileLabel: "匯入八字 TXT / MD"
        },
        {
          id: "ziweiCompareText",
          label: "紫微流日資料",
          placeholder: "請貼上該日文墨天機紫微流日資料。",
          counter: true
        }
      ],
      topics: [
        ["💰", "財務", "財務 / 資源"],
        ["🌿", "健康", "健康 / 修復"],
        ["👥", "人際", "人際 / 合作"],
        ["💼", "工作", "工作 / 任務"],
        ["🧭", "作息", "今日作息指北針"]
      ],
      defaultTopic: "財務",
      defaultShots: ["八字候選日或八字摘要", "紫微流日資料", "必要時附流日盤截圖"],
      checks: [
        { id: "bazi", label: "八字資料或候選日", shortLabel: "八字", help: "八字候選日、八字摘要或固定八字資料。", test: data => data.baziCompareText.trim().length >= 8 },
        { id: "ziwei", label: "紫微流日資料", shortLabel: "紫微", help: "該日文墨天機紫微流日資料。", test: data => /(流日|紫微|文墨|命宮|財帛|官祿|疾厄)/.test(data.ziweiCompareText) },
        { id: "date", label: "分析日期", shortLabel: "日期", help: "兩邊資料要對照的日期。", test: data => Boolean(data.analysisDate) },
        { id: "target", label: "對照目標", shortLabel: "目標", help: "至少選一個對照方向。", test: data => data.topics.length > 0 },
        { id: "question", label: "科科本次問題", shortLabel: "問題", help: "本次要問小科的內容。", test: data => Boolean(data.question.trim()) }
      ],
      buildPacket: buildComparePacket
    }
  };

  let currentModeId = "ziwei";
  let els = {};

  function uniqueMatches(text, words) {
    return words.filter(word => String(text || "").includes(word));
  }

  function escapeCodeFence(text) {
    return String(text || "").replaceAll("```", "`\u200b``");
  }

  function selectedTopicInputs(root) {
    return [...root.querySelectorAll("#topicGrid input:checked")];
  }

  function collectData(root, modeId) {
    const mode = MODES[modeId];
    const data = {
      modeId,
      topics: selectedTopicInputs(root).map(item => item.dataset.output || item.value),
      topicLabels: selectedTopicInputs(root).map(item => item.value),
      teacherId: root.querySelector("#teacherGrid input:checked") ? root.querySelector("#teacherGrid input:checked").value : "daily",
      question: root.querySelector("#question") ? root.querySelector("#question").value : "",
      outputType: root.querySelector("#outputType") ? root.querySelector("#outputType").value : "md",
      analysisDate: root.querySelector("#analysisDate") ? root.querySelector("#analysisDate").value : ""
    };

    mode.fields.forEach(field => {
      data[field.id] = root.querySelector(`#${field.id}`) ? root.querySelector(`#${field.id}`).value : "";
    });
    (mode.extraFields || []).forEach(field => {
      data[field.id] = root.querySelector(`#${field.id}`) ? root.querySelector(`#${field.id}`).value : "";
    });

    return data;
  }

  function selectedTeacher(data) {
    return TEACHER_MODES[data.teacherId] || TEACHER_MODES.daily;
  }

  function markdownList(items) {
    return items.map(item => `  - ${item}`).join("\n");
  }

  function teacherSection(data) {
    const teacher = selectedTeacher(data);
    const boundaries = [...teacher.boundaries, ...TEACHER_COMMON_BOUNDARIES];
    return `## 小科老師模式
- 本次解盤角色：${teacher.title}
- 角色定位：${teacher.tagline}；${teacher.description}
- 回覆風格：
${markdownList(teacher.style)}
- 分析重點：
${markdownList(teacher.focus)}
- 必守邊界：
${markdownList(boundaries)}
- 建議輸出格式：
${markdownList(teacher.outputFormat)}
`;
  }

  function analyzeMode(modeId, data) {
    return MODES[modeId].checks.map(check => {
      const required = check.requiredWhen ? check.requiredWhen(data) : true;
      const ok = check.test(data);
      const state = ok ? "ok" : required ? "miss" : "warn";
      return {
        id: check.id,
        label: check.label,
        shortLabel: check.shortLabel || check.label,
        help: check.help,
        ok,
        required,
        state,
        stateText: ALLOWED_STATES[state],
        detail: check.detail ? check.detail(data) : ""
      };
    });
  }

  function missingLines(results) {
    const missing = results.filter(item => item.required && !item.ok);
    if (!missing.length) return "- 必要欄位目前皆已偵測。";
    return missing.map(item => `- ${item.label}：未偵測，建議補齊資料後再交給小科。`).join("\n");
  }

  function selectedShots(modeId, data) {
    const mode = MODES[modeId];
    const shots = new Set(mode.defaultShots || []);
    mode.topics.forEach(topic => {
      const output = topic[2];
      const shot = topic[3];
      if (shot && data.topics.includes(output)) shots.add(shot);
    });
    if (modeId === "compare") {
      data.topics.forEach(topic => shots.add(`${topic}對照重點`));
    }
    return [...shots];
  }

  function createPacket(modeId, data) {
    const results = analyzeMode(modeId, data);
    return MODES[modeId].buildPacket(data, results);
  }

  function buildZiweiPacket(data, results) {
    const text = data.ziweiText.trim();
    const focus = data.focusPalaces && data.focusPalaces.trim()
      ? data.focusPalaces.trim()
      : "由小科依文字包與截圖判斷，請勿自行補盤。";
    const ask = data.question.trim() || "請依本次勾選主題進行解盤，並明確標示資料不足之處。";

    return `# 科科紫微解盤任務包

## 1. 任務類型
- 產生日期：${todayText()}
- 任務主題：${data.topics.length ? data.topics.join("、") : "未選擇"}
- 盤源：文墨天機文字包
- 工具版本：${VERSION}

## 2. 小科解盤規則
- 文墨天機負責排盤，小科只負責依已提供資料解盤。
- 文字包為主資料，截圖為佐證。
- 不得自行補盤、推算缺漏欄位或宣稱資料由本工具 calculated。
- 不得把命理當絕對預言。
- 不得提供投資買賣指令、醫療診斷或其他高風險決策指令。
- 若資料不足，請先列出不足處，再保守解讀。

${teacherSection(data)}

## 3. 科科本次問題
${ask}

## 4. 資料檢查
${results.map(item => `- ${item.label}：${item.stateText}${item.detail ? `（${item.detail}）` : ""}`).join("\n")}

## 5. 需補齊或確認
${missingLines(results)}

## 6. 建議附上的截圖
${selectedShots("ziwei", data).map(item => `- ${item}`).join("\n")}

## 7. 本次重點宮位
${focus}

## 8. 原始文墨天機文字包
\`\`\`text
${escapeCodeFence(text || "（尚未貼上文字包）")}
\`\`\`
`;
  }

  function buildBaziPacket(data, results) {
    const ask = data.question.trim() || "請依本次任務主題整理八字分析，並先標示資料不足之處。";

    return `# 科科八字任務包

## 1. 任務類型
- 模式：八字任務包
- 分析日期：${data.analysisDate || "（未填）"}
- 任務主題：${data.topics.length ? data.topics.join("、") : "未選擇"}
- 工具版本：${VERSION}

## 2. 小科解讀規則
- 網站只整理八字固定資料與問題，不自行排盤、不自行推算日柱。
- 請小科先推算分析日期的日柱 / 流日干支。
- 請對照科科日主與十神資料。
- 請標示財星、官殺、印星、食傷、比劫哪一類被點亮。
- 若日柱推算不確定，請明確說明，不得硬下結論。
- 百分比為注意力 / 作息配置比重，不是事件發生機率。
- 不得提供投資買賣指令、醫療診斷或絕對預言。

${teacherSection(data)}

## 3. 科科本次問題
${ask}

## 4. 資料檢查
${results.map(item => `- ${item.label}：${item.stateText}`).join("\n")}

## 5. 請小科輸出
- 今日能量配比，總和 100%
- 今日主偏向
- 今日副偏向
- 今日保守面
- 今日適合安排
- 今日不適合安排
- 今日一句浪漫提醒
- 信心等級
- 反證 / 違和點

## 6. 固定八字 TXT
\`\`\`text
${escapeCodeFence(data.baziText.trim() || "（尚未貼上八字 TXT）")}
\`\`\`
`;
  }

  function buildComparePacket(data, results) {
    const ask = data.question.trim() || "請小科比對八字與紫微兩邊訊號，列出一致點、反證與違和點。";

    return `# 科科命理任務包｜合併對照包

## 1. 本次模式
- 模式：八字 × 紫微合併對照
- 目標：用八字作為雷達，用紫微流日作為放大鏡
- 分析日期：${data.analysisDate || "（未填）"}
- 對照目標：${data.topics.length ? data.topics.join("、") : "未選擇"}
- 工具版本：${VERSION}

## 2. 小科對照規則
- 網站只整理資料，不判斷吉凶。
- 八字候選日不是保證好日。
- 紫微流日不是單獨絕對判定。
- 請小科比對兩邊訊號、列出一致點與違和點。
- 若資料不足，請明確標示。
- 百分比為注意力 / 作息配置比重，不是事件發生機率。
- 不得輸出投資買賣指令、醫療診斷或絕對預言。

${teacherSection(data)}

## 3. 八字區
\`\`\`text
${escapeCodeFence(data.baziCompareText.trim() || "（尚未貼上八字候選日 / 八字摘要）")}
\`\`\`

## 4. 紫微區
\`\`\`text
${escapeCodeFence(data.ziweiCompareText.trim() || "（尚未貼上紫微流日資料）")}
\`\`\`

## 5. 科科本次問題
${ask}

## 6. 請小科判斷此日偏向
- 順財
- 忙財
- 破財風險
- 財務整理日
- 資源交換日
- 健康修復日
- 人際協調日
- 工作任務日
- 資料不足

## 7. 請小科輸出
- 今日能量配比，總和 100%
- 主偏向
- 副偏向
- 保守面
- 適合安排
- 不適合安排
- 浪漫提醒
- 信心等級
- 反證 / 違和點

## 8. 資料檢查
${results.map(item => `- ${item.label}：${item.stateText}`).join("\n")}
`;
  }

  function todayText() {
    return new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });
  }

  function renderHome() {
    els.modeGrid.innerHTML = Object.values(MODES).map(mode => `
      <button class="mode-card" data-mode="${mode.id}" type="button">
        <span>
          <h3>${mode.title}</h3>
          <p>${mode.subtitle}</p>
        </span>
        <span class="mode-icon">${mode.icon}</span>
      </button>
    `).join("");
    els.modeGrid.querySelectorAll(".mode-card").forEach(card => {
      card.addEventListener("click", () => openMode(card.dataset.mode));
    });
  }

  function openMode(modeId) {
    currentModeId = modeId;
    renderMode(modeId);
    els.homeView.classList.add("hidden");
    els.builderView.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showHome() {
    els.builderView.classList.add("hidden");
    els.homeView.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderMode(modeId) {
    const mode = MODES[modeId];
    els.modeEyebrow.textContent = mode.eyebrow;
    els.modeTitle.textContent = mode.title;
    els.modeDescription.textContent = mode.description;
    els.modeStep.textContent = "v0.3-alpha";
    els.buildBtn.textContent = mode.buildLabel;
    els.topicHelp.textContent = mode.topicHelp;

    els.fieldsContainer.innerHTML = mode.fields.map(renderTextField).join("");
    els.dateContainer.innerHTML = mode.dateLabel ? renderDateField(mode.dateLabel) : "";
    els.extraFieldsContainer.innerHTML = (mode.extraFields || []).map(renderShortField).join("");
    els.teacherContainer.innerHTML = renderTeacherModes();
    els.topicGrid.innerHTML = mode.topics.map(topic => renderTopic(topic, mode.defaultTopic)).join("");
    els.question.value = "";
    els.output.value = "";
    els.copyBtn.disabled = true;
    els.downloadBtn.disabled = true;
    els.statusText.textContent = "尚未產生任務包。";

    mode.fields.forEach(field => {
      if (field.file) bindFileInput(field.id);
    });
    bindFieldEvents();
    updateAll();
  }

  function renderTextField(field) {
    const fileControl = field.file
      ? `<div class="file-row">
          <input class="file-input" id="${field.id}File" type="file" accept=".txt,.md,text/plain,text/markdown">
          <label class="file-picker" for="${field.id}File">${field.fileLabel || "匯入本機 TXT / MD"}</label>
          <p class="field-help">使用 FileReader 讀取本機檔案，不會上傳、不會儲存。</p>
        </div>`
      : "";
    return `
      <label class="field-label" for="${field.id}">${field.label}</label>
      <textarea id="${field.id}" data-large="${field.large ? "true" : "false"}" spellcheck="false" placeholder="${field.placeholder}"></textarea>
      <div class="meta-row">
        <span id="${field.id}Count">0 字</span>
        <span>建議上限 50,000 字</span>
      </div>
      ${fileControl}
    `;
  }

  function renderShortField(field) {
    return `
      <label class="field-label" for="${field.id}">${field.label}</label>
      <input id="${field.id}" type="text" placeholder="${field.placeholder}">
    `;
  }

  function renderDateField(label) {
    return `
      <label class="field-label" for="analysisDate">${label}</label>
      <input id="analysisDate" type="date">
    `;
  }

  function renderTeacherModes() {
    return `
      <div class="section-title teacher-title">
        <h2>本次請哪一種小科老師解盤？</h2>
        <span class="step">TEACHER</span>
      </div>
      <div class="teacher-grid" id="teacherGrid">
        ${Object.values(TEACHER_MODES).map(renderTeacherCard).join("")}
      </div>
    `;
  }

  function renderTeacherCard(teacher) {
    const checked = teacher.id === "daily" ? "checked" : "";
    return `
      <label class="teacher-card">
        <input type="radio" name="teacherMode" value="${teacher.id}" ${checked}>
        <span class="teacher-copy">
          <strong>${teacher.title}</strong>
          <small>${teacher.tagline}</small>
          <span>${teacher.description}</span>
        </span>
      </label>
    `;
  }

  function renderTopic(topic, defaultTopic) {
    const [icon, label, output, shot, flag] = topic;
    const checked = label === defaultTopic ? "checked" : "";
    const requiresHour = flag === "requiresHour" ? "data-requires-hour=\"true\"" : "";
    const shotAttr = shot ? `data-shot="${shot}"` : "";
    return `<label class="topic"><input type="checkbox" value="${label}" data-output="${output}" ${shotAttr} ${requiresHour} ${checked}><span class="topic-mark">${icon}</span><span>${label}</span></label>`;
  }

  function bindFileInput(fieldId) {
    const input = document.querySelector(`#${fieldId}File`);
    const target = document.querySelector(`#${fieldId}`);
    if (!input || !target) return;
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        target.value = String(reader.result || "");
        updateAll();
        els.statusText.textContent = "已讀取本機 TXT，沒有上傳或儲存。";
      };
      reader.readAsText(file, "utf-8");
    });
  }

  function bindFieldEvents() {
    document.querySelectorAll("textarea, input[type='text'], input[type='date'], select").forEach(item => {
      item.addEventListener("input", updateAll);
      item.addEventListener("change", updateAll);
    });
    els.topicGrid.querySelectorAll("input").forEach(item => item.addEventListener("change", updateAll));
    const teacherGrid = document.querySelector("#teacherGrid");
    if (teacherGrid) teacherGrid.querySelectorAll("input").forEach(item => item.addEventListener("change", updateAll));
  }

  function updateCounts() {
    const mode = MODES[currentModeId];
    mode.fields.forEach(field => {
      const area = document.querySelector(`#${field.id}`);
      const count = document.querySelector(`#${field.id}Count`);
      if (area && count) count.textContent = `${area.value.length.toLocaleString("zh-TW")} 字`;
    });
  }

  function updateAll() {
    updateCounts();
    const data = collectData(document, currentModeId);
    const results = analyzeMode(currentModeId, data);
    renderChecks(results);
    renderShotHints(selectedShots(currentModeId, data));
  }

  function renderChecks(results) {
    const okCount = results.filter(item => item.ok).length;
    els.checkSummary.textContent = `資料檢查：已偵測 ${okCount}/${results.length} 項`;
    els.checkResults.innerHTML = results.map(item => `
      <div class="check-chip ${item.state}" title="${item.label}：${item.stateText}" aria-label="${item.label}：${item.stateText}">
        <strong>${item.shortLabel}</strong>
        <span>${shortStateText(item.state)}</span>
      </div>
    `).join("");
  }

  function shortStateText(state) {
    if (state === "ok") return "已";
    if (state === "miss") return "未";
    return "補";
  }

  function renderShotHints(shots) {
    const preview = shots.slice(0, 2).join("、");
    els.shotSummary.textContent = `建議附圖 / 補充資料：${preview || "依模式產生"}`;
    els.screenshotHints.innerHTML = shots.map(item => `<li>${item}</li>`).join("");
  }

  function buildCurrentPacket() {
    const data = collectData(document, currentModeId);
    const results = analyzeMode(currentModeId, data);
    const packet = MODES[currentModeId].buildPacket(data, results);
    els.output.value = packet;
    els.copyBtn.disabled = false;
    els.downloadBtn.disabled = false;
    const missing = results.filter(item => item.required && !item.ok).length;
    els.statusText.textContent = missing
      ? `已產生任務包；有 ${missing} 個必要欄位未偵測。`
      : "已產生任務包；必要欄位目前皆已偵測。";
  }

  async function copyOutput() {
    if (!els.output.value) return;
    try {
      await navigator.clipboard.writeText(els.output.value);
      els.statusText.textContent = "已複製到剪貼簿。";
    } catch (error) {
      els.output.focus();
      els.output.select();
      document.execCommand("copy");
      els.statusText.textContent = "已用備用方式複製。";
    }
  }

  function downloadOutput() {
    if (!els.output.value) return;
    const data = collectData(document, currentModeId);
    const blob = new Blob([els.output.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `keke-fortune-task-packet-${currentModeId}-${new Date().toISOString().slice(0, 10)}.${data.outputType}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    els.statusText.textContent = `已下載 .${data.outputType} 檔案。`;
  }

  function clearAll() {
    document.querySelectorAll("textarea, input[type='text'], input[type='date'], input[type='file']").forEach(item => {
      item.value = "";
    });
    els.output.value = "";
    els.copyBtn.disabled = true;
    els.downloadBtn.disabled = true;
    els.statusText.textContent = "已清除畫面資料。";
    updateAll();
  }

  function init() {
    els = {
      homeView: document.querySelector("#homeView"),
      builderView: document.querySelector("#builderView"),
      modeGrid: document.querySelector("#modeGrid"),
      modeEyebrow: document.querySelector("#modeEyebrow"),
      modeTitle: document.querySelector("#modeTitle"),
      modeDescription: document.querySelector("#modeDescription"),
      modeStep: document.querySelector("#modeStep"),
      fieldsContainer: document.querySelector("#fieldsContainer"),
      dateContainer: document.querySelector("#dateContainer"),
      topicGrid: document.querySelector("#topicGrid"),
      topicHelp: document.querySelector("#topicHelp"),
      extraFieldsContainer: document.querySelector("#extraFieldsContainer"),
      teacherContainer: document.querySelector("#teacherContainer"),
      question: document.querySelector("#question"),
      outputType: document.querySelector("#outputType"),
      checkSummary: document.querySelector("#checkSummary"),
      checkResults: document.querySelector("#checkResults"),
      shotSummary: document.querySelector("#shotSummary"),
      screenshotHints: document.querySelector("#screenshotHints"),
      output: document.querySelector("#output"),
      statusText: document.querySelector("#statusText"),
      buildBtn: document.querySelector("#buildBtn"),
      copyBtn: document.querySelector("#copyBtn"),
      downloadBtn: document.querySelector("#downloadBtn")
    };

    renderHome();
    els.buildBtn.addEventListener("click", buildCurrentPacket);
    els.copyBtn.addEventListener("click", copyOutput);
    els.downloadBtn.addEventListener("click", downloadOutput);
    document.querySelectorAll(".clear-action").forEach(button => button.addEventListener("click", clearAll));
    document.querySelector("#backHomeBtn").addEventListener("click", showHome);
    document.querySelector("#switchModeBtn").addEventListener("click", showHome);
  }

  if (typeof window !== "undefined") {
    window.KekePacketBuilder = {
      VERSION,
      MODES,
      TEACHER_MODES,
      analyzeMode,
      createPacket,
      collectDataForTest: collectData
    };
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
