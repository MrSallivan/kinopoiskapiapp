//massive with month
// массивы с месяцами
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
const monthsRu = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// склонение числительных
const declOfNum = (number, titles) => {
	let cases = [2, 0, 1, 1, 1, 2];
	return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

// глобальные константы для API, определения года и месяца
const API_KEY = "62074443-9013-4093-b177-272650f4049f"
const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()
const currentMonthText = months[currentMonth].toUpperCase()
const currentMonthRu = monthsRu[currentMonth]


//Определение query параметра
const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
})

let queryParam = params.page

if (!queryParam) {
	queryParam = 1
	history.pushState(null, null, '?page=1')
}

const appListEl = document.querySelector('.app__list')
const yearEl = document.querySelector('.year')
const monthEl = document.querySelector('.month')
const paginationsEl = document.querySelectorAll('.app__pagination')

yearEl.textContent = currentYear
monthEl.textContent = currentMonthText


const initApp = (page = 1) => {
	const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${currentYear}&month=${currentMonthText}&page=${page}`
	fetch(url, {
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": API_KEY,
		}
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data)
			//считаем кол-во страниц и ваводим в пагинацию

			const total = data.total
			const pages = Math.ceil(total / 10)

			for (let i = pages; i >= 1; i--) {
				paginationsEl.forEach(el => {
					el.insertAdjacentHTML('afterbegin', `
						<li class="app__pagination-item">
							<a href="?page=${i}" class="app__pagination-link">${i}</a>
						</li>
					`)
				})
			}
		})
}

initApp(queryParam)