"use strict";

// ------------------------------------ cyrillic to latin ------------------------------------ 

const lowerCaseVowels = {
  'а': 'a',
  'е': 'e',
  'и': 'y',
  'і': 'i',
  'о': 'o',
  'у': 'u',
  'є': 'je',
  'ї': 'ji',
  'ю': 'ju',
  'я': 'ja',
}

const upperCaseVowels = {
  'А': 'A',
  'Е': 'E',
  'И': 'Y',
  'І': 'I',
  'О': 'O',
  'У': 'U',
  'Є': 'Je',
  'Ї': 'Ji',
  'Ю': 'Ju',
  'Я': 'Ja'
}

const vowels = {
  ...lowerCaseVowels,
  ...upperCaseVowels
}

const lowerCaseConsonants = {
  'б': 'b',
  'в': 'v',
  'г': 'g',
  'ґ': 'ĝ',
  'д': 'd',
  'ж': 'ž',
  'з': 'z',
  'й': 'j',
  'к': 'k',
  'л': 'l',
  'м': 'm',
  'н': 'n',
  'п': 'p',
  'р': 'r',
  'с': 's',
  'т': 't',
  'ф': 'f',
  'х': 'h',
  'ц': 'c',
  'ч': 'č',
  'ш': 'š',
  'щ': 'šč',
}

const upperCaseConsonants = {
  'Б': 'B',
  'В': 'V',
  'Г': 'G',
  'Ґ': 'Ĝ',
  'Д': 'D',
  'Ж': 'Ž',
  'З': 'Z',
  'Й': 'J',
  'К': 'K',
  'Л': 'L',
  'М': 'M',
  'Н': 'N',
  'П': 'P',
  'Р': 'R',
  'С': 'S',
  'Т': 'T',
  'Ф': 'F',
  'Х': 'H',
  'Ц': 'C',
  'Ч': 'Č',
  'Ш': 'Š',
  'Щ': 'Šč'
}

const consonants = {
  ...lowerCaseConsonants,
  ...upperCaseConsonants
};

const lowerCase = {
  ...lowerCaseVowels,
  ...lowerCaseConsonants
}

const upperCase = {
  ...upperCaseVowels,
  ...upperCaseConsonants
};

const special = {
  'Ь': '\'',
  'ь': '\'',
  '@': '@',
  '"': '"'
};

const apostrophes = {
  '\'': '\'',
  'ʼ': '\'',
  '’': '\'',
  '`': '\'',
  '՚': '\'',
  '＇': '\'',
  '‘': '\'',
  'ʹ': '\'',
  'ꞌ': '\''
};

const russianAlert = {
  'ё': 'jo',
  'Ё': 'Jo',
  'э': 'e',
  'Э': 'E',
  'ы': 'y',
  'Ы': 'Y',
};

const singleLetters = {
  ...lowerCase,
  ...upperCase,
  ...special,
  ...apostrophes,
  ...russianAlert
}

const digraphs = {
  //ё
  'йо': 'jo',
  'ЙО': 'JO',
  'йО': 'jO',
  'Йо': 'Jo',
  'ьо': 'jo',
  'ЬО': 'JO',
  'ьО': 'jO',
  'Ьо': 'Jo'
};

const joDigraph = {
  'йо': 'jo',
  'ЙО': 'JO',
  'йО': 'jO',
  'Йо': 'Jo'
};

const translatesToDigraph = {
  'є': 'je',
  'ї': 'ji',
  'щ': 'šč',
  'ю': 'ju',
  'я': 'ja',
  'Є': 'Je',
  'Ї': 'Ji',
  'Щ': 'Šč',
  'Ю': 'Ju',
  'Я': 'Ja'
};

const translatesToUpperCaseDigraph = {
  'Є': 'JE',
  'Ї': 'JI',
  'Щ': 'ŠČ',
  'Ю': 'JU',
  'Я': 'JA',
  //russian for consistency of combined texts
  'Ё': 'JO',
};

const cyrToLatDict = {
  //by size
  singleLetters,
  digraphs,
  //by type
  lowerCase,
  upperCase,
  vowels,
  consonants,
  lowerCaseVowels,
  lowerCaseConsonants,
  upperCaseVowels,
  upperCaseConsonants,
  special,
  apostrophes,
  joDigraph,
  translatesToDigraph,
  translatesToUpperCaseDigraph,
  //detect russian letters
  russianAlert,
  //match all
  all: {
    singleLetters,
    digraphs
  }
}

// ------------------------------------ latin to cyrillic ------------------------------------

const dictionary = {
  cyrToLat: cyrToLatDict
}

const exceptions = {
  cyrToLat: {
    maxLength: 4,
    4: {
      '\"ьо\"': '\"\'o\"',
    }
  },
  latToCyr: {
  }
}

var dict = dictionary.cyrToLat;
var exception = exceptions.cyrToLat;

function cyrToLat(text) {
  var answer = '';

  //todo add case insensitive match
  function exactMatchSubstring(i, size, dict) {
    if (!dict) {
      return false;
    }
    return i + size - 1 < text.length && dict[text.substring(i, i + size)];
  }

  function matchSubstring(i, size, matcher) {
    if (!matcher) {
      return false;
    }
    return i + size - 1 < text.length && matcher.regex.test(text.substring(i, i + size));
  }

  function isTranslatesToUpperCaseDigraph(text, i) {
    var previousIsUpperCase = i - 1 >= 0 && dict.upperCase[text[i - 1]];
    var nextIsUpperCase = i + 1 < text.length && dict.upperCase[text[i + 1]];
    var isAcronym = previousIsUpperCase || nextIsUpperCase;
    return isAcronym && dict.translatesToUpperCaseDigraph[text[i]];
  }

  function shouldAddApostrophe(text, i) {

    var firstLetterInText = i == 0;
    var afterConsonant = i - 1 >= 0 && dict.consonants[text[i - 1]]

    // due to specifics of cyrrilic scrypt where йо/ьо is a digraph, 
    // that leaves no ambiguity about hardness/softness of the previous 
    // consonant, there are no exceptions to this rule
    return !firstLetterInText && afterConsonant;
  }

  var hasSingleQuotes = /([^\wа-яіїєґčšžĝ’'])'([\w\s\.\,\:\;\@\#\$\%\*\!\?\~\<\>\[\]\{\}\(\)\<\>\…\"\—а-яіїєґčšžĝ’'-]+?)'([^\wа-яіїєґčšžĝ’'])/gi;
  var hasTriangleQuotes = /([^\wа-яіїєґčšžĝ’'])«([\r\n\w\s\.\,\:\;\@\#\$\%\*\!\?\~\<\>\[\]\{\}\(\)\<\>\…\"\—а-яіїєґčšžĝ’'-]+?)»([^\wа-яіїєґčšžĝ’'])/gi;
  var hasWeirdQuotes = /([^\wа-яіїєґčšžĝ’'])“([\r\n\w\s\.\,\:\;\@\#\$\%\*\!\?\~\<\>\[\]\{\}\(\)\<\>\…\"\—а-яіїєґčšžĝ’'-]+?)”([^\wа-яіїєґčšžĝ’'])/gi;
  var skipWords = /@@([\w\.\:\;\@\#\$\%\*\!\?\~\<\>\[\]\{\}\(\)\", а-яіїєґčšžĝ’'—-]+?)@@/gi;

  // add trailing spaces to simplify regex, will be removed after
  text = ' ' + text;
  text += ' ';

  //preprocess single quotes so they don't clash with "ь"
  text = text.replace(hasSingleQuotes, '$1"$2"$3')
  //remove leftover nested single quotes
  text = text.replace(hasSingleQuotes, '$1"$2"$3')
  //preprocess triangle quotes
  text = text.replace(hasTriangleQuotes, '$1"$2"$3')
  //remove leftover nested triangle quotes
  text = text.replace(hasTriangleQuotes, '$1"$2"$3')
  //preprocess weird quotes
  text = text.replace(hasWeirdQuotes, '$1"$2"$3')
  //remove leftover nested weird quotes
  text = text.replace(hasWeirdQuotes, '$1"$2"$3')

  const skips = text.match(skipWords, '$1')
  text = text.replace(skipWords, '@@ @@');

  var nextSkip = 0;
  var i = 0;
  while (i < text.length) {

    if (dict.singleLetters[text[i]]) {

      //process skips
      while (matchSubstring(i, 5, { regex: skipWords })) {
        const restoreWord = skips[nextSkip].replace(skipWords, '$1');
        answer += text.substring(i, i + 5).replace(skipWords, restoreWord);
        nextSkip++;
        i += 5;
      }

      //process exceptions
      var j = exception.maxLength;
      while (j > 1) {
        while (exactMatchSubstring(i, j + 1, exception[j + 1])) {
          answer += exception[j + 1][text.substring(i, i + j + 1)];
          i += j + 1;
        }
        j--;
      }

      //process joDigraph apostrophes
      if (exactMatchSubstring(i, 2, dict.joDigraph) && shouldAddApostrophe(text, i)) {
        answer += '\'';
        answer += dict.joDigraph[text.substring(i, i + 2)];
        i += 2;
      }

      //process digraphs
      if (exactMatchSubstring(i, 2, dict.digraphs)) {
        answer += dict.digraphs[text.substring(i, i + 2)];
        i += 2;
      }

      //process uppercase reverse digraphs
      if (isTranslatesToUpperCaseDigraph(text, i)) {
        answer += dict.translatesToUpperCaseDigraph[text[i]];
        i++;
      }

      //process single letters
      if (exactMatchSubstring(i, 1, dict.singleLetters)) {
        answer += dict.singleLetters[text[i]];
        i++;
      }
    } else {
      //skip convertation for unmapped characters
      answer += text[i];
      i++;
    }
  }

  answer = answer.replace(/^ /, ''); //remove preprossesing space at the beginning
  answer = answer.replace(/ $/, ''); //remove preprossesing space at the end
  return answer;
}

var translateAll = function () {

  $('body')
    .find('*')
    .contents()
    .filter(function () {
      // text nodes without whitespace
      return this.nodeType === Node.TEXT_NODE && this.textContent.trim().length > 0;
    })
    .each(function (i, textNode) {
      textNode.textContent = cyrToLat(textNode.textContent);
    });
};

translateAll();


// var loadLatynkaTranslationMode = function (callback) {
//   chrome.runtime.sendMessage({
//     method: "getLocalStorage",
//     keys: ["latynkaTranslationMode"]
//   },
//     function (response) {
//       var latynkaTranslationMode = response.data.latynkaTranslationMode;
//       console.log('latynkaTranslationMode: ' + latynkaTranslationMode);
//       callback(latynkaTranslationMode);
//     });
// };

// loadLatynkaTranslationMode(function (newLatynkaTranslationMode) {
// var latynkaTranslationMode = newLatynkaTranslationMode;
// if (latynkaTranslationMode !== 'disabled') {
// translateAll();
  // }
// });


// document.addEventListener('visibilitychange', function () {
//   if (!document.hidden) {
//     // tab was just focused, get the latynka translation mode and see if it changed
//     loadLatynkaTranslationMode(function (newLatynkaTranslationMode) {
//       if (latynkaTranslationMode != newLatynkaTranslationMode) {
//         // it changed... reload the page
//         window.location.reload();
//       }
//     });
//   }
// });

