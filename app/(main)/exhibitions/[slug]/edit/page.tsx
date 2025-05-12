'use client'

import BookSelector from '@/components/shared/BookSelector'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import {
	ContentBlock,
	ExhibitionSection,
	ExhibitionType,
} from '@/interfaces/exhibition'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BookInfo {
	id: number
	title: string
	cover_url?: string
}

const api = axios.create({
	baseURL: 'http://82.202.137.19/v2',
	timeout: 10000,
	headers: { 'Content-Type': 'application/json' },
})

export default function ExhibitionEditor() {
	const { slug } = useParams() as { slug?: string }

	const [exhibition, setExhibition] = useState<ExhibitionType | null>(null)
	const [bookDetails, setBookDetails] = useState<Record<number, BookInfo>>({})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingSection, setEditingSection] =
		useState<ExhibitionSection | null>(null)
	const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
	const [editingSectionTitle, setEditingSectionTitle] =
		useState<ExhibitionSection | null>(null)

	const [formType, setFormType] = useState<'text' | 'book'>('text')
	const [textContent, setTextContent] = useState('')
	const [bookId, setBookId] = useState<number | ''>('')

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

	useEffect(() => {
		if (!exhibition) return
		const ids = Array.from(
			new Set(
				exhibition.sections
					.flatMap(s => s.content_blocks || [])
					.filter(b => b.type === 'book')
					.map(b => b.book_id!)
			)
		)

		const fetchBookDetails = async (id: number) => {
      console.log("[FRONTEND] Fetching book ID:", id);
			try {
				const response = await api.get<BookInfo>(`/library/books/${id}`);
        console.log("[FRONTEND] Response:", response.data);
				setBookDetails(prev => ({ ...prev, [id]: response.data }))
			} catch (error) {
				console.error('Error fetching book details:', error)
			}
		}

		ids.forEach(id => {
			if (!bookDetails[id]) {
				fetchBookDetails(id)
			}
		})
	}, [exhibition])

	useEffect(() => {
		loadExhibition()
	}, [slug])

	const handleCreateSection = (data: Partial<ExhibitionSection>) => {
		if (!slug) return
		setLoading(true)
		api
			.post(`/exhibitions/${slug}/sections`, data)
			.then(() => {
				loadExhibition()
				setIsModalOpen(false)
			})
			.catch(err =>
				setError(err.response?.data?.detail || 'Ошибка создания раздела')
			)
			.finally(() => setLoading(false))
	}

	const handleUpdateSection = (data: Partial<ExhibitionSection>) => {
		if (!slug || !editingSectionTitle) return
		setLoading(true)
		api
			.put(`/exhibitions/${slug}/sections/${editingSectionTitle.id}`, data)
			.then(() => {
				loadExhibition()
				setIsModalOpen(false)
				setEditingSectionTitle(null)
			})
			.catch(err =>
				setError(err.response?.data?.detail || 'Ошибка обновления раздела')
			)
			.finally(() => setLoading(false))
	}

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

	const handleAddOrUpdateContent = () => {
		if (!slug || !editingSection) return
		if (formType === 'book' && !bookId) {
			setError('Выберите книгу')
			return
		}
		const data: any = {
			type: formType,
			text_content: formType === 'text' ? textContent : null,
			book_id: formType === 'book' ? Number(bookId) : null,
		}

		setLoading(true)
		const method = editingBlock ? 'put' : 'post'
		const url = editingBlock
			? `/exhibitions/${slug}/sections/${editingSection.id}/content/${editingBlock.id}`
			: `/exhibitions/${slug}/sections/${editingSection.id}/content`

		api[method](url, data)
			.then(() => {
				loadExhibition()
				setIsModalOpen(false)
				setEditingBlock(null)
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
			setFormType(editingBlock.type)
			setTextContent(editingBlock.text_content || '')
			setBookId(editingBlock.book_id || '')
		} else {
			setFormType('text')
			setTextContent('')
			setBookId('')
		}
	}, [editingBlock])

	if (!slug)
		return <div className='p-4 text-red-600'>Неверный URL — нет slug</div>
	if (loading) return <div className='p-4'>Загрузка...</div>
	if (error) return <div className='p-4 text-red-600'>{error}</div>
	if (!exhibition) return <div className='p-4'>Выставка не найдена</div>

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
									setIsModalOpen(true)
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
							<div className='absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition'>
								<button
									onClick={() => {
										setEditingSection(section)
										setEditingBlock(block)
										setIsModalOpen(true)
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

							{block.type === 'text' && <div>{block.text_content}</div>}

							{block.type === 'book' && (
								<div className='flex items-center space-x-4'>
									{bookDetails[block.book_id!]?.image_url && (
										<img
											src={`http://82.202.137.19${bookDetails[block.book_id!].image_url}`}
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
							setIsModalOpen(true)
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
						setIsModalOpen(true)
					}}
					variant='primary'
				>
					+ Новый раздел
				</Button>
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false)
					setEditingBlock(null)
					setEditingSectionTitle(null)
				}}
				title={
					editingBlock
						? 'Редактировать контент'
						: editingSection
						? 'Добавить контент'
						: editingSectionTitle
						? 'Редактировать раздел'
						: 'Новый раздел'
				}
				size='lg'
			>
				<div className='p-6'>
					{editingSection ? (
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
								<textarea
									value={textContent}
									onChange={e => setTextContent(e.target.value)}
									className='w-full p-2 border rounded'
									placeholder='Введите текст'
								/>
							)}

							<div className='flex gap-2 justify-end'>
								<Button
									variant='secondary'
									onClick={() => setIsModalOpen(false)}
								>
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
							onCancel={() => {
								setIsModalOpen(false)
								setEditingSectionTitle(null)
							}}
						/>
					)}
				</div>
			</Modal>
		</div>
	)
}

function SectionForm({
	initialData,
	onSubmit,
	onCancel,
}: {
	initialData?: ExhibitionSection | null
	onSubmit: (data: Partial<ExhibitionSection>) => void
	onCancel: () => void
}) {
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
