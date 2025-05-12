'use client'

import { RichTextEditor } from '@/components/RichTextEditor'
import BookSelector from '@/components/shared/BookSelector'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { api } from '@/composables/api'
import { BookInfo } from '@/interfaces/books'
import {
	ContentBlock,
	ExhibitionSection,
	ExhibitionType,
} from '@/interfaces/exhibition'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import DOMPurify from 'dompurify'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ExhibitionEditor() {
	// Получение параметра slug из URL
	const { slug } = useParams() as { slug?: string }

	// Состояния компонента
	const [exhibition, setExhibition] = useState<ExhibitionType | null>(null)
	const [bookDetails, setBookDetails] = useState<Record<number, BookInfo>>({})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Состояния для управления модальными окнами
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingSection, setEditingSection] =
		useState<ExhibitionSection | null>(null)
	const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
	const [editingSectionTitle, setEditingSectionTitle] =
		useState<ExhibitionSection | null>(null)

	// Состояния формы (локальное состояние для контента)
	const [formType, setFormType] = useState<'text' | 'book'>('text')
	const [htmlContent, setHtmlContent] = useState('')
	const [bookId, setBookId] = useState<number | ''>('')

	// Загрузка данных выставки
	const loadExhibition = () => {
		if (!slug) {
			setError('Slug не указан')
			return
		}
		setLoading(true)
		api
			.get<ExhibitionType>(`/exhibitions/${slug}`)
			.then(res => {
				setExhibition(res.data)
				setError(null)
			})
			.catch(err => {
				setError(err.response?.data?.detail || err.message || 'Ошибка загрузки')
				setExhibition(null)
			})
			.finally(() => setLoading(false))
	}

	// Загрузка информации о книгах
	useEffect(() => {
		if (!exhibition) return

		// Получение уникальных ID книг из контент-блоков
		const ids = Array.from(
			new Set(
				exhibition.sections
					.flatMap(s => s.content_blocks || [])
					.filter(b => b.type === 'book')
					.map(b => b.book_id!)
			)
		)

		// Функция загрузки данных о книге
		const fetchBookDetails = async (id: number) => {
			try {
				const response = await api.get<BookInfo>(`/library/books/${id}`)
				setBookDetails(prev => ({ ...prev, [id]: response.data }))
			} catch (error) {
				console.error('Ошибка загрузки информации о книге:', error)
			}
		}

		// Загрузка данных для каждой книги
		ids.forEach(id => {
			if (!bookDetails[id]) {
				fetchBookDetails(id)
			}
		})
	}, [exhibition])

	// Первоначальная загрузка выставки
	useEffect(() => {
		loadExhibition()
	}, [slug])

	// Обновление состояний формы при редактировании существующего контента
	useEffect(() => {
		if (editingBlock) {
			setFormType(editingBlock.type)
			setHtmlContent(editingBlock.text_content || '')
			setBookId(editingBlock.book_id || '')
		} else {
			// Если переходим к созданию нового блока, сбрасываем поля
			setFormType('text')
			setHtmlContent('')
			setBookId('')
		}
	}, [editingBlock])

	// Методы управления модальным окном
	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		// Добавим задержку для анимации закрытия
		setTimeout(() => {
			setEditingBlock(null)
			setEditingSection(null)
			setEditingSectionTitle(null)
			// Сброс полей формы
			setFormType('text')
			setHtmlContent('')
			setBookId('')
		}, 300)
	}

	// Обработчик создания раздела
	const handleCreateSection = (data: Partial<ExhibitionSection>) => {
		if (!slug) return
		setLoading(true)
		api
			.post(`/exhibitions/${slug}/sections`, data)
			.then(() => {
				loadExhibition()
				closeModal()
			})
			.catch(err =>
				setError(err.response?.data?.detail || 'Ошибка создания раздела')
			)
			.finally(() => setLoading(false))
	}

	// Обработчик обновления раздела
	const handleUpdateSection = (data: Partial<ExhibitionSection>) => {
		if (!slug || !editingSectionTitle) return
		setLoading(true)
		api
			.put(`/exhibitions/${slug}/sections/${editingSectionTitle.id}`, data)
			.then(() => {
				loadExhibition()
				closeModal()
			})
			.catch(err =>
				setError(err.response?.data?.detail || 'Ошибка обновления раздела')
			)
			.finally(() => setLoading(false))
	}

	// Обработчик добавления/обновления контента
	const handleAddOrUpdateContent = () => {
		if (!slug || !editingSection) return

		if (formType === 'book' && !bookId) {
			setError('Выберите книгу')
			return
		}

		// Подготовка данных для отправки
		const data: any = {
			type: formType,
			text_content: formType === 'text' ? htmlContent : null,
			book_id: formType === 'book' ? Number(bookId) : null,
		}

		setLoading(true)
		const method = editingBlock ? 'put' : 'post'
		const url = editingBlock
			? `/exhibitions/${slug}/sections/${editingSection.id}/content/${editingBlock.id}`
			: `/exhibitions/${slug}/sections/${editingSection.id}/content`

		// Отправка запроса
		api[method](url, data)
			.then(() => {
				loadExhibition()
				closeModal()
			})
			.catch(err => {
				let errorMsg = err.message || 'Ошибка сохранения контента'
				if (err.response?.data?.detail) {
					errorMsg = Array.isArray(err.response.data.detail)
						? err.response.data.detail.map((e: any) => e.msg).join(', ')
						: err.response.data.detail
				}
				setError(errorMsg)
			})
			.finally(() => setLoading(false))
	}

	// Обработчик удаления раздела
	const handleDeleteSection = (sectionId: number) => {
		if (!slug) return
		if (!confirm('Удалить этот раздел вместе со всем содержимым?')) return
		setLoading(true)
		api
			.delete(`/exhibitions/${slug}/sections/${sectionId}`)
			.then(() => loadExhibition())
			.catch(err =>
				setError(err.response?.data?.detail || 'Ошибка удаления раздела')
			)
			.finally(() => setLoading(false))
	}

	// Обработчик удаления контента
	const handleDeleteContent = (sectionId: number, block: ContentBlock) => {
		if (!slug) return
		if (!confirm('Удалить этот блок?')) return
		setLoading(true)
		const url = `/exhibitions/${slug}/sections/${sectionId}/content/${block.id}`
		api
			.delete(url)
			.then(() => loadExhibition())
			.catch(err =>
				setError(err.response?.data?.detail || 'Ошибка удаления контента')
			)
			.finally(() => setLoading(false))
	}

	useEffect(() => {
  if (editingBlock) {
    setFormType(editingBlock.type);
    setHtmlContent(editingBlock.text_content || '');
    setBookId(editingBlock.book_id || '');
  } else {
    setFormType('text');
    setHtmlContent('');
    setBookId('');
  }
}, [editingBlock, isModalOpen]);

	// Отображение состояния загрузки и ошибок
	if (!slug)
		return <div className='p-4 text-red-600'>Неверный URL — нет slug</div>
	if (loading) return <div className='p-4'>Загрузка...</div>
	if (error) return <div className='p-4 text-red-600'>{error}</div>
	if (!exhibition) return <div className='p-4'>Выставка не найдена</div>

	// Основной интерфейс редактора
	return (
		<div className='relative p-4 space-y-6'>
			<h1 className='text-3xl font-bold'>{exhibition.title}</h1>

			{exhibition.sections.map(section => (
				<div key={section.id} className='border p-4 rounded space-y-4'>
					<div className='flex items-center justify-between'>
						<h2 className='text-xl font-semibold'>{section.title}</h2>
						<div className='flex gap-2'>
							<button
								onClick={() => {
									setEditingSectionTitle(section)
									openModal()
								}}
								className='text-gray-600 hover:text-blue-600'
								title='Редактировать раздел'
							>
								<PencilIcon className='h-5 w-5' />
							</button>
							<button
								onClick={() => handleDeleteSection(section.id)}
								className='text-gray-600 hover:text-red-600'
								title='Удалить раздел'
							>
								<TrashIcon className='h-5 w-5' />
							</button>
						</div>
					</div>

					{section.content_blocks?.map(block => (
						<div
							key={block.id}
							className='p-4 bg-gray-50 rounded flex flex-col gap-2 relative group'
						>
							{/*Кнокпи*/}
							<div className='absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition'>
								<button
									onClick={() => {
										setEditingSection(section)
										setEditingBlock(block)
										setTimeout(() => setIsModalOpen(true), 10)
									}}
									className='text-gray-600 hover:text-blue-600'
									title='Редактировать'
								>
									<PencilIcon className='h-5 w-5' />
								</button>
								<button
									onClick={() => handleDeleteContent(section.id, block)}
									className='text-gray-600 hover:text-red-600'
									title='Удалить'
								>
									<TrashIcon className='h-5 w-5' />
								</button>
							</div>

							<div className='text-sm text-gray-500'>Тип: {block.type}</div>

							{block.type === 'text' && (
								<div
									className='prose max-w-none'
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(block.text_content || ''),
									}}
								/>
							)}

							{block.type === 'book' && (
								<div className='flex items-center space-x-4'>
									{bookDetails[block.book_id!]?.cover_url && (
										<img
											src={`http://82.202.137.19${
												bookDetails[block.book_id!].cover_url
											}`}
											alt={bookDetails[block.book_id!].title}
											className='w-16 h-24 object-cover rounded'
										/>
									)}
									<div>{bookDetails[block.book_id!]?.title}</div>
								</div>
							)}
						</div>
					))}

					<Button
						size='sm'
						variant='outline'
						onClick={() => {
							setEditingSection(section)
							setEditingBlock(null)
							openModal()
						}}
					>
						+ Контент
					</Button>
				</div>
			))}

			<div className='fixed bottom-10 right-10'>
				<Button
					onClick={() => {
						setEditingSection(null)
						setEditingBlock(null)
						setEditingSectionTitle(null)
						openModal()
					}}
					variant='primary'
				>
					+ Новый раздел
				</Button>
			</div>

			<Modal
				key={editingBlock ? `edit-${editingBlock.id}` : 'new-content'}
				isOpen={isModalOpen}
				onClose={closeModal}
				title={
					editingBlock
						? 'Редактировать контент'
						: editingSection
						? 'Добавить контент'
						: editingSectionTitle
						? 'Редактировать раздел'
						: 'Новый раздел'
				}
				size='full'
			>
				<div className='p-6'>
					{editingSection || editingBlock ? (
						<form
							className='space-y-4'
							onSubmit={e => {
								e.preventDefault()
								handleAddOrUpdateContent()
							}}
						>
							<select
								value={formType}
								onChange={e => setFormType(e.target.value as 'text' | 'book')}
								className='w-full p-2 border rounded'
							>
								<option value='text'>Текст</option>
								<option value='book'>Книга</option>
							</select>

							{formType === 'book' ? (
								<div className='space-y-4'>
									<BookSelector
										selectedBookId={bookId || null}
										onSelect={id => setBookId(id)}
									/>
									{bookId && (
										<div className='p-4 bg-gray-50 rounded'>
											Выбрана книга: {bookDetails[bookId]?.title}
										</div>
									)}
								</div>
							) : (
								<RichTextEditor
									key={
										editingBlock ? `editor-${editingBlock.id}` : 'new-editor'
									}
									content={htmlContent}
									onChange={setHtmlContent}
								/>
							)}

							<div className='flex gap-2 justify-end'>
								<Button variant='secondary' onClick={closeModal}>
									Отмена
								</Button>
								<Button type='submit' variant='primary'>
									{editingBlock ? 'Сохранить' : 'Добавить'}
								</Button>
							</div>
						</form>
					) : (
						<SectionForm
							initialData={editingSectionTitle}
							onSubmit={
								editingSectionTitle ? handleUpdateSection : handleCreateSection
							}
							onCancel={closeModal}
						/>
					)}
				</div>
			</Modal>
		</div>
	)
}

// Компонент формы для создания/редактирования разделов
function SectionForm({
	initialData,
	onSubmit,
	onCancel,
}: {
	initialData?: ExhibitionSection | null
	onSubmit: (data: Partial<ExhibitionSection>) => void
	onCancel: () => void
}) {
	// Поле вводится с начальным значением, если editingSectionTitle передан
	const [title, setTitle] = useState<string>(initialData?.title ?? '')
	return (
		<form
			className='space-y-4'
			onSubmit={e => {
				e.preventDefault()
				onSubmit({ title })
			}}
		>
			<input
				type='text'
				className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
				placeholder='Название раздела'
				value={title}
				onChange={e => setTitle(e.target.value)}
				required
			/>
			<div className='flex gap-2 justify-end'>
				<Button variant='secondary' onClick={onCancel}>
					Отмена
				</Button>
				<Button type='submit' variant='primary'>
					{initialData ? 'Сохранить' : 'Создать'}
				</Button>
			</div>
		</form>
	)
}
