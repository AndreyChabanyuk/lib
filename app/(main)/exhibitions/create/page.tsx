'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

const CreateExhibition = () => {
	const [title, setTitle] = useState('')
	const [mainText, setMainText] = useState('')

	return (
		<div>
			<form className='flex-1 flex flex-col gap-4'>
				<div className='space-y-2'>
					<Label htmlFor='email'>Заголовок</Label>
					<Input
						id='text'
						type='text'
						onChange={e => setTitle(e.target.value)}
						placeholder='Заголовок'
					/>
				</div>

				<div className='space-y-2'>
					<div className='flex items-center'>
						<Label htmlFor='password'>Описание</Label>
					</div>
					<textarea
						id='main-text'
						type='text'
						onChange={e => setMainText(e.target.value)}
						placeholder='Введите пароль'
						required
					/>
				</div>

				{error && <p className='text-red-500'>{error}</p>}

				<div className='mt-auto space-y-4'>
					<Button type='submit' className='w-full' size='lg'>
						Войти
					</Button>
					<p className='text-center text-sm'>
						Нет учетной записи?{' '}
						<Link href='/auth/register' className='font-bold underline'>
							Зарегистрируйтесь
						</Link>
					</p>
				</div>
			</form>
		</div>
	)
}

export default CreateExhibition
