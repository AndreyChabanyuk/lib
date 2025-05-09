'use client'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import useMyAxios from '@/composables/useMyAxios'
import Link from 'next/link'
import BackButton from '../Mybuttons/BackButton'


export const Header = () => {
	const [error, setError] = useState('') // исправлено: setError должна изменять значение [error, setError]
	const { request } = useMyAxios()
	const router = useRouter()
	const pathname = usePathname()
	console.log(pathname)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [roleAdmin, setRoleAdmin] = useState('')
	const isExhibitionPage = /^\/exhibitions\/[^/]+$/.test(pathname)
	// Убираем вызов localStorage здесь.
	useEffect(() => {
		// Проверяем, что мы в окружении браузера (хотя "use client" уже гарантирует клиентскую часть)
		if (typeof window !== 'undefined') {
			const authStatus = localStorage.getItem('is_authenticated')
			setIsAuthenticated(authStatus === 'true')
			const role = localStorage.getItem('role')
			if (role === 'reader') {
				setRoleAdmin(role)
			}
			// Добавляем обработчик события для обновления состояния при изменении localStorage
			const handleStorageChange = () => {
				const updatedAuthStatus = localStorage.getItem('is_authenticated')
				const updatedRole = localStorage.getItem('role')
				setIsAuthenticated(updatedAuthStatus === 'true')
				if (updatedRole === 'reader') {
					setRoleAdmin(updatedRole)
				}
			}

			window.addEventListener('storage', handleStorageChange)

			// Убираем обработчик при размонтировании компонента
			return () => {
				window.removeEventListener('storage', handleStorageChange)
			}
		}
	}, [])

	const logout = async (e: React.MouseEvent) => {
		e.preventDefault()

		try {
			const response = await request('users/logout', 'GET')
			if (response.status === 200) {
				alert('Вы успешно вышли из системы!')
				localStorage.setItem('is_authenticated', 'false')
				localStorage.removeItem('role')
				router.push('/auth/login')
			} else {
				setError('Ошибка: ' + response.data.message)
			}
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } }
			const errorMessage = err.response?.data?.message || 'Ошибка регистрации'
			setError(errorMessage)
			console.log(error)
		}
	}

	return (
		<div>
			<header className='py-5 px-5 flex flex-col md:flex-row justify-between items-center gap-4'>
				{/* Левая часть – заголовок */}
				<div>
					<h2 className='text-xl md:text-2xl text-center md:text-left'>
						Информационный библиотечный комплекс
					</h2>
				</div>
				{/* Правая часть – меню навигации */}
				<div className='flex flex-row items-center gap-2 md:gap-4 overflow-x-auto whitespace-nowrap'>
					<Link href='/' className='text-sm px-2 py-1 md:px-0 md:py-0'>
						Главная
					</Link>
					<BackButton
						className={
							isExhibitionPage
								? 'relative w-max text-sm  bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-md'
								: 'hidden'
						}
						name={'Вернуться к выставкам'}
					/>
					<Link
						href='/auth/register'
						className={
							isAuthenticated || isExhibitionPage
								? 'hidden'
								: 'w-max text-sm px-3 py-1 md:px-4 md:py-2 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-md'
						}
					>
						Регистрация
					</Link>

					<Link
						href='/exhibitions/create'
						className={
							isAuthenticated && roleAdmin && !isExhibitionPage
								? 'w-max text-sm px-3 py-1 md:px-4 md:py-2 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-md'
								: 'hidden'
						}
					>
						Новая выставка
					</Link>
					<Link
						href='/auth/login'
						className={
							isAuthenticated || isExhibitionPage
								? 'hidden'
								: 'w-max text-sm px-3 py-1 md:px-4 md:py-2 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-md'
						}
					>
						Войти
					</Link>
					<Button
						type='submit'
						className={
							isAuthenticated
								? 'w-max text-sm px-3 py-1 md:px-4 md:py-2'
								: 'hidden'
						}
						onClick={logout}
					>
						Выйти
					</Button>
				</div>
			</header>
		</div>
	)
}
