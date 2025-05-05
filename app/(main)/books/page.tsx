"use client";
import React, { useEffect, useState } from "react";
import useMyAxios from "@/composables/useMyAxios";
import { Book } from "@/interfaces/books";
import { Books } from "@/components/shared/Books/books";

const BookPage: React.FC = () => {
  const { request, loading, error } = useMyAxios();

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  // Загружаем книги с сервера при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request("library/books/", "GET");
        setBooks(response.data);
        setFilteredBooks(response.data);
      } catch (err) {
        console.error("Ошибка загрузки книг", err);
      }
    };

    fetchData();
  }, []);

  // Фильтруем книги по выбранным жанру и автору
  useEffect(() => {
    let filtered = books;

    if (selectedGenre) {
      filtered = filtered.filter((book) => book.genre === selectedGenre);
    }
    if (selectedAuthor) {
      filtered = filtered.filter((book) => book.author === selectedAuthor);
    }
    setFilteredBooks(filtered);
  }, [selectedGenre, selectedAuthor, books]);

  // Получаем уникальные жанры и авторов из массива книг
  const genres = Array.from(new Set(books.map((book) => book.genre)));
  const authors = Array.from(new Set(books.map((book) => book.author)));

  return (
    <>
      {loading && <div>Загрузка...</div>}
      {error && <div>Ошибка при загрузке книг</div>}
      <div>
        <ul>
          <li>
            <label>
              Выбери жанр:{" "}
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Все жанры</option>
                {genres.map((genre: string, index: number) => (
                  <option key={`${genre}-${index}`} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </label>
          </li>
          <li>
            <label>
              Выбери автора:{" "}
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
              >
                <option value="">Все авторы</option>
                {authors.map((author: string, index: number) => (
                  <option key={`${author}-${index}`} value={author}>
                    {author}
                  </option>
                ))}
              </select>

            </label>
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4">Список книг:</h3>
        <div className="w-full max-w-[1400px] px-5">
          <ul className="flex flex-col">
            {books.map((book) => (
              <li key={book.id}>
                <Books book={book} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default BookPage;
