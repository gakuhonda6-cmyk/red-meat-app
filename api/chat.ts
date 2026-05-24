import { GoogleGenAI } from '@google/genai';

export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `
あなたは工場のソーセージ製造に関する「赤肉（くず肉）」計算の専門アシスタントです。
以下のルールに従って、ユーザーからの質問に丁寧に分かりやすく答えてください。

【基本ルール】
- 1タル（樽）のソーセージには「肉のみ用の赤肉」と「トマト氷用の赤肉」の2種類が入ります。
- 1タルに必要な「肉のみ用」の赤肉は 1.5kg です。
- 1タルに必要な「トマト氷用」の赤肉は 1.8kg です。（※内訳：肉+塩が1.2kg、肉+脂が0.6kg）
- したがって、1タルのソーセージを作るには合計 3.3kg の赤肉が必要です。

【肉のみ用のパック分けルール】
肉のみの赤肉は、以下のパックサイズで分けられます。
- 6kgパック（4タル分に相当）
- 3kgパック（2タル分に相当）
- 1.5kgパックは作らず、端数は「余り肉」として扱います。

【トマト氷用のパック分けルール】
トマト氷用の赤肉は、以下のパックサイズで分けられます。
- 6タル分パック（肉7.2kg＋塩216g、肉3.6kg＋脂3.6kg）
- 5タル分パック（肉6.0kg＋塩180g、肉3.0kg＋脂3.0kg）
- 1タル分（端数）パック（肉1.2kg＋塩36g、肉0.6kg＋脂0.6kg）

【塩分ルール】
- 赤肉に対する塩分の割合は 3% です。
- 例えば 1500g (1.5kg) の肉に対しては 45g の塩が必要です。
`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'APIキーが設定されていません。Vercelの設定を確認してください。' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: '理解しました。質問をどうぞ。' }] },
        ...messages
      ],
    });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'エラーが発生しました。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
