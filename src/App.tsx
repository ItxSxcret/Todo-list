import { useRef, useState } from 'react'
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect } from 'react';
function App() {



  interface Todo {
    idTask?: number;
    title: string;
    description: string;
    isDone: boolean;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const todoTitleRef = useRef<HTMLInputElement>(null);
  const todoDescRef = useRef<HTMLInputElement>(null);
  const todoStatusRef = useRef<HTMLSelectElement>(null);
  const [show, setshow] = useState<boolean>(false)
  const [editId, setEditId] = useState<number | null>(null);

  const baseUrl = 'http://localhost:3000';
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get<Todo[]>(`${baseUrl}/todos`);
        console.log('Fetched todos:', response.data);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);
  function Toggleshow() {
    setshow(!show)
  }

  function vadidateInputs() {
    if (!todoTitleRef.current?.value || !todoDescRef.current?.value || !todoStatusRef.current?.value) {
      alert('Please fill in all fields');
      return true;
    }
    return false;
  }



  const addTodo = async () => {
    if (vadidateInputs()) return;

    const newTodo: Todo = {
      title: todoTitleRef.current!.value,
      description: todoDescRef.current!.value,
      isDone: todoStatusRef.current!.value === 'done',
    };

    try {
      const response = await axios.post<{ message: string; todo: Todo }>(`${baseUrl}/todo`, newTodo);

      console.log('Todo added:', response.data);
      // บังคับให้ใช้ข้อมูลที่เรารู้ว่าถูกต้อง
      const todoToAdd: Todo = {
        idTask: response.data.todo.idTask,
        title: response.data.todo.title,
        description: response.data.todo.description,
        isDone: !!response.data.todo.isDone, // แปลง 1/0 → true/false
      };
      setTodos(prev => [...prev, todoToAdd]);
      Toggleshow();
      // ล้าง input
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${baseUrl}/todo/${id}`);
      setTodos(prev => prev.filter(todo => todo.idTask !== id));
      console.log(`Todo with id ${id} deleted`);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };



  return (
    <>
      <div className='bg-[#2E236C] w-[80vw] h-[80vh] rounded '>
        <nav className='w-full pl-10 pr-10 h-20 flex items-center justify-between shadow-sm rounded-t bg-[#433D8B]'>
          <span className='text-white font-bold text-2xl'>Todo-List</span>
          <div className='flex items-center justify-between gap-6'>
            <FontAwesomeIcon icon={faPlus} onClick={Toggleshow} className='text-white text-xl duration-300 hover:scale-125 hover:cursor-pointer' />
          </div>
        </nav>

        <table className='w-full table-auto'>
          <thead>
            <tr className='bg-white h-10'>
              <th className='border border-gray-300 px-4 py-2 duration-300 hover:bg-gray-200'>Id</th>
              <th className='border border-gray-300 px-4 py-2 duration-300 hover:bg-gray-200'>Title</th>
              <th className='border border-gray-300 px-4 py-2 duration-300 hover:bg-gray-200'>Description</th>
              <th className='border border-gray-300 px-4 py-2 duration-300 hover:bg-gray-200'>Status</th>
              <th className='border border-gray-300 px-4 py-2 duration-300 hover:bg-gray-200'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <tr key={index} className='h-10 bg-[#C8ACD6]'>
                <td className='border border-gray-300 px-4 py-2'>{todo.idTask}</td>
                <td className='border border-gray-300 px-4 py-2'>{todo.title}</td>
                <td className='border border-gray-300 px-4 py-2'>{todo.description}</td>
                <td className='border border-gray-300 px-4 py-2'>{todo.isDone ? 'Done' : 'Pending'}</td>
                <td className='border border-gray-300 px-4 py-2 text-center'>
                  <button onClick={() => deleteTodo(todo.idTask! || 0)} className='text-black bg-red-400 ml-2 w-15 font-bold rounded duration-300 hover:bg-red-500 hover:cursor-pointer hover:text-white'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {show && (
          <>
            {/* 🔲 Overlay พื้นหลังเทาโปร่ง */}
            <div className="fixed inset-0 bg-gray-800/50 z-10"></div>

            {/* 🔲 Modal */}
            <div className='bg-[#433D8B] p-4 rounded shadow-md fixed top-52 left-[50%] translate-x-[-50%] flex flex-col w-[400px] z-20'>
              <span className='font-bold text-[30px] text-white'>Todo Title</span>
              <input
                type="text"
                placeholder='Enter Todo Title'
                ref={todoTitleRef}
                className='outline-none border-b-2 border-white p-2 pl-4 text-[20px]  mb-4 text-white'
              />
              <span className='font-bold text-[30px] text-white'>Todo Description</span>
              <input
                type="text"
                placeholder='Enter Todo Description'
                ref={todoDescRef}
                className='outline-none border-b-2 border-white p-2 pl-4 text-[20px]  mb-4 text-white'
              />
              <span className='font-bold text-[30px] text-white'>Todo Status</span>
              <select ref={todoStatusRef} className='outline-none border-b-2 border-white p-2 pl-4 text-[20px] mb-4 text-white bg-[#433D8B]'>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>

              <div className='w-full flex justify-end items-center'>
                <button onClick={addTodo} className='text-black bg-blue-400 w-20 h-9 font-bold duration-300 rounded hover:bg-blue-500 hover:cursor-pointer hover:text-white'>
                  ADD
                </button>
                <button onClick={Toggleshow} className='text-black bg-red-400 ml-2 w-20 h-9 font-bold rounded duration-300 hover:bg-red-500 hover:cursor-pointer hover:text-white'>Cancel</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
