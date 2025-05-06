"use client";
import React, { useEffect, useState } from "react";
import useMyAxios from "@/composables/useMyAxios";
import { Book, Author, Genre } from "@/interfaces/books";
import { Books } from "@/components/shared/Books/books";
import Autocomplete from "@/components/shared/Autocomplete";

const BookPage: React.FC = () => {
  const { request, loading, error } = useMyAxios();

  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("");

  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  // Загрузка начальных данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, authorsRes, genresRes] = await Promise.all([
          request("library/books/", "GET"),
          request("library/authors/", "GET"),
          request("library/genres/", "GET")
        ]);
        
        setBooks(booksRes.data);
        setAuthors(authorsRes.data);
        setGenres(genresRes.data);
      } catch (err) {
        console.error("Ошибка загрузки данных", err);
      }
    };
    fetchData();
  }, []);

  // Фильтрация книг
  useEffect(() => {
    const fetchFilteredBooks = async () => {
      try {
        let url = `library/books/?`;
        if (selectedAuthor) {
          url += `author_id=${selectedAuthor.id}&`;
        }
        if (selectedGenre) {
          url += `genre_id=${selectedGenre.id}&`;
        }
        if (selectedSort) {
          url += `sort_order=${selectedSort}`;
        }
        url = url.replace(/&+$/, "");

        const response = await request(url, "GET");
        setBooks(response.data);
      } catch (err) {
        console.error("Ошибка фильтрации", err);
      }
    };

    fetchFilteredBooks();
  }, [selectedAuthor, selectedGenre, selectedSort ]);

  return (
    <>
      {loading && <div>Загрузка...</div>}
      {error && <div>Ошибка при загрузке данных</div>}
      

      <div className="filters">
        <div className="filter-item">
          <label>Автор:</label>
          <Autocomplete<Author>
            endpoint="library/authors/search/"
            placeholder="Введите имя автора..."
            labelField="name"
            onSelect={(author) => setSelectedAuthor(author)}
          />
        </div>

        <div className="filter-item">
          <label>Жанр:</label>
          <Autocomplete<Genre>
            endpoint="library/genres/search/"
            placeholder="Введите название жанра..."
            labelField="name"
            onSelect={(genre) => setSelectedGenre(genre)}
          />
        </div>

        <div className="filter-item">
          <label>Сортировка:</label>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="">Без сортировки</option>
            <option value="asc">По возрастанию (А-Я)</option>
            <option value="desc">По убыванию (Я-А)</option>
          </select>
        </div>
      </div>

      <div className="book-list">
        {books.map((book) => (
          <Books 
            key={book.id} 
            book={book} 
          />
        ))}
      </div>
    </>
  );
};

export default BookPage;