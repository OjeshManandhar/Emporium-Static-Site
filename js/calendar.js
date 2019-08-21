function monthName(date) {
    const monthList = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    return monthList[date.getMonth()];
}

function noOfDays(date) {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const year = date.getFullYear();
    const month = date.getMonth();

    if (((year%400 === 0) || (year%100 !== 0 && year%4 === 0)) && (month === 1)) {
        return 29;
    }

    return days[month];
}

function generateId(date, day) {
    var id = `${date.getFullYear()}-`;

    if ((date.getMonth() + 1) < 10) {
        id += `0${date.getMonth() + 1}-`;
    } else {
        id += `${date.getMonth() + 1}-`;
    }

    if (day < 10) {
        id += `0${day}-cal`;
    } else {
        id += `${day}-cal`;
    }

    return id;
}

function findNewsOnDate(date) {
    var news = null;

    date = date.replace('-cal', '');

    for (var key in newsEvents) {
        if (key === date) {
            news = newsEvents[key][0] + '\n\n' + newsEvents[key][1];
        }
    }
    return news;
}

function removeCalendar() {
    const newsCalendar = document.getElementById('calendar');
    var calendarContainer;

    for (var i = 0; i < newsCalendar.childNodes.length; i++) {
        if (newsCalendar.childNodes[i].className === "calendar-container") {
            calendarContainer = newsCalendar.childNodes[i];
          break;
        }        
    }

    newsCalendar.removeChild(calendarContainer);
}

function renderCalendar(date = new Date()) {
    const container = document.getElementById('calendar').appendChild(document.createElement('div'));
    container.classList.add('calendar-container');

    // const container = document.getElementById('calendar');
    // container.classList.add('calendar-container');

    // month-year
    const monthYear = container.appendChild(document.createElement('div'));
    monthYear.id = 'month-year';

    const prevMonth = monthYear.appendChild(document.createElement('dev'));
    prevMonth.className = 'prev-month';
    prevMonth.innerHTML = '<';
    prevMonth.addEventListener('click', function(e) {
        var prevMon;

        if (date.getMonth() === 0) {
            prevMon = new Date(date.getFullYear() - 1, 11, 1);
        } else {
            prevMon = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        }

        removeCalendar();
        renderCalendar(prevMon);

        removeNewsList();
        renderNewsList(prevMon);
    });

    const curYear = monthYear.appendChild(document.createElement('dev'));
    curYear.className = 'cur-month';
    const month = curYear.appendChild(document.createElement('div'));
    month.className = 'month';
    month.innerHTML = monthName(date);
    const year = curYear.appendChild(document.createElement('div'));
    year.className = 'year';
    year.innerHTML = date.getFullYear();

    const nextMonth = monthYear.appendChild(document.createElement('dev'));
    nextMonth.className = 'next-month';
    nextMonth.innerHTML = '>';
    nextMonth.addEventListener('click', function(e) {
        var nextMon;

        if (date.getMonth() === 11) {
            nextMon = new Date(date.getFullYear() + 1, 1, 1);
        } else {
            nextMon = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        }

        removeCalendar();
        renderCalendar(nextMon);

        removeNewsList();
        renderNewsList(nextMon);
    });

    // table
    const table = container.appendChild(document.createElement('table'));
    table.id = 'calendar-table';

    weekdays = table.appendChild(document.createElement('tr'));
    weekdays.className = 'weekdays';
    weekdays.appendChild(document.createElement('td')).innerHTML = 'Su';
    weekdays.appendChild(document.createElement('td')).innerHTML = 'Mo';
    weekdays.appendChild(document.createElement('td')).innerHTML = 'Tu';
    weekdays.appendChild(document.createElement('td')).innerHTML = 'We';
    weekdays.appendChild(document.createElement('td')).innerHTML = 'Th';
    weekdays.appendChild(document.createElement('td')).innerHTML = 'Fr';
    weekdays.appendChild(document.createElement('td')).innerHTML = 'Sa';

    let week, day, id;
    let prevMon, nextMon, prevMonDate, curMonDate, nextMonthDate;
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let sum = noOfDays(date) + firstDay;
    let noOfWeeks = Math.floor(sum/7);
    if (sum%7 !== 0) {
        noOfWeeks++;
    }

    if (date.getMonth() === 0) {
        prevMon = new Date(date.getFullYear() - 1, 11, 1);
    } else {
        prevMon = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    }
    prevMonDate = noOfDays(prevMon) - firstDay + 1;

    if (date.getMonth() === 11) {
        nextMon = new Date(date.getFullYear() + 1, 1, 1);
    } else {
        nextMon = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }
    nextMonthDate = 1;

    for (var i = 0; i < noOfWeeks*7; i++) {
        if (i%7 === 0) {
            week = table.appendChild(document.createElement('tr'));
            week.className = 'day';
        }

        if (i < firstDay) {
            id = generateId(prevMon, prevMonDate);
            day = week.appendChild(document.createElement('td'));
            day.innerHTML = prevMonDate++;
            day.className = 'disable';
        } else if (i < sum) {
            curMonDate = i - firstDay + 1;
            id = generateId(date, curMonDate);
            day = week.appendChild(document.createElement('td'));
            day.innerHTML = curMonDate;

            var newDate = new Date();
            // dosent work as it compares time also
            // if (new Date() === new Date(date.getFullYear(), date.getMonth(), curMonDate)) {
            if (
                newDate.getFullYear() === date.getFullYear() &&
                newDate.getMonth() === date.getMonth() &&
                newDate.getDate() === curMonDate
            ) {
                day.className = 'active';
            }
        } else {
            id = generateId(nextMon, nextMonthDate);
            day = week.appendChild(document.createElement('td'));
            day.innerHTML = nextMonthDate++;
            day.className = 'disable';
        }

        day.id = id;
        day.addEventListener('click', function(e) {
            // alert(findNewsOnDate(this.id)? findNewsOnDate(this.id) : "No news");
            showNewsOfDate(this.id);
        });
    }
}

function removeNewsList() {
    const parent = document.getElementById('news-listings');
    var child;

    for (var i = 0; i < parent.childNodes.length; i++) {
        if (
            parent.childNodes[i].className === 'no-news' || 
            parent.childNodes[i].className === 'news-list'

        ) {
            child = parent.childNodes[i];
            break;
        }        
    }

    parent.removeChild(child);
}

function showNewsOfDate(id) {
    const newsId = id.replace('-cal', '-news');

    // No news for the current month i.e. no div with class 'news-list'
    if (document.getElementsByClassName('news-list').length === 0) {
        return;
    }

    var parent = document.getElementById(newsId);
    var child;

    // Disable already active main-news
    child = document.getElementsByClassName('main-news-active');
    if (child.length !== 0) {
        child[0].classList.replace('main-news-active', 'main-news-inactive');
    }

    // Making selected date's news active
    if (parent === null) {
        return;
    }

    for (var i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i].classList.contains('main-news-inactive')) {
            child = parent.childNodes[i];
            break;
        }
    }
    child.classList.replace('main-news-inactive', 'main-news-active');
}

function renderNewsList(date = new Date()) {
    const newsList = [];
    var monthStr = `${date.getFullYear()}-`;

    if ((date.getMonth() + 1) < 10) {
        monthStr += `0${date.getMonth() + 1}`;
    } else {
        monthStr += `${date.getMonth() + 1}`;
    }

    for (var key in newsEvents) {
        if (key.indexOf(monthStr) > -1) {
            newsList.push({
                key: key,
                news: [newsEvents[key][0], newsEvents[key][1]]
            });
        }
    }

    const news = document.getElementById('news-listings').appendChild(document.createElement('div'));

    if (newsList.length === 0) {
        // console.log('No news Found');

        news.className = 'no-news';
        news.innerHTML = `No news for ${monthName(date)}`; 
    } else {
        // console.log('newsList:', newsList);
        
        news.className = 'news-list';

        for (let i = 0; i < newsList.length; i++) {
            let newsSingle = news.appendChild(document.createElement('div'));
            newsSingle.id = `${newsList[i].key}-news`;
            newsSingle.className = 'news-single';
            // newsSingle.innerHTML = newsList[i].key;

            const heading = newsSingle.appendChild(document.createElement('div'));
            heading.className = 'heading';
            heading.innerHTML = newsList[i].news[0];

            const mainNews = newsSingle.appendChild(document.createElement('div'));
            mainNews.classList.add('main-news');
            // To keep main-news hidden
            mainNews.classList.add('main-news-inactive');
            mainNews.innerHTML = newsList[i].news[1];

            // To make main-news visible
            // mainNews.classList.remove('main-news-inactive');
        }

        // showNewsOfDate(generateId(date, date.getDate()));
    }
}

renderCalendar();
renderNewsList();