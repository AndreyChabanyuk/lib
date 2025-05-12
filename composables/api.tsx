import axios from 'axios'

export const api = axios.create({
	baseURL: 'http://82.202.137.19/v2',
	timeout: 10000,
	headers: { 'Content-Type': 'application/json' },
})