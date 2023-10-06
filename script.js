const katakana = [
    "ア","イ","ウ","エ","オ",
    "カ","キ","ク","ケ","コ",
    "ガ","ギ","グ","ゲ","ゴ",
    "サ","シ","ス","セ","ソ",
    "ザ","ジ","ズ","ゼ","ゾ",
    "タ","チ","ツ","テ","ト",
    "ダ","ヂ","ヅ","デ","ド",
    "ナ","ニ","ヌ","ネ","ノ",
    "ハ","ヒ","フ","ヘ","ホ",
    "バ","ビ","ブ","ベ","ボ",
    "パ","ピ","プ","ペ","ポ",
    "マ","ミ","ム","メ","モ",
    "ヤ","ユ","ヨ",
    "ラ","リ","ル","レ","ロ",
    "ワ","ヲ",
    "ン"
];

const hiraganaMap = new Map([
    ["a", "あ"], ["i",  "い"], ["u",  "う"], ["e" ,"え"], ["o" ,"お"],
    ["ka","か"], ["ki", "き"], ["ku", "く"], ["ke","け"], ["ko","こ"],
    ["ga","が"], ["gi", "ぎ"], ["gu", "ぐ"], ["ge","げ"], ["go","ご"],
    ["sa","さ"], ["shi","し"], ["su", "す"], ["se","せ"], ["so","そ"],
    ["za","ざ"], ["ji", "じ"], ["zu", "ず"], ["ze","ぜ"], ["zo","ぞ"],
    ["ta","た"], ["chi","ち"], ["tsu","つ"], ["te","て"], ["to","と"],
    ["da","だ"], ["di", "ぢ"], ["du", "づ"], ["de","で"], ["do","ど"],
    ["na","な"], ["ni", "に"], ["nu", "ぬ"], ["ne","ね"], ["no","の"],
    ["ha","は"], ["hi", "ひ"], ["fu", "ふ"], ["he","へ"], ["ho","ほ"],
    ["ba","ば"], ["bi", "び"], ["bu", "ぶ"], ["be","べ"], ["bo","ぼ"],
    ["pa","ぱ"], ["pi", "ぴ"], ["pu", "ぷ"], ["pe","ぺ"], ["po","ぽ"],
    ["ma","ま"], ["mi", "み"], ["mu", "む"], ["me","め"], ["mo","も"],
    ["ya","や"], ["yu", "ゆ"], ["yo", "よ"], 
    ["ra","ら"], ["ri", "り"], ["ru", "る"], ["re","れ"], ["ro","ろ"],
    ["wa","わ"], ["wo", "を"],
    ["nn","ん"],

    ["si","し"], ["ti","ち"], ["tu","つ"], ["hu", "ふ"], ["zi", "じ"]
]);

const hiragana = [];
const katakanaMap = new Map();
const romajiMap = new Map();

let it = 0;
for(const pair of hiraganaMap)
{
    if(it >= katakana.length)
        break;

    hiragana[it] = pair[1];
    katakanaMap.set(pair[0], katakana[it]);
    romajiMap.set(pair[1], pair[0])
    romajiMap.set(katakana[it], pair[0])
    it++;
}

katakanaMap.set("si","シ");
katakanaMap.set("ti","チ");
katakanaMap.set("tu","ツ");
katakanaMap.set("hu", "フ");
katakanaMap.set("zi", "ジ");

const allKana = hiragana.concat(katakana);

const lookAlikes = [
    "さ","ざ","ち","ぢ","つ",
    "ぬ","め","ウ","ワ","シ",
    "ジ","ツ","ヅ","マ","ム",
    "ソ","ゾ","ン","ノ","ル",
    "レ"
];

const inputField = document.querySelector('#romaji-input');
const kanaField = document.querySelector('#kana-field');
const buttons = document.querySelectorAll('.btn-class');
const numKanaElement = document.querySelector('#numberOfKana');
const accordion = document.querySelector('.accordion');

let selectedKana = hiragana;
let currentKanaSet;
let count = 0;
let numOfKana = 30;

reload();

function reload() {
    currentKanaSet = getRandomKana(selectedKana, numOfKana);
    count = 0;
    kanaField.innerHTML = '';
    displayKana(currentKanaSet);
    kanaField.childNodes[0].classList.add("currentKana");
}

function getRomaji(kana) {

    for(const pair of hiraganaMap)
        if(pair[1] === kana)
            return pair[0];
            
    for(const pair of katakanaMap)
        if(pair[1] === kana)
            return pair[0].toUpperCase();
    
    return "";
}

function displayKana(kanaArray) {
    let kanaFieldHtml = "";
    for(let i = 0; i < kanaArray.length; i++) {
        let romaji = getRomaji(kanaArray[i]);
        kanaFieldHtml += `<div class="tooltip">${kanaArray[i]}<span class="tooltiptext">${romaji}</span></div>`;
    }
    kanaField.innerHTML = kanaFieldHtml;
}

function getRandomKana(kanaArray, size) {
    let kanaSet = []
    for (let i = 0; i < size; i++) {
        randomNum = Math.floor(Math.random() * kanaArray.length);
        kanaSet.push(kanaArray[randomNum]);
    }
    return kanaSet;
}

function checkAnswer(inputKana) {
    if(inputKana === currentKanaSet[count]) {
        inputField.value = "";
        let currentKanaClassList = kanaField.childNodes[count].classList;
        if (!currentKanaClassList.contains("wrong")) {
            currentKanaClassList.add("correct");
        }
        currentKanaClassList.remove("currentKana");
        count++;
        if (count >= numOfKana) {
            reload();
            count = 0;
        } else {
            let nextKana = kanaField.childNodes[count];
            nextKana.classList.add("currentKana");
        }
    }
    else {
        kanaField.childNodes[count].classList.add("wrong");
    }
}

function toKana(inputStr)
{
    let newStr = "";
    let index = 0;

    while(index < inputStr.length)
    {
        let offset = (2 < inputStr.length)? 2 : inputStr.length;

        while(offset > 0)
        {
            let str = inputStr.slice(index, index + 1 + offset);
            let isKatakana = str.toUpperCase() === str;
            str = str.toLowerCase();

            if(!katakanaMap.has(str) && !hiraganaMap.has(str))
            {
                offset -= 1;
                continue;
            }

            if(isKatakana)
                newStr += katakanaMap.get(str);
            else
                newStr += hiraganaMap.get(str);
            break;
        }

        if(offset === 0)
            newStr += inputStr[index];
        index += offset + 1;
    }

    return newStr
}

inputField.addEventListener('input', () => {
    let inputStr = inputField.value;
    if(!inputStr)
        return;

    kana = toKana(inputStr);
    inputField.value = kana;

    if(romajiMap.has(kana))
        checkAnswer(kana);
})

numKanaElement.addEventListener("change", (e) => {
    numOfKana = e.target.value;
    reload();
})

buttons.forEach(btn => btn.addEventListener('click', (e) => {
    kanaOptions = {'hiragana': hiragana, 'katakana': katakana, 'allKana': allKana, 'lookAlikes': lookAlikes};
    buttons.forEach(btn => btn.style.background = '');
    selectedKana = kanaOptions[btn.value];
    reload();
    e.target.style.background = 'rgb(177, 255, 157)';
}))

accordion.addEventListener('click', (e) => {
    accordion.classList.toggle("active");
    let panel = e.target.nextElementSibling;

    if (panel.style.display !== "flex") {
        panel.style.display = "flex";
        accordion.innerText = "Hide"
    } else {
        panel.style.display = "none";
        accordion.innerText = "Options"
    }

    accordion.classList.toggle("hide");
})