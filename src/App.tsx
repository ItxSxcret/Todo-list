import { useRef, useState } from 'react'
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function App() {

  interface Todo {
    id: number;
    title: string;
    description: string;
    isDone: boolean;
  }

  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Learn React', description: 'Study the basics of React', isDone: false },
    { id: 2, title: 'Build a Todo App', description: 'Create a simple Todo application', isDone: false },
    { id: 3, title: 'Deploy the App', description: 'Deploy the Todo app to a hosting service', isDone: false }
  ]);
  const todoTitleRef = useRef<HTMLInputElement>(null);
  const todoDescRef = useRef<HTMLInputElement>(null);
  const todoStatusRef = useRef<HTMLSelectElement>(null);
  const [show, setshow] = useState<boolean>(false)
  const [editId, setEditId] = useState<number | null>(null); // สำหรับบอกว่ากำลังแก้ Todo ตัวไหน

  function Toggleshow() {
    setshow(!show)
  }
  const handleDelete = (id: number) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
  };
  const handleEdit = (id: number) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (!todoToEdit) return;

    // ใส่ข้อมูลลง input
    if (todoTitleRef.current) todoTitleRef.current.value = todoToEdit.title;
    if (todoDescRef.current) todoDescRef.current.value = todoToEdit.description;
    if (todoStatusRef.current) todoStatusRef.current.value = todoToEdit.isDone ? 'done' : 'pending';

    setEditId(id);  // กำหนดว่ากำลังแก้ตัวนี้
    setshow(true);  // เปิด modal
  };

  function vadidateInput() {
    const title = todoTitleRef.current?.value.trim();
    const description = todoDescRef.current?.value.trim();
    const status = todoStatusRef.current?.value.trim();

    if (title && description && status) {
      return true;
    } else {
      return false;
    }
  }

  const handleAdd = () => {
    if (!vadidateInput()) {
      alert('Please fill in all fields');
      return;
    }

    const title = todoTitleRef.current?.value || '';
    const description = todoDescRef.current?.value || '';
    const status = todoStatusRef.current?.value || 'pending';

    if (editId !== null) {
      // 🟨 แก้ไข Todo
      const updatedTodos = todos.map(todo =>
        todo.id === editId
          ? { ...todo, title, description, isDone: status === 'done' }
          : todo
      );
      setTodos(updatedTodos);
      setEditId(null); // reset โหมดแก้ไข
    } else {
      // 🟩 เพิ่ม Todo
      const newTodo: Todo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        title,
        description,
        isDone: status === 'done'
      };
      setTodos([...todos, newTodo]);
    }

    // ล้าง input
    if (todoTitleRef.current) todoTitleRef.current.value = '';
    if (todoDescRef.current) todoDescRef.current.value = '';
    if (todoStatusRef.current) todoStatusRef.current.value = 'pending';
    setshow(false);
  };


  return (
    <>
      <div className='bg-[#2E236C] w-[80vw] h-[80vh] rounded'>
        <nav className='w-full pl-10 pr-10 h-20 flex items-center justify-between shadow-sm rounded-t bg-[#433D8B]'>
          <span className='text-white font-bold text-2xl'>Todo-List</span>
          <div className='flex items-center justify-between gap-6'>
            <div className='flex items-center justify-center gap-3'>
              <input type="text" className={`outline-none bg-transparent text-white border-b-2 border-white pl-4 transition-all duration-300`} />
              <FontAwesomeIcon icon={faMagnifyingGlass} className='text-white text-xl duration-300 hover:cursor-pointer hover:scale-125' />
            </div>
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
            {todos.map((todo) => (
              <tr key={todo.id} className='h-10 bg-[#C8ACD6]'>
                <td className='border border-gray-300 px-4 py-2'>{todo.id}</td>
                <td className='border border-gray-300 px-4 py-2'>{todo.title}</td>
                <td className='border border-gray-300 px-4 py-2'>{todo.description}</td>
                <td className='border border-gray-300 px-4 py-2'>{todo.isDone ? 'Done' : 'Pending'}</td>
                <td className='border border-gray-300 px-4 py-2 text-center'>
                  <button onClick={() => handleEdit(todo.id)} className='text-black bg-yellow-400 w-10 font-bold duration-300 rounded hover:bg-yellow-500 hover:cursor-pointer hover:text-white'>Edit</button>
                  <button onClick={() => handleDelete(todo.id)} className='text-black bg-red-400 ml-2 w-15 font-bold rounded duration-300 hover:bg-red-500 hover:cursor-pointer hover:text-white'>Delete</button>
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
                <button onClick={handleAdd} className='text-black bg-blue-400 w-20 h-9 font-bold duration-300 rounded hover:bg-blue-500 hover:cursor-pointer hover:text-white'>
                  {editId !== null ? 'Update' : 'Add'}
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
