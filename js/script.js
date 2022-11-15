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
const errorEl = document.querySelector('.app__error')
const loadingEl = document.querySelector('.app__loading')

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
			errorEl.style.display = 'none'
			loadingEl.style.display = 'none'

			//считаем кол-во страниц и ваводим в пагинацию
			const total = data.total
			const pages = Math.ceil(total / 10)
			
			for (let i = pages; i >= 1; i--) {
				paginationsEl.forEach(el => {
					el.insertAdjacentHTML('afterbegin', `
						<li class="app__pagination-item">
							<a href="?page=${i}" class="app__pagination-link ${i == queryParam ? 'app__pagination-link--current' : ''}">${i}</a>
						</li>
					`)
				})
			}
			return data
		})
		.then((data)=>{
			
			for (const item of data.releases) {
				console.log(item)

				let genresAll = ''
				let genres = item.genres
				genres.forEach(item =>{
					genresAll += item.genre + " "
				})

				const options = {
					month: 'long',
					day: 'numeric'

				}

				let date = new Date(item.releaseDate).toLocaleDateString('ru-RU', options)

				let duration = `${item.duration} ${declOfNum(item.duration, ['минута', 'минуты', 'минут'])}`

				appListEl.insertAdjacentHTML('afterbegin', `
					<li class="app__list-item">
					<article class="app__card movie-card">
						<a href="https://www.kinopoisk.ru/film/${item.filmId}" target="_blank" class="movie-card__link">
							<div class="movie-card__image-wrapper">
								<img src="${item.posterUrlPreview}" class="movie-card__image" alt="${!item.nameRu ? item.nameEn : item.nameRu}}" loading="lazy">
								<div class="movie-card__hover">
									<div class="movie-card__rating ${item.rating == null ? 'movie-card__rating--null' : ''}">${item.rating == null ? 'нет рейтинга' : item.rating.toFixed(1)}</div>
									<div class="movie-card__genres">${genresAll}</div>
									<div class="movie-card__duration ${item.duration == 0 ? 'movie-card__duration--hidden' : ''}">${duration}</div>
								</div>
							</div>
							<h2 class="movie-card__title">${!item.nameRu ? item.nameEn : item.nameRu}</h2>
							<div class="movie-card__date">${date}</div>
						</a>
					</article>
				</li>
				`)
			}
		})
		.catch(()=>{
			errorEl.style.display = 'block'
			loadingEl.style.display = 'none'
		})
}

initApp(queryParam)