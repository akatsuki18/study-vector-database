import { useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setResults([])

    // Step 1: embedding取得
    const embeddingRes = await fetch('/api/embedding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText })
    })
    const { embedding } = await embeddingRes.json()

    // Step 2: Zilliz検索
    const searchRes = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embedding })
    })
    const { results: searchResults } = await searchRes.json()

    setResults(searchResults)
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <h1>メモ検索アプリ</h1>
      <input
        type="text"
        placeholder="例: 猫に関するメモ"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className={styles.searchInput}
      />
      <button
        type="button"
        onClick={handleSearch}
        disabled={loading}
        className={styles.searchButton}
      >
        {loading ? '検索中…' : '検索'}
      </button>

      <hr />

      <h2>検索結果</h2>
      {Array.isArray(results) && results.length > 0 ? (
        <ul className={styles.resultsList}>
          {results.map((item, i) => (
            <li key={i}>
              <p>{item.text}</p>
              <small>スコア: {(item.score || 0).toFixed(4)}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>検索結果はありません。</p>
      )}
    </div>
  )
}
