import { ExhibitionType } from "@/interfaces/exhibition";
import Image from "next/image";

// Надо не сам интерфейс сделать, а добавить существующий
interface ExhibitionProps {
  exhibition: ExhibitionType;
}

// а тут добавить сами прописы 
export const Exhibition = ({ exhibition }: ExhibitionProps) => {
  const publishedDate = new Date(exhibition.published_at);
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = publishedDate.toLocaleDateString('ru-RU', options);

  return (
    <div className="bg-white flex flex-col md:flex-row items-center p-4 cursor-pointer hover:shadow-lg transition-shadow mb-1">
      {/* Левая часть – фотография */}
      <div className="relative w-full md:w-1/4 aspect-video">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${exhibition.image}`}
          alt="Изображение выставки"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      {/* Правая часть – информация по выставке */}
      <div className="flex flex-col justify-center p-4 w-full md:w-1/2">
        <h2 className="text-xl md:text-2xl font-bold mb-2">{exhibition.title}</h2>
        <p className="text-gray-700 mb-2 text-sm md:text-base">
          {exhibition.description}
        </p>
        <span className="text-xs md:text-sm text-gray-500">
          Дата публикации: {formattedDate}
        </span>
      </div>
    </div>
  );
};
