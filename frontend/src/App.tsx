import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>中通快递智能报价系统</h1>
        <p>ZTO Express Quotation System</p>
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setCount((count) => count + 1)}>
            测试计数: {count}
          </button>
        </div>
        <div style={{ marginTop: '2rem', fontSize: '14px', color: '#666' }}>
          <p>✅ 前端已启动 (端口1111)</p>
          <p>✅ Vite + React 18 + TypeScript</p>
          <p>⏳ 等待后端开发...</p>
        </div>
      </header>
    </div>
  )
}

export default App
