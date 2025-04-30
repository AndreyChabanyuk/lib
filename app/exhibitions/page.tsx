"use client"
import { Exhibition } from "@/components/shared/Exhibition/exhibition";
import useMyAxios from "@/composables/useMyAxios";
import { useEffect, useState } from "react";
import { ApiResponse } from "@/interfaces/exhibition";
import { MdArrowBack, MdArrowForward, MdSearch } from "react-icons/md";

const ExhibitionsPage: React.FC = () => {
    const { request, loading, error, data } = useMyAxios<ApiResponse>();
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await request(
                    `v2/exhibitionsPage/?page=${page}&size=${size}`,
                    "GET"
                );

                console.log('Full API response:', response);

                if (response && response.data) {
                    console.log('Response data:', response.data);
                    const pages = Math.max(1, response.data.total_pages || 1);
                    setTotalPages(pages);

                    if (page > pages) {
                        setPage(pages);
                    }
                }
            } catch (error) {
                console.error("Ошибка при загрузке выставок", error);
            }
        };

        fetchData();
    }, [page, size]);

    const GetPageNumbers = () => {
        const maxPagesToShow = 5;
        let startPage: number, endPage: number;

        if (totalPages <= maxPagesToShow) {
            // Если у нас меньше или равно 5 страниц показываем все страницы
            startPage = 1;
            endPage = totalPages;
        } else {
            // Если тякущая страница <= 3, то начниаем с 1( перенапраляем к первой странице)
            if (page <= 3) {
                startPage = 1;
                endPage = maxPagesToShow
            }
            else if (page + 2 >= totalPages) {
                // Если тякущая страница ближе к концу
                startPage = totalPages - (maxPagesToShow - 1);
                endPage = totalPages;
            } else {
                startPage = page - 2;
                endPage = page + 2
            }
        }
        const pageNumbers: number[] = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <main>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Заголовок с поиском */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold ">
                            Выставки
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Исследуйте наши последние коллекции
                        </p>
                    </div>

                    {/* Поле поиска (статичное) */}
                    <div className="w-full md:w-72 relative">
                        <input
                            type="search"
                            placeholder="Поиск выставок..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled
                        />
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    </div>
                </div>
            </div>
            {loading && <div>Загрузка...</div>}
            {error && <div>Ошибка при загрузке выставок</div>}

            {data?.items ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                    <ul>
                        {data.items.map((exhibit) => (
                            <li key={exhibit.id}>
                                <Exhibition exhibition={exhibit} />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : !loading && <div>Нет данных для отображения</div>}

            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="px-3 py-2 rounded text-black hover:text-blue-500 disabled:opacity-50"
                >
                    <MdArrowBack size={24} />
                </button>

                {GetPageNumbers().map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        disabled={loading}
                        className={`px-3 py-2 rounded ${page === pageNumber
                            ? "bg-black text-white"
                            : "bg-transparent text-black hover:text-blue-500"
                            } disabled:opacity-50`}
                    >
                        {pageNumber}
                    </button>
                ))}

                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                    className="px-3 py-2 rounded text-black hover:text-blue-500 disabled:opacity-50"
                >
                    <MdArrowForward size={24} />
                </button>
            </div>

        </main>
    );
};

export default ExhibitionsPage;