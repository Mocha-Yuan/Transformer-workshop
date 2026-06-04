export type Language = 'zh' | 'en';

export const LANGUAGE_STORAGE_KEY = 'transformer-workshop-language';

const zhToEn: Record<string, string> = {
  'Transformer 工坊：手搓大模型': 'Transformer Workshop: Build a Model by Hand',
  '用拖拽和连线，亲手走完 Transformer 的核心流程。': 'Drag, connect, and walk through the core Transformer flow yourself.',
  '剧情任务': 'Story mission',
  '翻译任务': 'Translation mission',
  'TransBot 收到一批机器翻译急件，但语言理解线路乱了。你要边解谜边修复模块，最后交付一份译文草案。':
    'TransBot has urgent machine-translation jobs, but its language-understanding circuit is scrambled. Solve puzzles, repair modules, and deliver a draft translation.',
  '学习记录': 'Learning record',
  '知识小测最高分': 'Quiz high score',
  '已完成自由练习': 'Practice completed',
  '主页导航': 'Home navigation',

  '新手引导': 'Beginner Guide',
  '先跟 TransBot 成功走一遍。': 'Finish one successful run with TransBot first.',
  '开始闯关': 'Start Campaign',
  '按关卡修复 Transformer 流程。': 'Repair the Transformer flow level by level.',
  '自由练习': 'Free Practice',
  '选一个模块顺序反复练。': 'Pick a module sequence and practice it repeatedly.',
  '学习图鉴': 'Learning Atlas',
  '查看完整解释和翻译类比。': 'Read full explanations and translation analogies.',
  '译员视角': 'Translator View',
  '从译员动作反推模块作用。': 'Infer module roles from translator actions.',
  '句子实验台': 'Sentence Lab',
  '用自己的句子生成互动任务。': 'Generate interactive tasks from your own sentence.',
  '拿一句话试 Transformer': 'Try Transformer with One Sentence',
  '输入自己的句子，生成 Token、语序、指代、连接词和重点词任务。':
    'Enter your own sentence to generate Token, order, reference, connector, and focus-word tasks.',
  '去闯关': 'Go to Campaign',
  '我的成就': 'My Achievements',
  '查看已解锁的学习徽章。': 'View unlocked learning badges.',
  '错题本': 'Mistake Review',
  '复盘常见连错原因。': 'Review common connection mistakes.',
  '最终挑战': 'Final Challenge',
  '一次接通完整流程。': 'Connect the full flow in one run.',
  '可视化工坊': 'Visual Workshop',
  '观察节点和信息流动。': 'Watch nodes and information flow.',
  '知识小测': 'Knowledge Quiz',
  '用 8 道题检查理解。': 'Check your understanding with 8 questions.',
  '关于项目': 'About',
  '了解这个学习工坊。': 'Learn about this workshop.',

  '学习路线图': 'Learning Roadmap',
  '我现在学到哪了？': 'Where am I now?',
  '读入文字': 'Read Text',
  '原文入口': 'Source Input',
  '先让模型看到一句话。': 'Let the model see a sentence first.',
  '变成语义': 'Make Meaning',
  '语义卡片': 'Semantic Card',
  '把词块变成可计算的表示。': 'Turn chunks into computable representations.',
  '记住顺序': 'Remember Order',
  '语序标记': 'Order Markers',
  '告诉模型谁在前、谁在后。': 'Tell the model what comes before and after.',
  '回看上下文': 'Look Back',
  '上下文重点': 'Context Focus',
  '判断哪些词更值得关注。': 'Decide which words deserve attention.',
  '多角度理解': 'Multi-angle Understanding',
  '多头审句': 'Multi-head Review',
  '从语法、指代、语气等角度一起看。': 'Review grammar, reference, tone, and more together.',
  '加工输出': 'Process Output',
  '组织表达': 'Shape Expression',
  '把理解加工成输出预测。': 'Turn understanding into output prediction.',
  '读入文字 → 变成语义 → 记住顺序 → 回看上下文 → 多角度理解 → 加工输出':
    'Read text -> make meaning -> remember order -> look back -> understand from many angles -> process output',

  '成就系统': 'Achievement System',
  '我的 TransBot 徽章墙': 'My TransBot Badge Wall',
  '这里记录你已经完成的学习动作。': 'This records the learning actions you have completed.',
  '继续闯关': 'Continue Campaign',
  '返回主页': 'Back Home',
  '成就解锁：': 'Achievement unlocked: ',
  '收起': 'Collapse',
  '已解锁': 'unlocked',
  '完成关卡、复盘错误和自由练习都会点亮新徽章。':
    'Completing levels, reviewing mistakes, and practicing will light up new badges.',
  '尚未解锁，继续修复 TransBot。': 'Locked for now. Keep repairing TransBot.',

  '最终综合挑战': 'Final Integrated Challenge',
  '重建 TransBot 的完整线路': 'Rebuild TransBot\'s Full Circuit',
  '重新随机布局': 'Shuffle Layout',
  '最终挑战：重建完整理解线路': 'Final Challenge: Rebuild the Full Understanding Circuit',
  '从 Token 一直连接到 Output。': 'Connect all the way from Token to Output.',
  'TransBot 的完整线路被打乱了。': 'TransBot\'s full circuit has been scrambled.',
  '最终挑战完成！整条语言理解线路重新亮起。': 'Final challenge complete. The full language-understanding circuit is lit again.',
  '你已经串起切片、语义、语序、注意力、加工和输出。':
    'You have linked tokenizing, meaning, order, attention, processing, and output.',
  '像完成了一次从读原文到组织表达的完整流程。':
    'It is like completing a full workflow from reading the source to shaping the expression.',
  '输出来自前面一步步理解加工，不是直接跳出来的。':
    'Output comes from step-by-step understanding and processing, not from a shortcut.',
  'Transformer 会先切分句子，建立语义和位置，再回看上下文，最后加工成输出。':
    'A Transformer first tokenizes the sentence, builds meaning and position signals, looks back at context, then processes that into output.',
  '暂无明显混淆模块': 'No obvious confusion yet',
  '连接顺序': 'Connection order',
  '学习总结报告': 'Learning Summary',
  '完整流程已接通': 'Full Flow Connected',
  '你现在可以这样解释给别人听': 'You can now explain it like this',
  '想继续巩固，可以去自由练习里专门练最容易混淆的部分。':
    'To strengthen this, practice the part that confused you most in Free Practice.',
  '再挑战一次': 'Try Again',
  '去自由练习': 'Go to Practice',
  '最终挑战总结报告': 'Final challenge summary',

  'Transformer 理解检测': 'Transformer Understanding Check',
  '选完立即看原因。完整解释可以回图鉴复习。': 'Choose an answer and see why immediately. Review full explanations in the atlas.',
  '测验进度': 'Quiz progress',
  '当前得分': 'Current score',
  '答题进度': 'Answer progress',
  'Transformer 中文测验题目': 'Transformer quiz questions',
  '回答正确': 'Correct',
  '再想一想': 'Think again',
  '测验结果': 'Quiz result',
  '测验完成': 'Quiz complete',
  '不错，你已经抓住主流程了。': 'Nice, you have grasped the main flow.',
  '没关系，先回图鉴补一遍关键概念。': 'No problem. Review the key ideas in the atlas first.',
  '重新答题': 'Restart Quiz',
  '复习图鉴': 'Review Atlas',

  'Transformer 概念图鉴': 'Transformer Concept Atlas',
  '这里放完整解释、类比和例子。主流程看不懂时，再回这里慢慢查。':
    'Full explanations, analogies, and examples live here. If the main flow feels unclear, come back and look things up slowly.',
  '去搭建练习': 'Go Build',
  'Transformer 学习图鉴条目': 'Transformer atlas entries',
  '它在做什么': 'What it does',
  '翻译类比': 'Translation analogy',
  '例子': 'Example',
  '在 Transformer 中': 'In the Transformer',
  '收起解释': 'Hide explanation',
  '展开解释': 'Show explanation',
  '看详细解释': 'Show details',

  '选择你的 Transformer 练习任务': 'Choose Your Transformer Practice Task',
  '像搭积木一样选择一个任务，反复练习 Transformer 的关键结构。':
    'Choose a task like building blocks and practice the key Transformer structures repeatedly.',
  '进入闯关模式': 'Enter Campaign Mode',
  '学习统计': 'Learning Stats',
  '推荐复习': 'Recommended Review',
  '自由练习学习统计': 'Free practice stats',
  '自由练习关卡列表': 'Free practice levels',
  '总练习次数：': 'Total practice runs: ',
  '最近练习：': 'Recent practice: ',
  '暂无': 'None yet',
  '这关还没有完成记录，适合先补齐学习地图。':
    'This level has no completion record yet, so it is a good place to fill in the map.',
  '这关距离上次练习最久，适合用来热身。': 'This level has gone the longest without practice, so it is a good warm-up.',
  '适合复盘连接顺序。': 'Good for reviewing connection order.',
  '完成 ': 'Completed ',
  '最快 ': 'Best ',
  '最近 ': 'Recent ',
  ' 个模块': ' modules',
  '开始练习': 'Start Practice',
  '入门': 'Beginner',
  '进阶': 'Intermediate',
  '挑战': 'Challenge',

  '文本进入模型': 'Text Enters the Model',
  '先搭入口：切片、建语义、补语序。': 'Build the input path first: tokenize, make meaning, add order.',
  'TransBot 的入口线路断了，先把原文送进模型。': 'TransBot\'s input circuit is broken. Send the source text into the model first.',
  'TransBot：入口已恢复，我知道该先读小片段了。': 'TransBot: Input restored. I know I should read small chunks first.',
  '修复原文入口模块': 'Repair the Source Input Module',
  '按 Token → Embedding → Position Encoding 连接。': 'Connect Token -> Embedding -> Position Encoding.',
  'TransBot 还分不清词块，也记不住顺序。': 'TransBot still cannot separate chunks or remember their order.',
  '入口修复成功！原文已经能进入模型。': 'Input repaired. The source text can enter the model now.',
  'Token 负责切分，Embedding 建立语义表示，Position Encoding 补上顺序线索。':
    'Token splits text, Embedding builds semantic representation, and Position Encoding adds order clues.',
  '像译前处理：先拆句，再标注每个片段的意思和位置。':
    'Like pre-translation analysis: split the sentence, then mark each segment\'s meaning and position.',
  '模型不是直接读整句话，而是先读小片段。': 'The model does not read the whole sentence directly; it reads small pieces first.',

  '注意力三件套': 'Attention Trio',
  '准备注意力材料：提问、找线索、取内容。': 'Prepare attention materials: ask, match clues, retrieve content.',
  'TransBot 需要学会从上下文里找信息。': 'TransBot needs to learn how to find information in context.',
  'TransBot：上下文检索已上线，我知道先问什么了。': 'TransBot: Context retrieval online. I know what to ask first.',
  '启动上下文检索芯片': 'Start the Context Retrieval Chip',
  '按 Query → Key → Value 连接。': 'Connect Query -> Key -> Value.',
  'TransBot 不知道该先提问、匹配线索，还是直接取内容。':
    'TransBot does not know whether to ask, match clues, or retrieve content first.',
  '检索芯片启动！上下文材料准备好了。': 'Retrieval chip started. Context materials are ready.',
  'Query 像问题，Key 像线索标签，Value 像真正取回的内容。':
    'Query is like a question, Key is like a clue label, and Value is the retrieved content.',
  '像译员先问“缺什么信息”，再去原文里找对应线索。':
    'Like a translator first asking what information is missing, then finding matching clues in the source.',
  '注意力要先提问、找线索，再取回内容。': 'Attention asks first, matches clues next, and retrieves content after that.',

  '自注意力机制': 'Self-Attention Mechanism',
  '让词回看上下文，判断谁更重要。': 'Let words look back at context and judge what matters.',
  'TransBot 读到代词和长句时需要回头看。': 'TransBot needs to look back when reading pronouns and long sentences.',
  'TransBot：我会给上下文划重点了。': 'TransBot: I can highlight context now.',
  '点亮上下文聚光灯': 'Light the Context Spotlight',
  '让 Query、Key、Value 汇入 Self-Attention。': 'Send Query, Key, and Value into Self-Attention.',
  'TransBot 会把代词当成孤立词，找不到指代关系。': 'TransBot treats pronouns as isolated words and misses references.',
  '聚光灯点亮！每个词都能回看整句话。': 'Spotlight on. Every word can look back across the sentence.',
  'Self-Attention 会根据 Q/K/V 的匹配结果分配关注重点。':
    'Self-Attention assigns focus based on Q/K/V matching results.',
  '像译员处理“它”时，会回看前文确认指向谁。':
    'Like a translator looking back to confirm what "it" refers to.',
  '理解一个词，常常要回头看别的词。': 'To understand one word, you often need to look back at other words.',

  'Transformer 核心模块': 'Transformer Core Module',
  '多角度看上下文，再稳定加工理解。': 'View context from multiple angles, then process understanding steadily.',
  'TransBot 已能找重点，现在要让理解更稳。': 'TransBot can find focus now; next it needs steadier understanding.',
  'TransBot：核心处理模块恢复，我会更稳地加工理解了。': 'TransBot: Core processing restored. I can process understanding more steadily.',
  '修复核心加工车间': 'Repair the Core Processing Workshop',
  '按 Multi-Head Attention → Add & Norm → Feed Forward → Add & Norm 连接。':
    'Connect Multi-Head Attention -> Add & Norm -> Feed Forward -> Add & Norm.',
  'TransBot 还不会多角度审句，也不够稳定。': 'TransBot cannot review sentences from multiple angles yet, and it is not stable enough.',
  '核心车间运转！理解可以继续加工了。': 'Core workshop running. Understanding can keep being processed.',
  'Multi-Head 多角度看关系，Add & Norm 稳定信息，Feed Forward 继续加工。':
    'Multi-Head views relationships from many angles, Add & Norm stabilizes information, and Feed Forward keeps processing.',
  '像译员先审句，再保留原意，最后继续润色理解结果。':
    'Like a translator reviewing a sentence, preserving the original meaning, and polishing the understanding.',
  '多头不是重复看，而是从多个角度同时看。': 'Multi-head is not repeated viewing; it views from multiple angles at once.',

  '完整 Transformer 流程': 'Full Transformer Flow',
  '从输入走到输出，串起整条理解路线。': 'Go from input to output and link the whole understanding route.',
  '最后把 TransBot 的完整线路接通。': 'Finally connect TransBot\'s full circuit.',
  'TransBot：语言理解系统恢复，完整流程亮起来了。': 'TransBot: Language understanding restored. The full flow is lit.',
  '接通完整理解线路': 'Connect the Full Understanding Circuit',
  'TransBot 的线路板被打乱了，需要重新排序。': 'TransBot\'s circuit board is scrambled and needs reordering.',
  '完整线路接通！输入到输出的流程恢复了。': 'Full circuit connected. The input-to-output flow is restored.',
  '完整流程会经历切片、语义、位置、注意力、加工和输出。':
    'The full flow goes through tokenizing, meaning, position, attention, processing, and output.',
  '像从读懂原文、回看上下文，到组织表达的一条完整路线。':
    'Like a complete path from understanding the source, looking back at context, and shaping expression.',

  '词元': 'Token',
  '嵌入': 'Embedding',
  '位置编码': 'Position Encoding',
  '查询': 'Query',
  '键': 'Key',
  '值': 'Value',
  '自注意力': 'Self-Attention',
  '多头注意力': 'Multi-Head Attention',
  '残差与归一化': 'Add & Norm',
  '前馈网络': 'Feed Forward',
  'Transformer 模块': 'Transformer Block',
  '输出': 'Output',
  '原文切片师': 'Source Slicer',
  '语义卡片员': 'Semantic Card Maker',
  '语序警卫': 'Order Guard',
  '问题发射员': 'Question Launcher',
  '线索挂牌员': 'Clue Labeler',
  '信息搬运员': 'Information Carrier',
  '上下文侦探': 'Context Detective',
  '多视角审句团': 'Multi-angle Review Team',
  '原意稳定器': 'Meaning Stabilizer',
  '理解加工师': 'Understanding Processor',
  '一轮审校车间': 'Review Workshop',
  '表达出口员': 'Expression Output',
  '先把整句切成小片段。': 'Split the whole sentence into small pieces first.',
  '把词块变成语义表示。': 'Turn chunks into semantic representations.',
  '提醒模型谁在前、谁在后。': 'Remind the model what comes before and after.',
  '先问：我需要什么线索？': 'Ask first: what clues do I need?',
  '给上下文挂上可匹配的标签。': 'Attach matchable labels to context.',
  '把真正有用的内容带回来。': 'Bring back the truly useful content.',
  '让每个词回看整句话。': 'Let each word look back at the whole sentence.',
  '从多个角度同时看。': 'Look from multiple angles at once.',
  '保留原信息，再整理新理解。': 'Keep the original information, then organize the new understanding.',
  '继续打磨每个位置的理解。': 'Keep refining the understanding at each position.',
  '把注意力和加工组合成一轮流程。': 'Combine attention and processing into one round.',
  '把内部理解转成结果。': 'Turn internal understanding into a result.',
  '把文字切成模型能处理的小单位。': 'Split text into small units the model can process.',
  '给每个 Token 做一张语义卡。': 'Make a semantic card for each Token.',
  '给词块补上顺序信息。': 'Add order information to chunks.',
  '代表当前词想找什么信息。': 'Represents what the current word wants to find.',
  '让上下文片段可以被匹配。': 'Makes context fragments matchable.',
  '提供被取回的上下文内容。': 'Provides the retrieved context content.',
  '判断哪些上下文最关键。': 'Judges which context is most important.',
  '并行观察不同关系。': 'Observes different relationships in parallel.',
  '让信息传递更稳定。': 'Makes information flow more stable.',
  '对已经看过上下文的信息再加工。': 'Further processes information after context has been considered.',
  '一轮完整的理解加工。': 'One complete round of understanding and processing.',
  '根据理解给出下一步输出。': 'Produces the next output based on understanding.',

  '3 分钟新手教程': '3-Minute Tutorial',
  '先陪 TransBot 成功一次': 'Help TransBot Succeed Once',
  '四个小动作，带你进入第一关。': 'Four small actions take you into the first level.',
  '跳到闯关': 'Skip to Campaign',
  '新手引导剧情线': 'Beginner guide story line',
  'TransBot 新手频道': 'TransBot Beginner Channel',
  '第一步：什么是 Token？': 'Step 1: What Is a Token?',
  '模型先读小片段。': 'The model reads small pieces first.',
  '先把“我喜欢机器翻译”切成“我 / 喜欢 / 机器翻译”。':
    'First split "I like machine translation" into "I / like / machine translation".',
  '切成小块': 'Split into Chunks',
  '第二步：为什么要语序？': 'Step 2: Why Does Order Matter?',
  '顺序变了，关系也会变。': 'When order changes, relationships change too.',
  '同样的词换个位置，谁做什么就可能不一样。':
    'The same words in different positions can change who does what.',
  '看看顺序': 'Check Order',
  '第三步：为什么要注意力？': 'Step 3: Why Attention?',
  '理解一个词，要回看上下文。': 'To understand a word, look back at context.',
  '读到“它”时，需要回头找它可能指向谁。': 'When reading "it", look back to find what it may refer to.',
  '点亮线索': 'Light the Clues',
  '第四步：亲手连一次': 'Step 4: Connect It Yourself',
  '先成功一次就够了。': 'One successful run is enough to start.',
  '第一关只需要记住：Token → Embedding → Position Encoding。':
    'For the first level, remember: Token -> Embedding -> Position Encoding.',
  '进入第一关': 'Enter Level 1',
  '上一步': 'Previous',
  '教程进度': 'Tutorial progress',

  '当前页面': 'Current Page',
  '这是一个面向 MTI 翻译硕士的中文像素风学习应用。它不要求代码基础，而是用“切分原文、保留语序、判断上下文重点、再加工表达”等翻译学习经验，帮助你理解 Transformer 的基本思路。':
    'This pixel-style learning app is designed for MTI translation students. It does not require coding knowledge; it uses translation-learning experiences such as source segmentation, word order, context focus, and expression refinement to explain Transformer basics.',

  '译员动作': 'Translator actions',
  '输入句子区域': 'Sentence input area',
  '原文句子': 'Source sentence',
  '再试一句': 'Try Another',
  '清空句子': 'Clear Sentence',
  '一句话解释': 'One-sentence explanation',
  'Token 拆分结果': 'Token split result',
  '整句话语法分析': 'Whole-sentence grammar analysis',
  '对比理解': 'Compare the ideas',
  '从一句话读懂 Transformer': 'Understand Transformer from One Sentence',
  '选一个译员动作，看它对应哪个模块。': 'Choose a translator action and see which module it maps to.',
  '先切分词块': 'Split chunks first',
  '判断语序': 'Judge word order',
  '找上下文重点': 'Find context focus',
  '多角度理解句子': 'Understand the sentence from many angles',
  '组织输出表达': 'Shape output expression',
  '请先输入一句中文。': 'Enter a sentence first.',

  '把左侧模块拖到这里。': 'Drag modules here from the left.',
  '方向对了，继续下一块。': 'Good direction. Continue with the next block.',
  '顺序不对，撤回后重试。': 'Wrong order. Undo and try again.',
  '本次搭建完成。': 'This build is complete.',
  'Transformer 搭建区': 'Transformer build area',
  '当前关卡目标槽位': 'Current level target slots',
  '拖入第一个模块，或直接点击左侧卡片添加。': 'Drag in the first module, or click a card on the left to add it.',
  '进入下一关': 'Next Level',
  '可以在弹窗中选择下一步。': 'Choose the next step in the dialog.',
  '模块库': 'Module Library',
  '任务提示': 'Mission Tips',
  '当前关卡': 'Current Level',
  '目标流程': 'Target Flow',
  '当前进度': 'Current Progress',
  '已放入模块': 'Placed Modules',
  '清空重来': 'Clear and Restart',
  '切换到新版连接画布': 'Switch to New Connection Canvas',
  '切换到经典搭建区': 'Switch to Classic Build Area',
  '查看全部模块': 'Show All Modules',
  '只看目标模块': 'Only Target Modules',
  '重新开始本关': 'Restart Level',
  '收起模块栏': 'Collapse modules',
  '展开模块栏': 'Expand modules',
  '收起提示栏': 'Collapse tips',
  '展开提示栏': 'Expand tips',
  '返回': 'Back',
  '完成复盘': 'Completion Review',
  '继续练习': 'Keep Practicing',
  '回到主页': 'Back to Home',
  '再练一次': 'Practice Again',

  '当前任务': 'Current Task',
  '今日只学一句': 'Today\'s one-liner',
  '操作目标': 'Goal',
  '目标连接顺序': 'Target connection order',
  '错误递进提示': 'Mistake guidance ladder',
  '错误也能推进': 'Mistakes can still move learning forward',
  '误区提示': 'Misconception hint',
  '为什么错': 'Why it is wrong',
  '正确思路': 'Correct idea',
  '一句话翻译类比': 'One-sentence translation analogy',
  '当前模块': 'Current Module',
  '点击一个模块节点，查看它当前负责什么。': 'Click a module node to see what it is responsible for.',
  '提示：选中连线后按 Delete 或 Backspace 可以删除。':
    'Tip: select a connection and press Delete or Backspace to remove it.',
  '连接反馈和教学说明': 'Connection feedback and teaching notes',
  '小演示': 'Mini Demo',
  '教学动画选择': 'Teaching animation selector',
  '切成 Token': 'Split into Tokens',
  '合回原句': 'Join Sentence',
  '看动作：整句先变成小片段。': 'Watch the action: the whole sentence becomes small pieces first.',
  '先读这句话': 'Read this sentence first',
  '注意力演示句子': 'Attention demo sentence',
  '问题：': 'Question: ',
  '收起回看过程': 'Hide look-back process',
  '换一个': 'Change Example',
  '候选 ': 'Candidate ',
  '先别看线，先问一句：这个词需要回头找哪条线索？':
    'Before looking at the lines, ask: which clue does this word need to look back for?',

  '句子进入 Transformer': 'A Sentence Enters the Transformer',
  '迷你互动演示': 'Mini Interactive Demo',
  '输入一句中文，看看模型如何像译前分析一样：先切分，再保留语序，接着判断上下文重点。':
    'Enter a sentence and see how the model works like pre-translation analysis: split first, keep order, then judge context focus.',
  '输入句子': 'Input sentence',
  '重置演示': 'Reset Demo',
  '原始句子': 'Original Sentence',
  '切成可处理的小片段': 'Split into Processable Pieces',
  '每个片段变成语义卡片': 'Each Piece Becomes a Semantic Card',
  '保留语序信息': 'Keep Word Order',
  '进入注意力层：判断上下文重点': 'Enter Attention: Judge Context Focus',
  '模拟输出': 'Simulated Output',
  '重新演示': 'Replay Demo',
  '下一步': 'Next',
  '自动生成的句子任务': 'Auto-generated sentence tasks',
  '自动任务': 'Auto Tasks',
  '点一个任务，同步看讲解': 'Click a task to sync the explanation',
  '这里用教学版切分：优先保留常见词块和功能词。真实模型会更复杂，可能切成字、词或子词。':
    'This teaching splitter keeps common word chunks and function words first. Real models are more complex and may split into characters, words, or subwords.',
  '这些小数字不是真实模型结果，只是模拟“模型把文字变成可计算的语义表示”。':
    'These small numbers are not real model outputs. They only simulate how a model turns text into computable semantic representations.',
  '就像翻译时不能丢掉语序：谁修饰谁、谁在前谁在后，都会影响理解。':
    'Like translation, word order cannot be ignored: modifiers, sequence, and relationships all affect understanding.',
  '这里用连线感模拟注意力：每个片段都会参考上下文，像译员判断哪些词最影响当前表达。':
    'This uses connected nodes to simulate attention: each piece refers to context, like a translator judging which words affect the current expression most.',
  '模型正在根据上下文预测下一个可能的词，就像译员根据前文选择更合适的后续表达。':
    'The model is predicting a possible next word from context, like a translator choosing a better next expression from what came before.',

  '现在还没有错题记录': 'No Mistake Records Yet',
  '去可视化工坊试着连接模块。连错后，这里会自动生成复盘卡。':
    'Try connecting modules in the Visual Workshop. After a wrong connection, review cards will be generated here.',
  '去工坊试试看': 'Try the Workshop',
  '误区复盘列表': 'Misconception review list',
  '不建议这样连': 'Not recommended',
  '错过 ': 'Missed ',

  '搭建练习': 'Build Practice',
  '自由练习工作台': 'Free Practice Workbench',
  'Transformer 翻译工作台': 'Transformer Translation Workbench',
  '当前关卡进度': 'Current level progress',
  '当前练习': 'Current practice',
  '切换旧版搭建区': 'Switch to Classic Build Area',
  '使用新版可视化工坊': 'Use the New Visual Workshop',
  '撤回一步': 'Undo Step',
  '重置当前关卡': 'Reset Current Level',
  '已解锁关卡选择': 'Unlocked level selector',
  '已解锁关卡': 'Unlocked Levels',
  '可以回到已通关的练习重新搭建，最高进度会保留。':
    'You can return to cleared levels and rebuild them. Your highest progress is kept.',
  '模块仓库': 'Module Library',
  '展开模块仓库': 'Expand Module Library',
  '收起模块仓库': 'Collapse Module Library',
  '模块': 'Modules',
  '只看本关模块': 'Only This Level',
  '显示全部模块': 'Show All Modules',
  '教学提示': 'Teaching Tips',
  '展开教学提示': 'Expand Teaching Tips',
  '收起教学提示': 'Collapse Teaching Tips',
  '收起提示': 'Collapse Tips',
  '提示': 'Tips',
  '关卡完成': 'Level Complete',
  '练习完成！': 'Practice Complete!',
  '关卡完成！': 'Level Complete!',
  '你刚刚修复的误区': 'Misconception You Just Fixed',
  '本关复盘': 'Level Review',
  '查看本关复盘': 'View Level Review',
  '收起本关复盘': 'Hide Level Review',
  '返回首页': 'Back Home',
  '继续下一关': 'Continue to Next Level',

  '教学提示面板': 'Teaching tips panel',
  '本关提示': 'Level Tips',
  '现在做什么': 'What to do now',
  '这一处需要调整': 'This needs adjustment',
  '本关完成': 'Level complete',
  '第一次错没关系：先撤回，再想“前一步有没有准备好语义或线索”。':
    'One mistake is fine: undo first, then ask whether the previous step prepared meaning or clues.',
  '第二次错：看画布里高亮的下一步，它就是当前最该补上的模块。':
    'Second mistake: look at the highlighted next step on the canvas. That is the missing module to add.',
  '第三次以后：可以先看答案演示，系统收起答案后再自己搭一次。':
    'After the third mistake: watch the answer demo first. When it hides the answer, build it yourself again.',
  '先从左侧选择第一个模块。': 'Choose the first module from the left.',
  '方向对了，继续放下一个模块。': 'Right direction. Place the next module.',
  '顺序不对。撤回这一步，再看目标顺序。': 'The order is wrong. Undo this step and check the target sequence.',
  '搭对了。本关流程已经接通。': 'Correct. This level flow is connected.',
  '1 提醒原因': '1 Explain the reason',
  '2 高亮缺口': '2 Highlight the gap',
  '3 看演示再挑战': '3 Watch demo, then try again',
  '已放置模块': 'Placed modules',

  '自由练习画布': 'Free Practice Canvas',
  '闯关连接画布': 'Campaign Connection Canvas',
  'Transformer 可视化工坊': 'Transformer Visual Workshop',
  '在这里，你将像连接机器一样理解 Transformer 的信息流动。':
    'Here, you will understand Transformer information flow by connecting modules like a machine.',
  'Transformer 可连接画布': 'Transformer connectable canvas',
  '可视化教学面板': 'Visual teaching panel',
  '展开可视化教学面板': 'Expand visual teaching panel',
  '关闭点击连接': 'Turn Off Click Connect',
  '点击连接模式': 'Click Connect Mode',
  '正在演示': 'Demo Playing',
  '先看答案演示': 'Show Answer Demo',
  '重置连接': 'Reset Connections',
  '恢复默认布局': 'Restore Default Layout',
  '自动整理布局': 'Auto Layout',
  '你可以拖动模块，整理自己的 Transformer 工作台布局。':
    'You can drag modules to organize your Transformer workbench layout.',
  '说明': 'Notes',
  '输入区': 'Input',
  '编码区': 'Encoding',
  '注意力区': 'Attention',
  '加工区': 'Processing',
  '输出区': 'Output',
  '看原因': 'See Why',
  '收起说明': 'Collapse Notes',
  '闯关模式': 'Campaign Mode',
  '1 TransBot 提醒可能跳过了哪一步': '1 TransBot points out which step may have been skipped',
  '2 画布高亮当前缺口': '2 The canvas highlights the current gap',
  '3 半透明正确路径已展开，可先看答案演示': '3 The translucent correct path is visible, so you can study the demo first',

  'Token 切片机': 'Token Slicer',
  '语义卡片机': 'Semantic Card Maker',
  '语序标记器': 'Order Marker',
  '提问器': 'Query Tool',
  '线索标签': 'Clue Label',
  '线索内容': 'Clue Content',
  '上下文聚光灯': 'Context Spotlight',
  '多视角审句台': 'Multi-angle Review Desk',
  '理解加工站': 'Understanding Processor',
  '预测输出口': 'Prediction Output',
  '模型要先把词块变成能计算的语义表示。': 'The model must turn chunks into computable semantic representations first.',
  '词一样不代表意思一样，顺序也很重要。': 'The same words do not always mean the same thing; order matters too.',
  '理解当前词之前，先问需要什么线索。': 'Before understanding the current word, ask what clue is needed.',
  '上下文要挂上线索标签，才方便被匹配。': 'Context needs clue labels so it can be matched.',
  '真正拿回来的不是标签，而是内容。': 'What gets brought back is not the label, but the content.',
  '新理解要和原信息一起保留，才不容易跑偏。': 'New understanding should keep the original information so it does not drift.',
  '看懂上下文以后，还要继续加工每个位置的理解。': 'After reading context, each position still needs further processing.',
  '输出不是凭空出现，而是来自前面的理解加工。': 'Output does not appear from nowhere; it comes from earlier understanding and processing.',
  '把一句话切成模型能处理的小片段。': 'Split a sentence into small pieces the model can process.',
  '把 Token 变成带语义信息的数字向量。': 'Turn Tokens into numeric vectors with semantic information.',
  '告诉模型每个词块在句子里的位置。': 'Tell the model where each chunk sits in the sentence.',
  '代表当前词块想从上下文里找什么信息。': 'Represent what the current chunk wants to find in context.',
  '给每个词块贴上线索标签。': 'Attach a clue label to each chunk.',
  '被取回并汇入理解结果的信息。': 'Information retrieved and merged into the understanding.',
  '让句子中的每个词块回看其他词块。': 'Let each chunk in the sentence look back at other chunks.',
  '从多个角度同时理解句子关系。': 'Understand sentence relationships from multiple angles at once.',
  '保留原信息，并让新理解更稳定。': 'Keep original information and make new understanding more stable.',
  '对每个位置的信息进一步加工。': 'Further process the information at each position.',
  '根据上下文输出一个模拟预测结果。': 'Output a simulated prediction based on context.',
  '像译员先把长句拆成词块、短语或意群。': 'Like a translator first splitting a long sentence into words, phrases, or sense groups.',
  '像给每个词块做一张语义卡，记录含义、语气和搭配线索。':
    'Like making a semantic card for each chunk, recording meaning, tone, and collocation clues.',
  '像保留原文语序，避免理解关系错位。': 'Like preserving source word order to avoid misreading relationships.',
  '像译员读到一个词时，在心里问：这里我缺哪条线索？':
    'Like a translator asking internally: what clue am I missing here?',
  '像原文片段标出自己能提供什么语法或语义线索。':
    'Like source fragments marking which grammar or meaning clues they can provide.',
  '像译员找到相关片段后，真正拿来参考的内容。':
    'Like the content a translator actually uses after finding the relevant fragment.',
  '像译员判断代词、搭配或长句修饰关系时，会回看整句。':
    'Like a translator looking back across the sentence to resolve pronouns, collocations, or modifiers.',
  '像翻译小组同时从语法、指代、语体和逻辑关系审句。':
    'Like a translation team reviewing grammar, reference, style, and logic at the same time.',
  '像润色译文时既保留原意，又整理刚加工过的表达。':
    'Like polishing a translation while preserving the original meaning and organizing the revised expression.',
  '像译后再加工，把上下文重点打磨成更清楚的理解。':
    'Like post-translation refinement that turns context focus into clearer understanding.',
  '像译员综合上下文后，选择下一步合适的表达。':
    'Like a translator choosing the next suitable expression after considering context.',
  'Token 是模型处理语言的基本单位，文本要先被拆成 Token 才能进入后续计算。':
    'Tokens are the basic language units for the model. Text must be split into Tokens before later computation.',
  'Embedding 把离散文字单位转换成模型可以计算的向量表示。':
    'Embedding converts discrete text units into vector representations the model can compute.',
  'Position Encoding 为向量加入位置信息，让模型区分同样词语在不同位置的作用。':
    'Position Encoding adds position information to vectors so the model can distinguish the role of words in different positions.',
  'Query 用来和其他位置的 Key 做匹配，决定当前 Token 应该关注哪里。':
    'Query matches Keys at other positions to decide where the current Token should attend.',
  'Key 和 Query 匹配，帮助模型判断哪些位置与当前理解最相关。':
    'Key matches Query and helps the model decide which positions are most relevant.',
  'Value 承载被注意力权重加权汇总的信息，是上下文影响当前表示的主要来源。':
    'Value carries information weighted and aggregated by attention, making it the main source of context influence.',
  'Self-Attention 让每个位置根据上下文更新自己的表示，捕捉词与词之间的关系。':
    'Self-Attention lets each position update its representation from context and capture relationships between words.',
  'Multi-Head Attention 用多个注意力头并行观察上下文，再合并多种关系信息。':
    'Multi-Head Attention observes context in parallel with multiple heads, then combines different relationship signals.',
  'Add & Norm 通过残差连接保留原表示，并用归一化让信息传递更稳定。':
    'Add & Norm preserves the original representation with residual connections and stabilizes information flow with normalization.',
  'Feed Forward 对每个位置的表示进行变换，提升模型表达和推理能力。':
    'Feed Forward transforms each position representation to improve expression and reasoning capacity.',
  'Output 把模型内部表示转换成最终预测，例如下一个词或分类结果。':
    'Output converts internal representations into final predictions, such as the next word or a class.',

  '关卡玩法任务': 'Level gameplay tasks',
  'TransBot 陪练': 'TransBot Coach',
  '看一次演示': 'Watch a Demo',
  '玩法小任务': 'Mini Activity',
  '切换玩法任务': 'Switch activity',
  '这本书虽然很难，但它很有价值。': 'This book is difficult, but it is valuable.',
  '这本书 / 虽然 / 很难 / 但 / 它 / 很有价值':
    'This book / although / difficult / but / it / valuable',
  '这本书虽然很难 / 但它很有价值': 'This book is difficult / but it is valuable',
  '这 / 本 / 书 / 虽 / 然 / 很 / 难': 'This / book / al / though / very / hard',
  '这组切法保留了转折词和代词，后面更容易分析关系。':
    'This split preserves the contrast word and pronoun, making later relationship analysis easier.',
  '太粗了。“虽然、但、它”这些关键线索被包在一起了。':
    'Too coarse. Key clues like "although", "but", and "it" are bundled together.',
  '太碎了。真实 Token 可能会很细，但学习时要先看见有意义的片段。':
    'Too fragmented. Real Tokens can be fine-grained, but learning starts with meaningful chunks.',
  '先选一种切法。目标不是语文考试，而是让模型拿到可处理的小片段。':
    'Choose a split first. The goal is not a grammar exam; it is giving the model processable pieces.',
  '小猫看见小狗': 'The kitten saw the puppy',
  '小狗看见小猫': 'The puppy saw the kitten',
  '主角是小猫，动作对象是小狗。': 'The kitten is the actor, and the puppy is the object.',
  '词没变，但主角和对象换了。语序会改变理解。':
    'The words did not change, but the actor and object swapped. Word order changes meaning.',
  '点击一句话，看看同样的词换顺序后意思怎么变。':
    'Click a sentence to see how the same words change meaning when their order changes.',
  '我现在想知道什么？': 'What do I want to know now?',
  '我能提供什么线索标签？': 'What clue label can I provide?',
  '真正取回的参考内容是什么？': 'What reference content is actually retrieved?',
  '点击下方揭晓': 'Click below to reveal',
  '收起答案': 'Hide Answer',
  '揭晓配对': 'Reveal Matches',
  '猜对了': 'Correct',
  '先猜，再看 Attention 为什么要回看上下文。': 'Guess first, then see why Attention needs to look back at context.',
  '换一个谜题': 'Another Riddle',
  '语法关系': 'Grammar',
  '指代关系': 'Reference',
  '语气色彩': 'Tone',
  '逻辑连接': 'Logic',
  '虽然句子很长，但译员仍要判断它的结构、指代、语气和逻辑。':
    'Even when a sentence is long, a translator still checks structure, reference, tone, and logic.',
  '四个观察角度都开了：这就是“多头不是重复看，而是分工看”。':
    'All four viewing angles are active: multi-head is divided attention, not repeated attention.',
  '试着把四个观察角度都点亮。': 'Try lighting up all four viewing angles.',
  '原文：这本书虽然很难，但它很有价值。': 'Source: This book is difficult, but it is valuable.',
  '这本书很难，但是它有价值。': 'This book is difficult, but it is valuable.',
  '这本书很难，所以小猫很有价值。': 'This book is difficult, so the kitten is valuable.',
  '它会融化，所以放进冰箱。': 'It will melt, so put it in the fridge.',
  '输出保留了转折和指代，适合作为结果。': 'The output preserves contrast and reference, so it works as a result.',
  '这句丢失或混乱了前面的理解线索。': 'This sentence loses or scrambles earlier understanding clues.',
  'TransBot：这次不是只连对线，而是修好了一段语言理解流程。':
    'TransBot: This time you did more than connect lines; you repaired a language-understanding flow.',
  'TransBot：这一步很像译员先打草稿，不急着润色，先让理解路线走通。':
    'TransBot: This step is like drafting first. Do not polish yet; make the understanding route work.',
  'TransBot：先玩一个小任务，再去连线，会更容易知道自己为什么要接这个模块。':
    'TransBot: Try a mini task before connecting lines; it helps you know why this module belongs there.',
  'TransBot：你可能跳过了语义卡片。先想清楚“文字变成什么表示”。':
    'TransBot: You may have skipped the semantic card. First ask what representation the text becomes.',
  'TransBot：我帮你缩小范围：看看黄色高亮的下一步，那里通常是缺失模块。':
    'TransBot: I narrowed it down. Check the yellow highlighted next step; it is usually the missing module.',
  'TransBot：线索已升级。可以点“先看答案演示”，看完系统会收起答案，再轮到你。':
    'TransBot: Clues upgraded. Tap "Show Answer Demo"; after it hides the answer, it is your turn.',
  '切句子挑战': 'Sentence Splitting Challenge',
  '先把原文拆成几个能继续处理的小片段。': 'First split the source into small pieces that can keep being processed.',
  'Q/K/V 配对': 'Q/K/V Matching',
  '把“问题、标签、内容”分清楚。': 'Separate question, label, and content.',
  'Attention 指代谜题': 'Attention Reference Riddle',
  '先猜代词指向，再看回看过程。': 'Guess the pronoun reference first, then watch the look-back process.',
  '多视角审句': 'Multi-angle Sentence Review',
  '从语法、指代、语气和逻辑四个角度给句子贴标签。':
    'Tag the sentence from four angles: grammar, reference, tone, and logic.',
  '输出选择题': 'Output Choice',
  '在几种输出里选最符合上下文的一句。': 'Choose the output that best matches the context.',
  '语序翻转实验': 'Word Order Flip Experiment',
  '比较词一样但顺序不同的时候，意思怎么变。': 'Compare how meaning changes when the same words appear in a different order.',
  '委托 01：抢救原文入口': 'Mission 01: Rescue the Source Input',
  'TransBot 收到一封急件，但它还不会把句子拆开读。':
    'TransBot received an urgent request, but it still cannot split a sentence before reading it.',
  '解锁“原文入口”线路。': 'Unlock the Source Input circuit.',
  '委托 02：找回上下文检索器': 'Mission 02: Restore Context Retrieval',
  '它开始读句子了，但还不知道该问什么、去哪找线索。':
    'It has started reading sentences, but does not yet know what to ask or where to find clues.',
  '解锁 Q/K/V 检索工具。': 'Unlock the Q/K/V retrieval tools.',
  '委托 03：破解指代谜题': 'Mission 03: Crack the Reference Riddle',
  '它总把“它、他、这”看成孤立词，需要学会回看上下文。':
    'It keeps treating "it", "he", and "this" as isolated words, so it must learn to look back at context.',
  '解锁上下文聚光灯。': 'Unlock the context spotlight.',
  '委托 04：多人审句会议': 'Mission 04: Multi-person Sentence Review',
  '单一角度不够了，TransBot 需要同时检查语法、指代、语气和逻辑。':
    'One angle is not enough. TransBot needs to check grammar, reference, tone, and logic together.',
  '解锁多头审句团。': 'Unlock the multi-head review team.',
  '委托 05：交付译文草案': 'Mission 05: Deliver the Translation Draft',
  '最后把输入、上下文、加工和输出接成一条完整任务线。':
    'Finally connect input, context, processing, and output into one complete task line.',
  '完成 TransBot 的翻译任务报告。': 'Complete TransBot\'s translation task report.',
  '妈妈把蛋糕放进冰箱，因为它会融化。': 'Mom put the cake in the fridge because it would melt.',
  '“它”指谁？': 'What does "it" refer to?',
  '蛋糕': 'cake',
  '冰箱': 'fridge',
  '妈妈': 'mom',
  '会融化的是食物，不是冰箱。': 'Food melts, not the fridge.',
  'Attention 会让“它”回看前面的候选词，再把“蛋糕”这条线索权重调高。':
    'Attention lets "it" look back at earlier candidates, then raises the weight of the "cake" clue.',
  '小猫看见小狗，因为它很害怕。': 'The kitten saw the puppy because it was scared.',
  '“它”更可能指谁？': 'What does "it" most likely refer to?',
  '小猫': 'kitten',
  '小狗': 'puppy',
  '看见': 'saw',
  '这句话里“害怕”的主体更像看到对方的小猫。':
    'In this sentence, the one who is scared is more likely the kitten that saw the other animal.',
  'Attention 不是只看最近的词，而是比较上下文里哪条线索最能解释当前词。':
    'Attention does not only look at the nearest word; it compares which context clue best explains the current word.',
  '译员查了术语表，因为它能解释专业词。':
    'The translator checked the glossary because it can explain technical terms.',
  '译员': 'translator',
  '术语表': 'glossary',
  '专业词': 'technical terms',
  '能解释专业词的是工具，而不是查工具的人。':
    'The tool explains technical terms, not the person using the tool.',
  'Attention 会把“解释专业词”和“术语表”连得更强。':
    'Attention links "explain technical terms" more strongly with "glossary".',

  '练习原文入口的三个动作。': 'Practice the three source-input actions.',
  '练习 Query、Key、Value 的顺序。': 'Practice the order of Query, Key, and Value.',
  '练习词语如何回看上下文。': 'Practice how words look back at context.',
  '练习一个 Transformer Block 的主要组成。': 'Practice the main parts of a Transformer Block.',
  '从输入到输出，完整搭建基本流程。': 'Build the basic flow from input to output.',
  '练习原文入口': 'Practice Source Input',
  '练习注意力三件套': 'Practice the Attention Trio',
  '练习上下文聚光灯': 'Practice the Context Spotlight',
  '练习核心加工模块': 'Practice the Core Processing Module',
  '练习完整理解路线': 'Practice the Full Understanding Route',
  'TransBot 又把整句原文看成一团，需要重练入口顺序。':
    'TransBot is treating the whole source sentence as one block again and needs to rehearse the input order.',
  '入口练习完成！这条线路更稳了。': 'Input practice complete. This circuit is steadier now.',
  '文本要先切成 Token，再变成语义表示，并加入位置信息。':
    'Text must be split into Tokens, converted into semantic representation, and given position information.',
  '像译员先拆句、理解词块，再记住它们在原句里的位置。':
    'Like a translator splitting a sentence, understanding chunks, then remembering their positions in the source.',
  '入口流程是：先切 Token，再建立语义表示，最后补上位置线索。':
    'The input flow is: split Tokens, build semantic representation, then add position clues.',
  'TransBot 面对上下文时还会慌，不知道先问还是先取。':
    'TransBot still panics around context and does not know whether to ask first or retrieve first.',
  '三件套练习完成！上下文检索动作更顺了。':
    'Trio practice complete. Context retrieval is smoother now.',
  'Query 负责提问，Key 负责被匹配，Value 负责提供信息。':
    'Query asks, Key is matched, and Value provides information.',
  '像译员先提出问题，再找原文线索，最后取回参考内容。':
    'Like a translator asking a question, finding source clues, then retrieving reference content.',
  '注意力需要问题、线索和内容一起工作。':
    'Attention needs questions, clues, and content to work together.',
  'Query 像问题，Key 像线索标签，Value 像真正拿来参考的上下文内容。':
    'Query is the question, Key is the clue label, and Value is the context content actually used.',
  'TransBot 容易看丢代词和修饰关系，需要重练回看整句。':
    'TransBot often misses pronouns and modifiers and needs to practice looking back across the whole sentence.',
  '聚光灯练习完成！TransBot 更会判断重点关系。':
    'Spotlight practice complete. TransBot is better at judging important relationships.',
  'Self-Attention 会综合 Q/K/V，让每个词参考相关上下文。':
    'Self-Attention combines Q/K/V so each word can reference relevant context.',
  'Self-Attention 会让每个词回看整句话，判断哪些上下文更重要。':
    'Self-Attention lets each word look back across the sentence and judge which context matters most.',
  'TransBot 找到了重点，还需要学会稳定保留原意并继续加工。':
    'TransBot has found the focus, but still needs to preserve original meaning and keep processing steadily.',
  '核心模块练习完成！理解加工更像一轮可靠审校。':
    'Core module practice complete. Understanding now feels more like a reliable review pass.',
  'Multi-Head Attention、Add & Norm、Feed Forward 共同组成一轮核心加工。':
    'Multi-Head Attention, Add & Norm, and Feed Forward form one core processing round.',
  '像译员先多角度审句，再检查原意是否保留，最后润色理解结果。':
    'Like a translator reviewing from multiple angles, checking that the original meaning is preserved, then polishing understanding.',
  '核心模块会多角度观察上下文，稳定保留原信息，再继续加工理解结果。':
    'The core module observes context from multiple angles, preserves original information, then further processes understanding.',
  'TransBot 想完整读懂一句话，需要你重新走一遍线路。':
    'TransBot wants to fully understand a sentence and needs you to walk through the circuit again.',
  '完整路线练习完成！输入到输出流程重新连通。':
    'Full route practice complete. The input-to-output flow is reconnected.',
  '完整流程会把原文切片、表示、定位、关注、加工，最后变成输出预测。':
    'The full flow slices, represents, positions, attends, processes, and finally turns the source into an output prediction.',
  '像译员从读原文、查上下文、审句，到组织译文表达的全过程。':
    'Like the whole translator workflow: read the source, check context, review the sentence, and shape the translation.',

  '语言': 'Language',
  '中文': 'Chinese',
  '英文': 'English',
};

const orderedEntries = Object.entries(zhToEn).sort((first, second) => second[0].length - first[0].length);

function preserveOuterSpace(source: string, translatedCore: string) {
  const leading = source.match(/^\s*/)?.[0] ?? '';
  const trailing = source.match(/\s*$/)?.[0] ?? '';

  return `${leading}${translatedCore}${trailing}`;
}

function polishEnglish(text: string) {
  return text
    .replace(/(\d+)分(\d+)秒/g, '$1m $2s')
    .replace(/(\d+)秒/g, '$1s')
    .replace(/(\d+)\s*次/g, '$1 times')
    .replace(/（/g, ' (')
    .replace(/）/g, ')')
    .replace(/：/g, ': ')
    .replace(/；/g, '; ')
    .replace(/，/g, ', ')
    .replace(/。/g, '.')
    .replace(/！/g, '!')
    .replace(/？/g, '?')
    .replace(/、/g, ', ')
    .replace(/「/g, '"')
    .replace(/」/g, '"')
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/\s{2,}/g, ' ');
}

export function translateToEnglish(source: string) {
  const core = source.trim();

  if (!core) {
    return source;
  }

  const exact = zhToEn[core];

  if (exact) {
    return preserveOuterSpace(source, exact);
  }

  let translated = core;

  for (const [zh, en] of orderedEntries) {
    translated = translated.split(zh).join(en);
  }

  return preserveOuterSpace(source, polishEnglish(translated));
}
