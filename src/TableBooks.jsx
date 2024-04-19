import { useState, useEffect } from "react";
import axios from "axios";

function TableBooks() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedAuthor, setEditedAuthor] = useState("");
  const [editedPublished, setEditedPublished] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/books");
        if (!response.data) {
          throw new Error("Failed to fetch data");
        }
        setData(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/books/${id}`);
      const updatedData = await axios.get("http://127.0.0.1:8000/api/books");
      setData(updatedData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setEditedTitle(book.name);
    setEditedAuthor(book.author);
    setEditedPublished(book.publish_date);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedBook(null);
    setEditedTitle("");
    setEditedAuthor("");
    setEditedPublished("");
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`http://127.0.0.1:8000/api/books/${selectedBook.id}`, {
        name: editedTitle,
        author: editedAuthor,
        publish_date: editedPublished,
      });
      const updatedData = await axios.get("http://127.0.0.1:8000/api/books");
      setData(updatedData.data);
      closeEditModal();
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-fit mx-auto m-5 p-3 overflow-x-auto shadow-md sm:rounded-lg bg-slate-200">
      <h2 className="text-xl font-bold text-black">Books</h2>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Author</th>
            <th className="px-6 py-3">Published</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((book, index) => (
            <tr
              key={index}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
            >
              <td className="px-6 py-4 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {book.name}
              </td>
              <td className="px-6 py-4">{book.author}</td>
              <td className="px-6 py-4">{book.publish_date}</td>
              <td className="px-6 py-4 flex gap-1">
                <button
                  onClick={() => openEditModal(book)}
                  className="text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-black p-4 rounded-lg">
            <h2>Edit Book</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="bg-slate-400 "
                />
              </div>
              <div>
                <label>Author:</label>
                <input
                  type="text"
                  value={editedAuthor}
                  onChange={(e) => setEditedAuthor(e.target.value)}
                  className="bg-slate-400"
                />
              </div>
              <div>
                <label>Published:</label>
                <input
                  type="text"
                  value={editedPublished}
                  onChange={(e) => setEditedPublished(e.target.value)}
                  className="bg-slate-400"
                />
              </div>
              <button type="submit" className="bg-blue-500">
                Save Changes
              </button>
              <button onClick={closeEditModal} className="bg-red-500">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableBooks;
