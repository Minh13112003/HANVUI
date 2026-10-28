// Đề HSK 1 (HSK 2.0) theo định dạng đề thật: 40 câu, 40 phút, nghe 20 + đọc 20, mỗi phần 100 điểm, đạt 120/200.
// Soạn 28/10/2026, CHƯA QUA DUYỆT: người biết tiếng Trung cần kiểm lại trước khi công khai.
import { type Exam, type Part, choice, m, match, one, picChoice, picJudge, w } from './kit.js';

const G = {
  l1: 'Nghe một cụm từ, xem hình. Hình đúng với điều nghe được thì chọn ✓, không đúng thì chọn ✗.',
  l2: 'Nghe một câu, chọn hình đúng với câu đó.',
  l3: 'Nghe 5 đoạn hội thoại, chọn hình A–F hợp với từng đoạn. Có một hình thừa.',
  l4: 'Nghe một câu, cuối đoạn có câu hỏi đọc thành tiếng ("问：…"). Chọn câu trả lời đúng.',
  r1: 'Xem hình và từ bên dưới. Từ đúng với hình thì chọn ✓, không đúng thì chọn ✗.',
  r2: 'Đọc câu, chọn hình A–F hợp với câu. Có một hình thừa.',
  r3: 'Mỗi câu hỏi có một câu trả lời trong A–F. Có một câu thừa.',
  r4: 'Chọn từ A–F để điền vào chỗ trống. Có một từ thừa.',
};

const exam = (idx: number, l: Part[], r: Part[]): Exam => ({
  level: 1, idx, title: `Đề HSK 1 – số ${idx}`, durationMin: 40, maxScore: 200, passScore: 120,
  sections: [
    { name: 'Nghe 听力', kind: 'listening', max: 100, parts: l },
    { name: 'Đọc 阅读', kind: 'reading', max: 100, parts: r },
  ],
});

export const HSK1: Exam[] = [
  exam(
    1,
    [
      { title: '第一部分', guide: G.l1, questions: [
        picJudge(one('打电话'), '📞', true),
        picJudge(one('很冷'), '☀️', false),
        picJudge(one('三个苹果'), '🍎🍎🍎', true),
        picJudge(one('睡觉'), '🍜', false),
        picJudge(one('坐出租车'), '🚕', true),
      ] },
      { title: '第二部分', guide: G.l2, questions: [
        picChoice(one('我们在饭店吃饭。'), ['🏫', '🍽️', '🏥'], 1),
        picChoice(one('她是医生。'), ['👩‍⚕️', '👩‍🏫', '👩‍🍳'], 0),
        picChoice(one('今天下雨了。'), ['☀️', '🌧️', '❄️'], 1),
        picChoice(one('我坐飞机去北京。'), ['🚕', '🚆', '✈️'], 2),
        picChoice(one('儿子在看电视。'), ['📺', '💻', '📖'], 0),
      ] },
      { title: '第三部分', guide: G.l3, bank: ['🛍️', '🏥', '📞', '🍎', '💻', '🐶'], pics: true, questions: [
        match(w('喂，你在哪儿呢？', '我在学校，下午回家。'), 2),
        match(m('你怎么了？', '我不太好，想去医院看看。'), 1),
        match(w('你喜欢吃什么水果？', '我喜欢吃苹果。'), 3),
        match(m('这是你的狗吗？', '是的，它叫小白。'), 5),
        match(w('你在做什么？', '我在电脑上看电影。'), 4),
      ] },
      { title: '第四部分', guide: G.l4, questions: [
        choice(one('我叫李月，是北京人，今年二十岁。'), '她今年多大了？', ['十岁', '二十岁', '二十二岁'], 1),
        choice(m('下午我去商店，我想买一些水果。'), '他下午去哪儿？', ['医院', '学校', '商店'], 2),
        choice(one('我们明天上午九点在学校前面见。'), '他们明天几点见？', ['八点', '九点', '十点'], 1),
        choice(m('我妈妈是老师，她在北京的一个学校工作。'), '他妈妈做什么工作？', ['医生', '老师', '学生'], 1),
        choice(one('昨天很冷，今天天气很好，不太冷。'), '今天天气怎么样？', ['很冷', '很热', '很好'], 2),
      ] },
    ],
    [
      { title: '第一部分', guide: G.r1, questions: [
        picJudge(null, '🚕', true, '出租车'),
        picJudge(null, '🐱', false, '狗'),
        picJudge(null, '👕', true, '衣服'),
        picJudge(null, '💻', false, '电视'),
        picJudge(null, '✈️', true, '飞机'),
      ] },
      { title: '第二部分', guide: G.r2, bank: ['🍵', '🛌', '📖', '🍚', '🏫', '🎂'], pics: true, questions: [
        match('十一点了，我要去睡觉了。', 1),
        match('这本书很好看，我很喜欢。', 2),
        match('中午我想吃米饭。', 3),
        match('我女儿是这个学校的学生。', 4),
        match('先生，你想喝茶吗？', 0),
      ] },
      { title: '第三部分', guide: G.r3, bank: ['在商店里。', '二十块。', '去北京。', '是我的同学。', '很好，谢谢！', '下午三点。'], questions: [
        match('你明天去哪儿？', 2),
        match('那个人是谁？', 3),
        match('这个杯子多少钱？', 1),
        match('你什么时候回家？', 5),
        match('你妈妈在哪儿？', 0),
      ] },
      { title: '第四部分', guide: G.r4, bank: ['钱', '冷', '名字', '坐', '呢', '岁'], questions: [
        match('你叫什么（　）？', 2),
        match('我们（　）出租车去饭店。', 3),
        match('我的书（　）？你看见了吗？', 4),
        match('她女儿今年三（　）了。', 5),
        match('这些水果多少（　）？', 0),
      ] },
    ],
  ),

  exam(
    2,
    [
      { title: '第一部分', guide: G.l1, questions: [
        picJudge(one('看电影'), '🎬', true),
        picJudge(one('下雨'), '☀️', false),
        picJudge(one('五本书'), '📚', true),
        picJudge(one('吃苹果'), '🍌', false),
        picJudge(one('写字'), '✍️', true),
      ] },
      { title: '第二部分', guide: G.l2, questions: [
        picChoice(one('我在医院工作。'), ['🏫', '🏥', '🏪'], 1),
        picChoice(one('桌子上有一个杯子。'), ['📖', '🥛', '💻'], 1),
        picChoice(one('他们在打电话。'), ['⚽', '🍜', '📞'], 2),
        picChoice(one('今天很热。'), ['❄️', '🌧️', '☀️'], 2),
        picChoice(one('我爸爸喜欢坐出租车。'), ['✈️', '🚕', '🚲'], 1),
      ] },
      { title: '第三部分', guide: G.l3, bank: ['🍜', '👗', '🐱', '🏫', '🚕', '📺'], pics: true, questions: [
        match(w('你看我的衣服，漂亮吗？', '很漂亮！'), 1),
        match(m('小猫在哪儿？', '在椅子下面。'), 2),
        match(w('中午你想吃什么？', '我想吃中国菜。'), 0),
        match(m('你们学校大吗？', '很大，有很多学生。'), 3),
        match(w('喂，你在哪儿？', '我在出租车上，现在回家。'), 4),
      ] },
      { title: '第四部分', guide: G.l4, questions: [
        choice(one('我叫王方，我在中国学习汉语。'), '王方在中国做什么？', ['工作', '学习汉语', '看朋友'], 1),
        choice(m('我家有三个人：爸爸、妈妈和我。'), '他家有几个人？', ['两个', '三个', '四个'], 1),
        choice(one('今天星期六，我们不去学校。'), '今天星期几？', ['星期六', '星期五', '星期天'], 0),
        choice(m('这个杯子九块钱，那个杯子六块钱。'), '那个杯子多少钱？', ['六块', '九块', '十五块'], 0),
        choice(one('明天上午我去看医生，下午去工作。'), '她明天下午做什么？', ['看医生', '工作', '学习'], 1),
      ] },
    ],
    [
      { title: '第一部分', guide: G.r1, questions: [
        picJudge(null, '📺', true, '电视'),
        picJudge(null, '🍚', true, '米饭'),
        picJudge(null, '🐶', false, '猫'),
        picJudge(null, '👩‍🏫', true, '老师'),
        picJudge(null, '☀️', false, '下雨'),
      ] },
      { title: '第二部分', guide: G.r2, bank: ['📞', '🍎', '✈️', '🪑', '💻', '👨‍👩‍👧'], pics: true, questions: [
        match('我想买一些苹果。', 1),
        match('喂，你是王先生吗？', 0),
        match('这些椅子都很小。', 3),
        match('儿子在电脑上看电影。', 4),
        match('下午三点的飞机，我们去北京。', 2),
      ] },
      { title: '第三部分', guide: G.r3, bank: ['我不认识他。', '没关系。', '三个。', '我很喜欢。', '在家里。', '星期一。'], questions: [
        match('对不起！', 1),
        match('你有几个中国朋友？', 2),
        match('你认识那个人吗？', 0),
        match('你昨天在哪儿？', 4),
        match('你喜欢这个电影吗？', 3),
      ] },
      { title: '第四部分', guide: G.r4, bank: ['会', '前面', '个', '怎么', '热', '吗'], questions: [
        match('你（　）说汉语吗？', 0),
        match('今天天气很（　）。', 4),
        match('商店在学校（　）。', 1),
        match('你（　）去医院？坐出租车吗？', 3),
        match('你是中国人（　）？', 5),
      ] },
    ],
  ),

  exam(
    3,
    [
      { title: '第一部分', guide: G.l1, questions: [
        picJudge(one('睡觉'), '🛌', true),
        picJudge(one('喝茶'), '🍵', true),
        picJudge(one('看医生'), '🏫', false),
        picJudge(one('下雨了'), '🌧️', true),
        picJudge(one('飞机'), '🚕', false),
      ] },
      { title: '第二部分', guide: G.l2, questions: [
        picChoice(one('我们在商店买东西。'), ['🛒', '🏥', '🍽️'], 0),
        picChoice(one('我喜欢小狗。'), ['🐱', '🐶', '🐟'], 1),
        picChoice(one('妈妈在做饭。'), ['🛌', '📺', '🍳'], 2),
        picChoice(one('明天会很冷。'), ['🥶', '☀️', '🌧️'], 0),
        picChoice(one('他在打电话。'), ['💻', '📞', '📺'], 1),
      ] },
      { title: '第三部分', guide: G.l3, bank: ['🍉', '📚', '👫', '🛌', '🍵', '🚕'], pics: true, questions: [
        match(m('你看什么书呢？', '汉语书，很好看。'), 1),
        match(w('这是你的同学吗？', '是，她叫李小月。'), 2),
        match(m('太热了，我想吃水果。', '我去买。'), 0),
        match(w('现在十二点了，你不睡觉吗？', '我现在就睡。'), 3),
        match(m('我们怎么去？', '坐出租车去。'), 5),
      ] },
      { title: '第四部分', guide: G.l4, questions: [
        choice(one('我住在北京，我的家在学校后面。'), '她家在哪儿？', ['学校前面', '学校后面', '商店里'], 1),
        choice(m('我昨天去看了一个电影，很好看。'), '他昨天做什么了？', ['看电影', '买衣服', '去医院'], 0),
        choice(one('我儿子七岁了，他会写很多汉字。'), '她儿子多大了？', ['六岁', '七岁', '八岁'], 1),
        choice(m('现在是下午四点，我五点去工作。'), '他几点去工作？', ['五点', '四点', '十点'], 0),
        choice(one('王小姐是我的汉语老师，她是北京人。'), '王小姐是哪儿人？', ['上海人', '北京人', '南京人'], 1),
      ] },
    ],
    [
      { title: '第一部分', guide: G.r1, questions: [
        picJudge(null, '🏥', true, '医院'),
        picJudge(null, '🍵', true, '茶'),
        picJudge(null, '🪑', false, '桌子'),
        picJudge(null, '📖', true, '书'),
        picJudge(null, '✈️', false, '出租车'),
      ] },
      { title: '第二部分', guide: G.r2, bank: ['🏪', '🍽️', '🌧️', '👕', '🐶', '📺'], pics: true, questions: [
        match('今天下雨，我们不去学校了。', 2),
        match('这些衣服都很漂亮。', 3),
        match('我家的小狗很喜欢吃米饭。', 4),
        match('我们中午在饭店吃饭。', 1),
        match('你看，那个商店很大。', 0),
      ] },
      { title: '第三部分', guide: G.r3, bank: ['认识你，我很高兴。', '不客气。', '坐飞机。', '七点。', '很好看。', '他在睡觉。'], questions: [
        match('谢谢你！', 1),
        match('你儿子呢？', 5),
        match('你怎么去北京？', 2),
        match('那个电影怎么样？', 4),
        match('你明天几点去学校？', 3),
      ] },
      { title: '第四部分', guide: G.r4, bank: ['些', '和', '多少', '住', '都', '去'], questions: [
        match('我（　）在北京。', 3),
        match('我们（　）是学生。', 4),
        match('我想买（　）水果。', 0),
        match('你们学校有（　）学生？', 2),
        match('我（　）妈妈去商店。', 1),
      ] },
    ],
  ),
];
