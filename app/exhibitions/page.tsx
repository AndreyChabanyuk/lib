"use client"
import { Exhibition } from "@/components/shared/Exhibition/exhibition";
import useMyAxios from "@/composables/useMyAxios";
import { useEffect, useState } from "react";
import { ApiResponse } from "@/interfaces/exhibition";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

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
        <>
            {loading && <div>Загрузка...</div>}
            {error && <div>Ошибка при загрузке выставок</div>}

            {data?.items ? (
                <ul>
                    {data.items.map((exhibit) => (
                        <li key={exhibit.id}>
                            <Exhibition exhibition={exhibit} />
                        </li>
                    ))}
                </ul>
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

        </>
    );
};

export default ExhibitionsPage;