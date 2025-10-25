Hooks.on('babele.init', (babele) => {
  babele.register({
    module: 'coc-babele-ja',
    lang: 'ja',
    dir: 'compendium'
  });

  const creatureTypes = {
    "Mythos Monster": "クトゥルフ神話の怪物",
    "Mythos Deity": "クトゥルフ神話の神格",
    "Traditional Horror": "伝統的な怪物",
    "Beast": "動物"
  }

  const sources = {
    "Keeper Rulebook V7": "新版ルールブック",
    "The Grand Grimoire of Cthulhu Mythos Magic": "グランド・グリモア"
  }

  const languages = {
    "English": "英語",
    "Chinese": "中国語"
  }

  const authors = {
    "Unknown": "不明"
  }

  const translateTimeToJapanese = (englishTime) => {
    const timeUnits = {
      'round': 'ラウンド',
      'rounds': 'ラウンド',
      'day': '日',
      'days': '日',
      'week': '週間',
      'weeks': '週間',
      'hour': '時間',
      'hours': '時間',
      'minute': '分',
      'minutes': '分',
      'second': '秒',
      'seconds': '秒'
    };

    const numberWords = {
      'several': '数',
    };

    // 特殊表現のマッピング
    const specialExpressions = {
      "5 minutes per magic point": "費やしたマジック・ポイントごとに5分",
      "1 minute plus 1 round per participant who donates magic points": "1分+マジック・ポイントを提供する参加者1人につき追加の1ラウンド",
      "1d6 + 4 rounds": "1D6+4ラウンド",
      "instantaneous": "瞬時"
    };

    // 特殊表現をチェック
    const lowerTime = englishTime.toLowerCase().trim();
    if (specialExpressions[lowerTime]) {
      return specialExpressions[lowerTime];
    }

    // パターンマッチング
    const patterns = [
      // 数字 + 単位 (例: "3 hours", "2 days")
      {
        regex: /^(\d+)\s*([a-zA-Z]+)$/,
        handler: (match, number, unit) => {
          const japaneseUnit = timeUnits[unit.toLowerCase()];
          return japaneseUnit ? `${number}${japaneseUnit}` : englishTime;
        }
      },

      // 数字 + "+" + 単位 (例: "3+ hours", "2+ days")
      {
        regex: /^(\d+)\+\s*([a-zA-Z]+)$/,
        handler: (match, number, unit) => {
          const japaneseUnit = timeUnits[unit.toLowerCase()];
          return japaneseUnit ? `${number}${japaneseUnit}以上` : englishTime;
        }
      },

      // 数詞 + 単位 (例: "several days")
      {
        regex: /^([a-zA-Z]+)\s+([a-zA-Z]+)$/,
        handler: (match, numberWord, unit) => {
          const japaneseNumber = numberWords[numberWord.toLowerCase()];
          const japaneseUnit = timeUnits[unit.toLowerCase()];
          return (japaneseNumber && japaneseUnit) ? `${japaneseNumber}${japaneseUnit}` : englishTime;
        }
      },

      // 範囲表現 (例: "1-3 days", "2-5 hours")
      {
        regex: /^(\d+)\s*-\s*(\d+)\s*([a-zA-Z]+)$/,
        handler: (match, start, end, unit) => {
          const japaneseUnit = timeUnits[unit.toLowerCase()];
          return japaneseUnit ? `${start}〜${end}${japaneseUnit}` : englishTime;
        }
      }
    ];

    // パターンマッチングを実行
    for (const pattern of patterns) {
      const match = englishTime.match(pattern.regex);
      if (match) {
        return pattern.handler(...match);
      }
    }

    // マッチしない場合は元の文字列を返す
    return englishTime;
  };

  babele.registerConverters({
    "creatureType": (creatureType) => {
      return creatureTypes[creatureType] ? creatureTypes[creatureType] : creatureType;
    },

    "source": (source) => {
      return sources[source] ? sources[source] : source;
    },

    "time": (time) => {
      return translateTimeToJapanese(time);
    },

    "language": (language) => {
      return languages[language] ? languages[language] : language;
    },

    "author": (author) => {
      return authors[author] ? authors[author] : author;
    },

    "cocidFlagLang": () => "ja"
  })
});
