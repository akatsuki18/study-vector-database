import { useState } from 'react'
import styles from '../styles/Register.module.css'

export default function RegisterPage() {
  const [text, setText] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    setMessage('登録中...')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })

    if (res.ok) {
      setMessage('登録完了！')
      setText('')
    } else {
      setMessage('登録に失敗しました')
    }
  }

  return (
    <div className={styles.container}>
      <h1>施設情報 登録</h1>
      <textarea
        placeholder="ここに施設のマークダウンや説明文を入力"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.textarea}
      />
      <br />
      <button onClick={handleRegister} className={styles.button}>
        登録
      </button>
      <p>{message}</p>
    </div>
  )
}
