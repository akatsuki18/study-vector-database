// /lib/langchain.ts
import { OpenAI } from 'langchain/llms/openai'
import { ZillizVectorStore } from 'langchain/vectorstores/zilliz'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RetrievalQAChain } from 'langchain/chains'

export async function createQAChain() {
  const llm = new OpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  const vectorStore = new ZillizVectorStore(new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
  }), {
    url: process.env.ZILLIZ_ENDPOINT,
    token: process.env.ZILLIZ_TOKEN,
    collectionName: 'notes'
  })

  const retriever = vectorStore.asRetriever()
  const chain = RetrievalQAChain.fromLLM(llm, retriever)

  return chain
}
