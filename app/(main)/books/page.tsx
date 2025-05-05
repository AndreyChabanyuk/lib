"use client";
import React, { useEffect, useState } from "react";
import useMyAxios from "@/composables/useMyAxios";
import { Book, Author, Genre } from "@/interfaces/books";
import { Books } from "@/components/shared/Books/books";

const BookPage: React.FC = () => {
  const { request, loading, error } = useMyAxios();

  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
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
        const params = new URLSearchParams();
        if (selectedAuthor) params.append('author_id', selectedAuthor);
        if (selectedGenre) params.append('genre_id', selectedGenre);
        
        const response = await request(
          `library/books/?${params.toString()}`, 
          "GET"
        );
        setBooks(response.data);
      } catch (err) {
        console.error("Ошибка фильтрации", err);
      }
    };

    fetchFilteredBooks();
  }, [selectedGenre, selectedAuthor]);

  return (
    <>
      {loading && <div>Загрузка...</div>}
      {error && <div>Ошибка при загрузке данных</div>}
      
      <div className="filters">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Все жанры</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
        >
          <option value="">Все авторы</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
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