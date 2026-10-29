/* Dialectica core content: traditions, branches, eras, the big questions and the learning notes.
   Schools and thinkers live in data/schools.js and data/thinkers.js, influence lines in data/links.js.
   Edit any of them, then run `node scripts/check-data.mjs`. Every piece of text is { en, zh }. */
window.DIALECTICA = window.DIALECTICA || {};
Object.assign(window.DIALECTICA, {
  /* Lanes, in the order they are drawn: neighbours are traditions that talked to each other most */
  traditions: [
    { id: "eastasia", code: "EA", color: "#d52b1e",
      name: { en: "China & East Asia", zh: "中国与东亚" },
      description: { en: "From the Hundred Schools of the Warring States to Neo-Confucianism, Chan and the Kyoto School: philosophy as a way of ordering self, family and state.", zh: "从战国诸子百家到宋明理学、禅宗与京都学派：哲学是安顿自身、家庭与国家的学问。" } },
    { id: "indian", code: "IN", color: "#e07b1a",
      name: { en: "India", zh: "印度" },
      description: { en: "Orthodox and heterodox schools arguing for two millennia about self, consciousness, valid knowledge and liberation.", zh: "正统与非正统诸派围绕自我、意识、有效认知与解脱，争论了两千年。" } },
    { id: "greek", code: "GR", color: "#1d4ed8",
      name: { en: "Greece & Rome", zh: "古希腊与罗马" },
      description: { en: "From the first natural philosophers to Neoplatonism: the invention of argument about nature, knowledge and the good life.", zh: "从最早的自然哲学家到新柏拉图主义：关于自然、知识与美好生活的论证由此诞生。" } },
    { id: "islamic", code: "IS", color: "#2f7d4a",
      name: { en: "The Islamic world", zh: "伊斯兰世界" },
      description: { en: "Theologians, philosophers and mystics who absorbed Greek thought in Arabic and Persian, and remade it.", zh: "神学家、哲学家与神秘主义者以阿拉伯语和波斯语吸收希腊思想，并加以重塑。" } },
    { id: "medieval", code: "ME", color: "#7a4e8c",
      name: { en: "Medieval Europe", zh: "中世纪欧洲" },
      description: { en: "Christian and Jewish thinkers reconciling faith with reason, Plato and then Aristotle with scripture.", zh: "基督教与犹太教思想家调和信仰与理性，先后把柏拉图和亚里士多德与经典相融合。" } },
    { id: "modern", code: "MO", color: "#f3c623",
      name: { en: "Early modern Europe", zh: "近代欧洲" },
      description: { en: "From humanism and the new science to Kant and Hegel: the self, knowledge and the state rebuilt from first principles.", zh: "从人文主义、新科学到康德与黑格尔：自我、知识与国家从第一原理出发被重新建构。" } },
    { id: "continental", code: "CO", color: "#9a3b5a",
      name: { en: "Continental", zh: "欧陆哲学" },
      description: { en: "After Hegel: history, existence, experience, power and interpretation, mostly in German and French.", zh: "黑格尔之后：历史、存在、经验、权力与诠释，主要以德语和法语写成。" } },
    { id: "analytic", code: "AN", color: "#1f8a8a",
      name: { en: "Analytic & pragmatist", zh: "分析哲学与实用主义" },
      description: { en: "Logic, language, science and mind, mostly in English: clarity first, then the old questions again.", zh: "逻辑、语言、科学与心灵，主要以英语写成：先求清晰，再回到古老的问题。" } }
  ],

  branches: [
    { id: "metaphysics", name: { en: "Metaphysics", zh: "形而上学" }, question: { en: "What is there?", zh: "世界由什么构成？" } },
    { id: "epistemology", name: { en: "Knowledge", zh: "认识论" }, question: { en: "How do we know?", zh: "我们如何知道？" } },
    { id: "ethics", name: { en: "Ethics", zh: "伦理学" }, question: { en: "How should we live?", zh: "应当如何生活？" } },
    { id: "politics", name: { en: "Politics", zh: "政治哲学" }, question: { en: "Who should rule, and why?", zh: "谁应当统治，凭什么？" } },
    { id: "logic", name: { en: "Logic & language", zh: "逻辑与语言" }, question: { en: "What makes an argument, or a word, work?", zh: "论证与言语凭什么成立？" } },
    { id: "mind", name: { en: "Mind & self", zh: "心灵与自我" }, question: { en: "What am I?", zh: "我是什么？" } },
    { id: "religion", name: { en: "God & the ultimate", zh: "神与终极" }, question: { en: "Is there a ground of everything?", zh: "万物有没有终极根据？" } }
  ],

  /* The time axis is piecewise: each era gets a share of the width, so dense centuries get room */
  eras: [
    { start: -1000, end: -600, share: 0.05, name: { en: "Vedic", zh: "吠陀" } },
    { start: -600, end: -200, share: 0.17, name: { en: "Axial Age", zh: "轴心时代" } },
    { start: -200, end: 500, share: 0.12, name: { en: "Hellenistic & Han", zh: "希腊化与汉" } },
    { start: 500, end: 1100, share: 0.10, name: { en: "Early medieval", zh: "中古早期" } },
    { start: 1100, end: 1600, share: 0.12, name: { en: "Scholastic & Song–Ming", zh: "经院与宋明" } },
    { start: 1600, end: 1800, share: 0.14, name: { en: "Early modern", zh: "近代早期" } },
    { start: 1800, end: 1900, share: 0.13, name: { en: "19th century", zh: "19世纪" } },
    { start: 1900, end: 2026, share: 0.17, name: { en: "20th century–now", zh: "20世纪至今" } }
  ],

  /* Same question, different answers. Each answer names a school and, where one voice is meant, a thinker */
  questions: [
    { id: "real", branch: "metaphysics",
      q: { en: "What is ultimately real?", zh: "什么才是真正实在的？" },
      lede: { en: "Behind the changing world of things, is there something that does not change, and what is it made of?", zh: "在变动不居的万物背后，是否有某种不变的东西？它又是什么？" },
      answers: [
        { school: "milesian", by: "thales", a: { en: "One underlying stuff that everything is made of: water, said Thales; later the boundless, or air.", zh: "万物出自同一种本原：泰勒斯说是水，后人说是“无定”或气。" } },
        { school: "eleatic", by: "parmenides", a: { en: "Only what is, is. Change and plurality are illusions; reason shows Being is one and unchanging.", zh: "存在者存在。变化与多样是幻象；理性表明存在是一且不变的。" } },
        { school: "upanishads", by: "yajnavalkya", a: { en: "Brahman, the one ground of all things, which is the same as one’s innermost self, ātman.", zh: "梵是万物唯一的根据，它与人最内在的自我“我”（阿特曼）同一。" } },
        { school: "atomism", by: "democritus", a: { en: "Atoms and the void. Colour, taste and warmth exist only “by convention”.", zh: "原子与虚空。颜色、味道与冷热只是“约定俗成”。" } },
        { school: "platonism", by: "plato", a: { en: "Eternal Forms, known by reason; the visible world is their changing copy.", zh: "由理性把握的永恒理念；可见世界只是它们变动的摹本。" } },
        { school: "buddhism", by: "buddha", a: { en: "No permanent substances at all: everything arises dependently and passes away.", zh: "根本没有恒常的实体：一切都依缘而起，也随缘而灭。" } },
        { school: "daoism", by: "laozi", a: { en: "The Dao: nameless, it gives rise to the ten thousand things and they return to it.", zh: "道：无名，生万物，万物又复归于它。" } },
        { school: "madhyamaka", by: "nagarjuna", a: { en: "Nothing has a nature of its own. Even emptiness is empty.", zh: "一切法都没有自性。连空本身也是空的。" } },
        { school: "neo-confucianism", by: "zhu-xi", a: { en: "Principle (li) gives each thing its pattern in vital stuff (qi); all principles are one.", zh: "理赋予每一物以形式，气构成其质料；理一而分殊。" } },
        { school: "rationalism", by: "spinoza", a: { en: "One infinite substance, God or Nature; minds and bodies are its modes.", zh: "唯一无限的实体，即神或自然；心灵与物体都是它的样式。" } },
        { school: "german-idealism", by: "hegel", a: { en: "Spirit, coming to know itself through nature and history.", zh: "精神，经由自然与历史逐步认识自身。" } }
      ] },
    { id: "know", branch: "epistemology",
      q: { en: "How can we know anything?", zh: "我们怎样才能知道？" },
      lede: { en: "The senses mislead and arguments can be turned around. What, if anything, can be trusted?", zh: "感官会骗人，论证也能被反驳。到底什么值得信赖？" },
      answers: [
        { school: "charvaka", a: { en: "Perception alone. Inference beyond what can be seen is guesswork.", zh: "只有感知可靠。超出可见之物的推理都是猜测。" } },
        { school: "platonism", by: "plato", a: { en: "By reason recollecting the Forms; the senses give only opinion.", zh: "靠理性回忆理念；感官只能给出意见。" } },
        { school: "skepticism", by: "sextus-empiricus", a: { en: "We can’t be sure. Suspend judgement, and tranquillity follows.", zh: "我们无法确定。悬置判断，宁静自然随之而来。" } },
        { school: "nyaya", by: "akshapada", a: { en: "Through four valid means: perception, inference, comparison and reliable testimony.", zh: "凭四种量：现量、比量、譬喻量与圣言量。" } },
        { school: "pramana", by: "dharmakirti", a: { en: "Only perception and inference are valid, and a cognition counts when it leads to successful action.", zh: "只有现量与比量两种有效认知，能引向成功行动的认知才算有效。" } },
        { school: "rationalism", by: "descartes", a: { en: "Doubt everything; what survives (“I think, therefore I am”) is the foundation.", zh: "怀疑一切；经得起怀疑的（“我思故我在”）便是基础。" } },
        { school: "empiricism", by: "hume", a: { en: "From experience only. Even causation is habit, not something we perceive.", zh: "只能来自经验。就连因果也只是习惯，而非我们知觉到的东西。" } },
        { school: "kantianism", by: "kant", a: { en: "Experience supplies the content, the mind the form: we know appearances, not things in themselves.", zh: "经验提供内容，心灵提供形式：我们认识的是现象，而非物自体。" } },
        { school: "xinxue", by: "wang-yangming", a: { en: "Innate knowing (liangzhi) is already in the mind; knowledge and action are one.", zh: "良知本在心中；知行合一。" } },
        { school: "pragmatism", by: "peirce", a: { en: "Inquiry is how we settle doubt; truth is what inquiry would agree on in the long run.", zh: "探究是平息怀疑的方式；真理是探究最终会达成的共识。" } },
        { school: "post-positivism", by: "popper", a: { en: "Never proved, only tested: good theories are bold guesses that survive refutation.", zh: "理论永远无法被证实，只能被检验：好的理论是经受住反驳的大胆猜想。" } }
      ] },
    { id: "live", branch: "ethics",
      q: { en: "How should one live?", zh: "人应当怎样生活？" },
      lede: { en: "Socrates called it the question that matters most. Every tradition has an answer, and most of them are practices, not just theories.", zh: "苏格拉底说这是最要紧的问题。每个传统都有自己的答案，而且大多是一种修习，而不只是理论。" },
      answers: [
        { school: "jainism", by: "mahavira", a: { en: "Harm no living being. Non-violence (ahiṃsā) in deed, word and thought frees the soul.", zh: "不伤害任何生命。身、语、意上的不害（阿希姆萨）使灵魂得到解脱。" } },
        { school: "buddhism", by: "buddha", a: { en: "Follow the Eightfold Path and end the craving that causes suffering.", zh: "修八正道，断除导致苦的渴爱。" } },
        { school: "confucianism", by: "confucius", a: { en: "Cultivate ren, humaneness, through ritual, learning and the duties of family and office.", zh: "通过礼、学以及家庭与职守中的本分，修养仁德。" } },
        { school: "mohism", by: "mozi", a: { en: "Care for everyone impartially, and judge every custom by whether it benefits the people.", zh: "兼爱天下之人，并以是否利民来衡量一切习俗。" } },
        { school: "daoism", by: "zhuangzi", a: { en: "Stop forcing things. Act without contrivance (wu wei) and let things follow their nature.", zh: "不要强为。无为而顺应万物之自然。" } },
        { school: "aristotelianism", by: "aristotle", a: { en: "Flourish (eudaimonia) by practising the virtues, each a mean found by practical wisdom.", zh: "通过践行德性而达致幸福，每一种德性都是由实践智慧找到的中道。" } },
        { school: "epicureanism", by: "epicurus", a: { en: "Seek quiet pleasure: freedom from pain and fear, simple needs and good friends.", zh: "追求宁静的快乐：身无痛苦、心无恐惧，所需简单，良友相伴。" } },
        { school: "stoicism", by: "epictetus", a: { en: "Virtue is the only good. Care only for what is up to you: your judgements and choices.", zh: "德性是唯一的善。只关心取决于你的东西：你的判断与选择。" } },
        { school: "kantianism", by: "kant", a: { en: "Act only on rules you could will everyone to follow, and never treat a person merely as a means.", zh: "只按你愿意让所有人都遵循的准则行事，永远不要仅仅把人当作手段。" } },
        { school: "utilitarianism", by: "mill", a: { en: "Do what produces the most happiness, counting everyone’s happiness equally.", zh: "做能带来最多幸福的事，每个人的幸福都同等计算。" } },
        { school: "existentialism", by: "sartre", a: { en: "Nothing decides for you. You make yourself by your choices, and must own them.", zh: "没有什么能替你决定。你通过选择造就自己，并且必须为之负责。" } }
      ] },
    { id: "rule", branch: "politics",
      q: { en: "What makes power legitimate?", zh: "权力凭什么正当？" },
      lede: { en: "Why should anyone obey? By virtue, by law, by consent, or because power is never as innocent as it claims?", zh: "人为什么要服从？凭德行、凭法令、凭同意，还是权力从来不像它自称的那样清白？" },
      answers: [
        { school: "confucianism", by: "mencius", a: { en: "Rule by virtue and example. A ruler who oppresses the people has lost Heaven’s mandate.", zh: "以德与身教治国。残害百姓的君主已失去天命。" } },
        { school: "mohism", by: "mozi", a: { en: "Promote the worthy whatever their birth, and unify standards for the common benefit.", zh: "尚贤而不论出身，统一标准以谋天下之利。" } },
        { school: "legalism", by: "han-feizi", a: { en: "Not virtue but clear laws, rewards and punishments, applied the same to all.", zh: "不靠德行，而靠明确的法令与赏罚，对所有人一体施行。" } },
        { school: "platonism", by: "plato", a: { en: "Those who know the Good should rule: philosopher-kings.", zh: "认识善的人应当统治：哲人王。" } },
        { school: "aristotelianism", by: "aristotle", a: { en: "Rule for the common good, not the rulers’ own; a mixed constitution is the most stable.", zh: "为公共利益而非统治者私利而治；混合政体最为稳定。" } },
        { school: "falsafa", by: "al-farabi", a: { en: "The virtuous city, led by one who is both philosopher and lawgiver.", zh: "德性之城，由集哲人与立法者于一身的人领导。" } },
        { school: "renaissance", by: "machiavelli", a: { en: "Judge rulers by what keeps the state alive, not by private virtue.", zh: "评判统治者要看什么能保全国家，而不是看私人德行。" } },
        { school: "social-contract", by: "locke", a: { en: "The consent of the governed, given to protect rights people had before any state.", zh: "被统治者的同意，用以保护人们在国家出现之前就享有的权利。" } },
        { school: "marxism", by: "marx", a: { en: "The state serves the ruling class; only a classless society ends domination.", zh: "国家服务于统治阶级；只有无阶级社会才能终结支配。" } },
        { school: "liberal-egalitarianism", by: "rawls", a: { en: "Principles we would choose behind a veil of ignorance about our own place in society.", zh: "我们在不知道自己社会位置的“无知之幕”后会选择的原则。" } },
        { school: "poststructuralism", by: "foucault", a: { en: "Power runs through schools, clinics and prisons. Ask how it works, not only who holds it.", zh: "权力贯穿学校、诊所与监狱。要问它如何运作，而不只是谁掌握它。" } }
      ] },
    { id: "self", branch: "mind",
      q: { en: "What is the self?", zh: "自我是什么？" },
      lede: { en: "Is there a someone behind thought and experience, or only the thinking and the experiencing?", zh: "思想与经验的背后，是否有一个“谁”，还是只有思想与经验本身？" },
      answers: [
        { school: "upanishads", by: "yajnavalkya", a: { en: "The ātman: the witness that cannot itself be seen, one with Brahman.", zh: "阿特曼：那不可被见的见者，与梵为一。" } },
        { school: "buddhism", by: "buddha", a: { en: "No self (anattā): a changing stream of five aggregates, with no owner behind them.", zh: "无我：五蕴不断流转，背后并无主宰。" } },
        { school: "samkhya-yoga", by: "ishvarakrishna", a: { en: "Pure consciousness (puruṣa), a mere witness, mistakenly identified with matter (prakṛti).", zh: "纯粹意识（神我）只是旁观者，却被误认作原质（自性）。" } },
        { school: "aristotelianism", by: "aristotle", a: { en: "The soul is the form of a living body, not a second thing inside it.", zh: "灵魂是活的身体的形式，而不是藏在身体里的另一个东西。" } },
        { school: "yogacara", by: "vasubandhu", a: { en: "Only consciousness: what we take for an outer world and a self are its projections.", zh: "唯识：我们以为的外部世界与自我，都是识的显现。" } },
        { school: "rationalism", by: "descartes", a: { en: "A thinking thing, wholly distinct from the extended body.", zh: "一个在思维的东西，与有广延的身体截然不同。" } },
        { school: "empiricism", by: "hume", a: { en: "Look inside and you find only perceptions: the self is a bundle of them.", zh: "向内看，你只会找到知觉：自我是一束知觉。" } },
        { school: "xinxue", by: "wang-yangming", a: { en: "The mind is principle: the moral order is found in the heart-mind, not outside it.", zh: "心即理：道德秩序就在心中，而不在心外。" } },
        { school: "phenomenology", by: "heidegger", a: { en: "Not a mind looking at a world, but being-in-the-world, always already involved.", zh: "不是一个心灵在看世界，而是“在世之在”，总已置身其中。" } },
        { school: "feminism", by: "beauvoir", a: { en: "“One is not born, but becomes, a woman”: the self is made in a situation.", zh: "“女人不是天生的，而是后天形成的”：自我在处境中被造就。" } },
        { school: "philosophy-of-mind", by: "chalmers", a: { en: "Functions explain behaviour, but why any of it is felt remains the “hard problem”.", zh: "功能能解释行为，但这一切为何会被感受到，仍是“困难问题”。" } }
      ] },
    { id: "word", branch: "logic",
      q: { en: "Can words grasp the truth?", zh: "言语能把握真理吗？" },
      lede: { en: "Every philosophy is made of language. Some trust it, some repair it, some warn that it always falls short.", zh: "一切哲学都由语言写成。有人信任它，有人修补它，也有人提醒它总是言不尽意。" },
      answers: [
        { school: "confucianism", by: "confucius", a: { en: "Rectify names: when words match roles and realities, order follows.", zh: "正名：名实相副，秩序随之而来。" } },
        { school: "daoism", by: "laozi", a: { en: "The Dao that can be told is not the constant Dao.", zh: "道可道，非常道。" } },
        { school: "aristotelianism", by: "aristotle", a: { en: "The forms of valid inference can be laid out: logic is the tool of every science.", zh: "有效推理的形式可以被系统地列出：逻辑是一切学问的工具。" } },
        { school: "school-of-names", by: "gongsun-long", a: { en: "“A white horse is not a horse”: how names pick out things is itself a puzzle.", zh: "“白马非马”：名称如何指称事物，本身就是难题。" } },
        { school: "mimamsa", by: "kumarila", a: { en: "The words of the Veda are eternal and authorless, so they are valid in themselves.", zh: "吠陀之言永恒且无作者，因此自身即有效。" } },
        { school: "chan-zen", a: { en: "“A separate transmission outside the scriptures, not founded on words”: words point, awakening is beyond them.", zh: "“教外别传，不立文字”：文字可以指引，觉悟却在文字之外。" } },
        { school: "early-analytic", by: "wittgenstein", a: { en: "Language pictures the world; whereof one cannot speak, thereof one must be silent.", zh: "语言描画世界；凡不可说的，必须保持沉默。" } },
        { school: "logical-positivism", by: "ayer", a: { en: "A sentence means something only if it can be verified, or is true by definition.", zh: "一个句子只有在可被证实或依定义为真时，才有意义。" } },
        { school: "ordinary-language", by: "wittgenstein", a: { en: "Meaning is use: words get their sense in the language-games we play with them.", zh: "意义即用法：词语在我们用它们进行的“语言游戏”中获得意义。" } },
        { school: "structuralism", by: "saussure", a: { en: "Signs mean by their differences from other signs, not by naming things.", zh: "符号的意义来自它与其他符号的差异，而不是来自对事物的命名。" } },
        { school: "hermeneutics", by: "gadamer", a: { en: "Understanding is a fusion of horizons between the reader and the text.", zh: "理解是读者与文本之间的视域融合。" } },
        { school: "poststructuralism", by: "derrida", a: { en: "Meaning is never fully present; it is always deferred along the chain of signs.", zh: "意义从未完全在场，总在符号链中被延异。" } }
      ] },
    { id: "god", branch: "religion",
      q: { en: "Is there a ground of everything?", zh: "万物有没有一个终极根据？" },
      lede: { en: "A first cause, a creator, an impersonal absolute, or nothing of the kind?", zh: "是第一因、造物主、非人格的绝对者，还是根本没有这种东西？" },
      answers: [
        { school: "charvaka", a: { en: "No god, no soul, no afterlife: only the body and this world.", zh: "没有神，没有灵魂，没有来世：只有身体与此世。" } },
        { school: "buddhism", by: "buddha", a: { en: "No creator. Speculating about first beginnings does not lead to liberation.", zh: "没有造物主。对最初起源的玄想并不导向解脱。" } },
        { school: "aristotelianism", by: "aristotle", a: { en: "An unmoved mover, thought thinking itself, on which the heavens depend.", zh: "不动的推动者：思想思想自身，诸天都依赖于它。" } },
        { school: "neoplatonism", by: "plotinus", a: { en: "The One, beyond being and thought, from which all things overflow.", zh: "太一，超越存在与思想，万物从它流溢而出。" } },
        { school: "advaita", by: "shankara", a: { en: "Brahman without qualities; a personal God belongs to the level of appearance.", zh: "无属性的梵；人格神属于现象的层面。" } },
        { school: "falsafa", by: "ibn-sina", a: { en: "A Necessary Existent, whose essence is to exist and on which every contingent thing depends.", zh: "必然存在者：其本质即存在，一切偶然之物都依赖于它。" } },
        { school: "kalam", by: "al-ghazali", a: { en: "The world began to exist, so it has a cause: a God who freely chose to create.", zh: "世界有开端，所以有原因：一位自由选择创造的神。" } },
        { school: "theistic-vedanta", by: "ramanuja", a: { en: "A personal God, Viṣṇu, whose real body is made of souls and the world.", zh: "一位人格神毗湿奴，灵魂与世界构成他真实的身体。" } },
        { school: "scholasticism", by: "aquinas", a: { en: "Five ways from motion, cause and order lead to a first cause, “and this everyone calls God”.", zh: "从运动、因果与秩序出发的“五路”通向第一因，“这就是人们所称的神”。" } },
        { school: "sufism", by: "ibn-arabi", a: { en: "There is only one Being; the world is its self-disclosure.", zh: "唯有一个存在；世界是它的自我显现。" } },
        { school: "empiricism", by: "hume", a: { en: "The design argument proves little: experience cannot reach a perfect creator.", zh: "设计论证明不了多少：经验无法触及一位完美的造物主。" } },
        { school: "existentialism", by: "kierkegaard", a: { en: "Not by proof but by a leap of faith, made in fear and trembling.", zh: "不靠证明，而靠在恐惧与战栗中做出的信仰之跃。" } },
        { school: "existentialism", by: "nietzsche", a: { en: "“God is dead”, and we must now create values without him.", zh: "“上帝死了”，我们如今必须在没有他的情况下创造价值。" } }
      ] }
  ],

  learning: [
    { t: { en: "Find the question first", zh: "先找到问题" }, d: { en: "Every school is an answer. Before reading what it claims, ask what it was worried about.", zh: "每个学派都是一个回答。读它主张什么之前，先问它在担忧什么。" } },
    { t: { en: "Read the opponent", zh: "读它的对手" }, d: { en: "Ideas are sharpened by critics. Follow the dashed lines: Kant makes sense once you have met Hume.", zh: "思想在批评中变得锋利。沿着虚线走：读过休谟，康德才讲得通。" } },
    { t: { en: "Keep the original words", zh: "保留原词" }, d: { en: "Logos, dharma, ren, li and Dasein do not translate cleanly. Learn the word, not only its gloss.", zh: "逻各斯、法、仁、理、此在都无法干净地翻译。要学的是这个词本身，而不只是它的释义。" } },
    { t: { en: "Compare, don’t rank", zh: "比较，而不排名" }, d: { en: "Traditions ask different questions for different reasons. Set answers side by side before judging them.", zh: "不同的传统出于不同的缘由提出不同的问题。先把答案并排放好，再作评判。" } },
    { t: { en: "Then read one short text", zh: "然后读一本短书" }, d: { en: "The Apology, the Analects, the Daodejing, the Enchiridion, the Meditations: each takes an evening.", zh: "《申辩篇》《论语》《道德经》《道德手册》《第一哲学沉思集》：每一本都只需一个晚上。" } }
  ]
});
