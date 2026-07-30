
export interface RepeatedWord { word: string; count: number; }
export interface FillerWord { word: string; count: number; }
export type SpeakingPace = "Very Slow"|"Slow"|"Normal"|"Fast"|"Very Fast";

export interface SpeechAnalytics {
  wordCount:number;
  sentenceCount:number;
  characterCount:number;
  durationSeconds:number;
  wordsPerMinute:number;
  speakingPace:SpeakingPace;
  averageSentenceLength:number;
  longestSentence:number;
  shortestSentence:number;
  averageWordLength:number;
  uniqueWords:number;
  vocabularyRichness:number;
  fillerWordCount:number;
  fillerDensity:number;
  fillerWords:FillerWord[];
  repeatedWords:RepeatedWord[];
  analyticsSummary:string;
}

const STOP_WORDS=new Set(["the","a","an","is","are","was","were","be","been","being","to","of","in","on","for","at","with","and","or","but","i","you","he","she","it","they","we","my","your","our","this","that","these","those","as","by","from","have","has","had","do","does","did","will","would","can","could","should"]);

const FILLERS=["um","uh","like","actually","basically","literally","you know","kind of","sort of"];

function tokenize(text:string){return text.toLowerCase().match(/[a-z']+/g)??[];}
function splitSentences(text:string){return text.split(/[.!?]+/).map(s=>s.trim()).filter(Boolean);}
function classifySpeakingPace(wpm:number):SpeakingPace{
 if(wpm<90)return"Very Slow";
 if(wpm<110)return"Slow";
 if(wpm<=150)return"Normal";
 if(wpm<=180)return"Fast";
 return"Very Fast";
}
function detectFillers(text:string){
 const lower=text.toLowerCase(); const result:FillerWord[]=[]; let total=0;
 for(const filler of FILLERS){
   const regex=new RegExp(`\\b${filler}\\b`,"g");
   const matches=lower.match(regex);
   const count=matches?.length??0;
   if(count){result.push({word:filler,count}); total+=count;}
 }
 return{total,result};
}
function repeated(words:string[]):RepeatedWord[]{
 const freq:Record<string,number>={};
 for(const w of words){if(STOP_WORDS.has(w))continue; freq[w]=(freq[w]||0)+1;}
 return Object.entries(freq).filter(([,c])=>c>2).sort((a,b)=>b[1]-a[1]).map(([word,count])=>({word,count})).slice(0,10);
}

export function generateSpeechAnalytics(transcript:string,durationSeconds:number):SpeechAnalytics{
 const words=tokenize(transcript);
 const sentences=splitSentences(transcript);

 const wordCount=words.length;
 const sentenceCount=sentences.length;
 const characterCount=transcript.length;
 const wordsPerMinute=durationSeconds===0?0:Math.round(wordCount/(durationSeconds/60));
 const speakingPace=classifySpeakingPace(wordsPerMinute);
 const averageSentenceLength=sentenceCount===0?0:Number((wordCount/sentenceCount).toFixed(1));
 const sentenceLengths=sentences.map(s=>tokenize(s).length);
 const longestSentence=sentenceLengths.length?Math.max(...sentenceLengths):0;
 const shortestSentence=sentenceLengths.length?Math.min(...sentenceLengths):0;
 const averageWordLength=wordCount===0?0:Number((words.reduce((a,w)=>a+w.length,0)/wordCount).toFixed(1));
 const uniqueWords=new Set(words).size;
 const vocabularyRichness=wordCount===0?0:Number((uniqueWords/wordCount).toFixed(2));
 const fillers=detectFillers(transcript);
 const fillerDensity=wordCount===0?0:Number(((fillers.total/wordCount)*100).toFixed(2));
 return{
  wordCount,sentenceCount,characterCount,
  durationSeconds,wordsPerMinute,speakingPace,
  averageSentenceLength,longestSentence,shortestSentence,averageWordLength,
  uniqueWords,vocabularyRichness,
  fillerWordCount:fillers.total,
  fillerDensity,
  fillerWords:fillers.result,
  repeatedWords:repeated(words),
  analyticsSummary:`You spoke ${wordCount} words in ${durationSeconds} seconds (${wordsPerMinute} WPM). Your speaking pace was ${speakingPace}. You used ${fillers.total} filler words and your vocabulary richness was ${vocabularyRichness}.`
 };
}
