import { tokenize, splitSentences } from "@/lib/analytics/tokenizer";
import { analyzePace } from "@/lib/analytics/pace";
import { analyzeFillers } from "@/lib/analytics/fillers";
export default function Page() {

  console.log(tokenize("Hello!! I built Aynam."));
  // Expected:
  // ["hello", "i", "built", "aynam"]

  console.log(splitSentences("Hi. How are you? I'm good!"));
  // Expected:
  // ["Hi", "How are you", "I'm good"]
  console.log(
  analyzePace(
    "Hello my name is Namya and I built Aynam.",
    30
  )
);
console.log(
  analyzeFillers(
    "Um... I think... like... basically... I built an AI system. Um actually it works."
  )
);
  return (
    <div>
      Open the browser console (F12).
    </div>
  );
}