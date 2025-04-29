"use client"
import { Exhibition } from "@/components/shared/Exhibition/exhibition";
import useMyAxios from "@/composables/useMyAxios";
import { useEffect, useState } from "react";

export interface ExhibitionType {
    id: number;
    title: string;
    image: string;
    description: string;
    created_at: Date;
    published_at: Date;
    is_published?: boolean;
}

export interface ApiResponse {
    items: ExhibitionType[];
    page: number;
    size: number;
    total: number;
    total_pages: number;
}

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
                
                console.log('Full API response:', response); // Добавляем полный лог ответа
                
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
            
            <div className="pagination">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    Назад
                </button>
                <span>Страница {page} из {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                >
                    Вперед
                </button>
            </div>
        </>
    );
};

export default ExhibitionsPage;