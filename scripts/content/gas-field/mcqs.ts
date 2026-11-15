// Practice MCQs for the Gas Field aptitude topics (PetroBangla Assistant Engineer, 16/12/2022).
// Keyed by topic slug. Explanations are short; the topic's note has the full working.

export type Mcq = { stem: string; options: string[]; correct: number; explanation: string };

export const MCQS: Record<string, Mcq[]> = {
  english: [
    {
      stem: "Choose the correct sentence:",
      options: ["Rahim is as tall as mine.", "Rahim is tall as mine.", "Rahim is as tall as I.", "Rahim is as tall as me."],
      correct: 2,
      explanation: "as … as-এর পরে উহ্য ক্রিয়া থাকে: as tall as I (am)। তাই কর্তা-রূপ I বসে।",
    },
    {
      stem: "There is ______ on the roads today.",
      options: ["Few traffics", "Very much traffic", "Too much traffic", "Too many traffic"],
      correct: 2,
      explanation: "traffic অগণনীয় বিশেষ্য। তাই এর সাথে much বসে, many/few বা বহুবচন traffics নয়।",
    },
  ],
  mathematics: [
    {
      stem: "A tank is 40% full. If 16 litres of water is added, it becomes 4/5 full. The capacity of the tank is:",
      options: ["32 litres", "35 litres", "40 litres", "42 litres"],
      correct: 2,
      explanation: "৪/৫ = ৮০%; ১৬ লিটার = ৮০% − ৪০% = ৪০%। তাই ধারণক্ষমতা = ১৬ ÷ ০.৪ = ৪০ লিটার।",
    },
    {
      stem: "In a class of 24 students, one half take higher math, one third take physics and one fourth take both. How many take neither?",
      options: ["14", "15", "10", "8"],
      correct: 2,
      explanation: "গণিত ১২, পদার্থ ৮, দুটোই ৬। অন্তত একটি = ১২ + ৮ − ৬ = ১৪; কোনোটিই নয় = ২৪ − ১৪ = ১০।",
    },
    {
      stem: "32^(x+y) = 16^(x+y). What is the value of x?",
      options: ["y", "−y", "2y", "x(2y + 2)"],
      correct: 1,
      explanation: "২^(৫(x+y)) = ২^(৪(x+y)) ⇒ ৫(x+y) = ৪(x+y) ⇒ x + y = ০ ⇒ x = −y।",
    },
    {
      stem: "A class has 4 boys and 4 girls. Two students are selected at random. What is the probability that both are girls?",
      options: ["1/2", "3/7", "3/4", "3/14"],
      correct: 3,
      explanation: "⁴C₂ / ⁸C₂ = ৬/২৮ = ৩/১৪ (অথবা ৪/৮ × ৩/৭)।",
    },
  ],
  bangla: [
    {
      stem: "কোন দুটি মূল স্বরধ্বনি নয়?",
      options: ["ঐ, ও", "আ, উ", "ই, ও", "ঐ, ঔ"],
      correct: 3,
      explanation: "মূল স্বরধ্বনি ৭টি: ই, এ, অ্যা, আ, অ, ও, উ। ঐ ও ঔ যৌগিক স্বর (দ্বিস্বর)।",
    },
    {
      stem: "সারারাত বৃষ্টি হয়েছে। ‘সারারাত’ কোন কারকে কোন বিভক্তি?",
      options: ["কর্তৃকারকে ষষ্ঠী", "কর্মকারকে পঞ্চমী", "অপাদান কারকে পঞ্চমী", "অধিকরণ কারকে শূন্য"],
      correct: 3,
      explanation: "সময় বোঝাচ্ছে, তাই কালাধিকরণ। কোনো বিভক্তিচিহ্ন যুক্ত হয়নি, তাই শূন্য বিভক্তি।",
    },
    {
      stem: "বাংলা সাহিত্যের প্রথম মহিলা ঔপন্যাসিক কে?",
      options: ["বেগম রোকেয়া", "সুফিয়া কামাল", "স্বর্ণকুমারী দেবী", "রিজিয়া রহমান"],
      correct: 2,
      explanation: "স্বর্ণকুমারী দেবী। প্রথম উপন্যাস ‘দীপনির্বাণ’ (১৮৭৬)।",
    },
    {
      stem: "সঠিক বানান চিহ্নিত করুন:",
      options: ["বীণাপানি", "চরিত্র", "মুহুর্ত", "প্রত্যুষ"],
      correct: 1,
      explanation: "শুদ্ধ: চরিত্র। বাকিগুলোর শুদ্ধ রূপ বীণাপাণি, মুহূর্ত, প্রত্যূষ। (মূল প্রশ্নে ‘গ’ ছিল ‘মৃৎ’, যা নিজেও শুদ্ধ; অনুশীলনের জন্য বদলানো হয়েছে।)",
    },
    {
      stem: "‘বহ্ন্যুৎসব’ শব্দের সঠিক সন্ধি-বিচ্ছেদ কোনটি?",
      options: ["বহ্ন্য + উৎসব", "বহ্ন্যুৎ + উৎসব", "বহ্নি + উৎসব", "বহ্নী + উৎসব"],
      correct: 2,
      explanation: "যণ্‌ সন্ধি: ই + উ → য-ফলা + উ। বহ্নি + উৎসব = বহ্ন্যুৎসব। (মূল প্রশ্নে ‘ঘ’ অপশনটি ‘গ’-এর পুনরাবৃত্তি ছিল।)",
    },
  ],
  "general-knowledge": [
    {
      stem: "What is the name of the Russian Foreign Minister?",
      options: ["Sergey Lavrov", "Ivar Igor", "Sergei Shoigu", "Dmytro Kuleba"],
      correct: 0,
      explanation: "সের্গেই লাভরভ ২০০৪ থেকে রাশিয়ার পররাষ্ট্রমন্ত্রী। শোইগু ছিলেন প্রতিরক্ষামন্ত্রী, কুলেবা ইউক্রেনের পররাষ্ট্রমন্ত্রী।",
    },
  ],
};
