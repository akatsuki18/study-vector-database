import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Step 1: 既存のコレクションを削除（存在する場合）
    try {
      await fetch(`${process.env.ZILLIZ_ENDPOINT}/v2/vectordb/collections/drop`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ZILLIZ_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collectionName: 'notes'
        })
      })
    } catch (e) {
      console.log('Collection might not exist, proceeding with creation')
    }

    // Step 2: 新しいコレクションを作成
    const createRes = await fetch(`${process.env.ZILLIZ_ENDPOINT}/v2/vectordb/collections/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ZILLIZ_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collectionName: 'notes',
        dimension: 1536, // OpenAI ada-002 モデルの次元数
        description: 'Collection for storing facility information',
        fields: [
          {
            name: 'text',
            description: 'Original text content',
            dataType: 'VARCHAR',
            maxLength: 2048 // より長い制限を設定
          },
          {
            name: 'id',
            description: 'Unique identifier',
            dataType: 'VARCHAR',
            maxLength: 64,
            isPrimary: true
          }
        ],
        vectorField: 'embedding'
      })
    })

    const responseText = await createRes.text()
    console.log('Create collection response:', responseText)

    const responseData = JSON.parse(responseText)
    if (responseData.code !== 0) {
      throw new Error(`Failed to create collection: ${responseData.message}`)
    }

    res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to setup collection' })
  }
}