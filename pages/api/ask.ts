// /pages/api/ask.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createQAChain } from '../../lib/langchain'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { question } = req.body
  if (!question) return res.status(400).json({ error: 'question is required' })

  try {
    const chain = await createQAChain()
    const answer = await chain.invoke(question)
    res.status(200).json({ answer })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'LangChain failed' })
  }
}
