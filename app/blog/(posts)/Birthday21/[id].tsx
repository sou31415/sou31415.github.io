import type { Metadata } from "next";
import { BlogPostArticle } from "../../_components/BlogPostArticle";
import type { BlogPost } from "../../posts";

export const post: BlogPost = {
  slug: "Birthday21",
  title: "21歳になりました",
  description:
    "だらだらと",
  date: "2025-10-21",
  readingTime: "5 mins read",
  tags: [],
  body: [
"というわけで21歳になりました。",
"いくらでもふざけることもできるんですが少しだけ真面目に",
"20歳はなんかすげえ色々やったなあみたいな感じで、初めての投資信託、初めての個別株投資とかの軽めなやつから始まって",
"福岡で、高専でぬくぬくしてたとこから東京とかいういつみてもやたら明るい街に放り出されてあたふたしながら近くに知り合いが全然いないところで初めての一人暮らしをスタートしたわけですがまあなんだかんだ生きることができていて、人の底力ってのはすげえなあみたいなことを実感した歳だったりしています",
"高専在学中の話をするとギリAppleで働いていたり卒業できるかこれみたいなギリギリLifeを送りながらも蓋開けてみれば高専生活5年間を締めくくるにふさわしい最後を飾ることができて1人じゃできなかったこともしてみれなかっただろう景色もいっぱいみさせてもらってありがたい限りでしたね",
"就職してからもその勢いは止めずに4つも5つも上の同期に負けない気持ちでいろんなことしまくって働きまくっていっぱい挑戦して巻き込んでなんとかここまでこれたか〜みたいなことを思っていたり",
"ドカ強い同期の存在を知って凹みかけても自分の手の中にあるものを再確認してなんだかんだ走り続けられたという意味では人間として一段と強くなったなあみたいな気もしていて、その意味でもやっぱり総じて変化が大きい年だったなあとか考えています",
"というか大体どのタイミングでも1年も経ったら変化大きいか。",
"そんなこともないのか、年取ったら変わるのかなあ、わからない",
"21歳では引き続きスタンドアロンな価値の創出がしたいなあと思っていて、Appleにいたからとか、高専プロコンで受賞したからとか、起業家甲子園で受賞したからとか、他に依存する自身の一部をしっかり再定義したくて、総じて「自分だから」といえるだけの説得力と価値に押し上げるために、一つ一つ頑張ります"
  ]
};

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: {
    title: post.title,
    description: post.description,
    type: "article",
    publishedTime: post.date
  }
};

export default function Birthday21Page() {
  return <BlogPostArticle post={post} />;
}

