import { useState } from 'react'


function App() {

  const Todos :string[] = []

  const [todo, setTodos] = useState<string[]>([])
  return (
    <>
      <div className='bg-[#2E236C] w-[80vw] h-[80vh] rounded'>
        <nav className='w-full h-20 flex items-center justify-center shadow-sm rounded-t bg-[#433D8B]'><span className='text-white font-bold text-2xl'>Todo-List App</span></nav>


      </div>
    </>
  )
}

export default App
