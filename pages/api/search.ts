import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { embedding } = req.body

  const response = await fetch(`${process.env.ZILLIZ_ENDPOINT}/v2/vectordb/entities/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ZILLIZ_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      collectionName: 'notes',
      data: [embedding],
      outputFields: ['text'],
      limit: 5
    })
  })

  const result = await response.json()
  const searchResults = result.data.map((item: any) => ({
    text: item.text,
    score: item.distance
  }))
  res.status(200).json({ results: searchResults })
}
