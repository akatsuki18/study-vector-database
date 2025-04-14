import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.body

  try {
    // Step 1: OpenAIでembedding
    const embeddingRes = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002'
      })
    })
    const embeddingData = await embeddingRes.json()
    const embedding = embeddingData.data[0].embedding

    // Step 2: Zillizに登録
    const insertRes = await fetch(`${process.env.ZILLIZ_ENDPOINT}/v2/vectordb/entities/insert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ZILLIZ_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        collectionName: 'notes',
        data: [
          {
            text,
            embedding,
          }
        ]
      })
    })

    const responseText = await insertRes.text()
    console.log('Zilliz insert status:', insertRes.status)
    console.log('Zilliz response:', responseText)

    try {
      const responseData = JSON.parse(responseText)
      if (responseData.code !== 0) { // Zillizは成功時にcode: 0を返します
        throw new Error(`Zilliz insert failed: ${responseData.message}`)
      }
    } catch (parseError) {
      throw new Error('Failed to parse Zilliz response')
    }

    res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Registration failed' })
  }
}