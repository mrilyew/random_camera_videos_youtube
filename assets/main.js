let months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
]
let videos = {
    'count': 0,
    'cursor': 0,
    'items': [],
}
let queries = ['camera', 'img', 'dsc', 'bandicam', 'video', 'vid', 'movavi', 'gopro4', 'gopro7', 'nikon', 'samsung', 'videoregister']

function random_int(min = 0, max = 100) 
{
    return Math.round(Math.random() * (max - min) + min)
}

function makeMessagebox(title, body, width = 283, height = 123)
{
    $('#darker').addClass('shown')

    document.body.insertAdjacentHTML('afterbegin', `
        <div class="messagebox" style='min-height: ${height}px;min-width: ${width}px'>
            <div class='messagebox_header'>
                ${title}

                <span id='_cross'>x</span>
            </div>

            <div class='messagebox_body'>
                ${body}
            </div>
        </div>
    `)

    $('.messagebox #_cross').on('click', (e) => {
        $('#darker').removeClass('shown')
        $('.messagebox').remove()
    })
}

function escapeHtml(text) {
    let map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

class YouTube {
    hasToken() {
        return localStorage.yt_token != undefined
    }

    getToken() {
        return localStorage.yt_token
    }

    getCount() {
        let count = Number(localStorage.count ?? 50)

        if(count > 50 || count < 10) {
            return 50
        }

        return count
    }

    setCount(count) {
        if(count > 50 || count < 10) {
            localStorage.count = 50
            return
        }

        localStorage.count = count
    }

    getQueryString() {
        let queryi = localStorage.query_type != undefined ? localStorage.query_type : 'camera'

        if(queryi == 'random') {
            queryi = queries[random_int(0, queries.length - 1)]
        }

        let so_query = ''
        switch(queryi) {
            default:
            case 'camera':
                let numb = random_int(1343887200, 1449781140)
                let date = new Date(numb * 1024)
                so_query = `Видео с веб-камеры. Дата: ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} г.`
                break
            case 'img':
                let numberr = String(random_int(0, 1000)).padStart(4, '0')
                so_query = 'IMG ' + numberr
                break
            case 'dsc':
                let numberrr = String(random_int(0, 1000)).padStart(4, '0')
                so_query = 'DSC ' + numberrr
                break
            case 'bandicam':
                let dating = new Date(random_int(1266958800, Math.round(Date.now() / 1024)) * 1024)
                so_query = `bandicam ${dating.getFullYear()} ${String(dating.getMonth()).padStart(2, '0')} ${String(dating.getDate()).padStart(2, '0')}`
                
                break
            case 'video':
                let datingfcknjs = new Date(random_int(1208768777, Math.round(Date.now() / 1024)) * 1024)
                so_query = `video ${datingfcknjs.getFullYear()} ${String(datingfcknjs.getMonth()).padStart(2, '0')} ${String(datingfcknjs.getDate()).padStart(2, '0')}`
                break
            case 'vid':
                let datingfcknjs2 = new Date(random_int(1208768777, Math.round(Date.now() / 1024)) * 1024)
                so_query = `VID ${datingfcknjs2.getFullYear()}${String(datingfcknjs2.getMonth()).padStart(2, '0')}${String(datingfcknjs2.getDate()).padStart(2, '0')}`
                break
            case 'movavi':
                so_query = 'movavi video editor plus'
                break
            case 'gopro4':
                so_query = `GOPR${String(random_int(0, 1000)).padStart(4, '0')}`
                break
            case 'gopro7':
                so_query = `GH01${String(random_int(0, 1000)).padStart(4, '0')}`
                break
            case 'nikon':
                so_query = `DSCN${String(random_int(0, 1000)).padStart(4, '0')}`
                break
            case 'samsung':
                so_query = `SAM_${String(random_int(0, 1000)).padStart(4, '0')}`
                break
            case 'videoregister':
                let datingfcknjs3 = new Date(random_int(1208768777, 1650799247) * 1024)
                so_query = `ch${String(random_int(0, 10)).padStart(2, '0')} ${datingfcknjs3.getFullYear()}${String(datingfcknjs3.getMonth()).padStart(2, '0')}${String(datingfcknjs3.getDate()).padStart(2, '0')}`
                break
        }

        return so_query
    }

    search(query) {
        document.title = query

        $.ajax('https://www.googleapis.com/youtube/v3/search', {
            type: "GET",
            async: true,
            data: {
                'key': this.getToken(),
                'part': 'snippet',
                'q': query,
                'order': localStorage.query_type != 'videoregister' ? 'date' : 'title',
                'maxResults': this.getCount(),
                'type': 'video',
                'videoEmbeddable': 'true',
            },
            error: (data) => {
                makeMessagebox('Ошибка', `
                    <p>YouTube вернул ошибку. Сообщение:</p>
                    <p id='_txet' style='margin-top: 4px;'>${data.responseJSON.error.message}</p>
                    <input type="button" style='width: 100%;margin-top: 14px;' value='Сбросить токен' id='_resettoken'>
                `, 346) 
            },
            success: (data) => {
                videos.items = videos.items.concat(data.items)
                videos.count += 50
                videos.cursor += 1

                $('iframe')[0].setAttribute('src', 'https://www.youtube-nocookie.com/embed/' + videos.items[0].id.videoId + '?autoplay=1')
                this.moveNext()
            },
        })
    }

    setVideo(cursor) {
        $('iframe')[0].setAttribute('src', 'https://www.youtube-nocookie.com/embed/' + videos.items[cursor].id.videoId + '?autoplay=1')

        $('#_name')[0].innerHTML = videos.items[cursor].snippet.title
        $('#_desc')[0].innerHTML = videos.items[cursor].snippet.description
        $('#_date')[0].innerHTML = videos.items[cursor].snippet.publishTime
        $('#_channel')[0].innerHTML = videos.items[cursor].snippet.channelTitle
        $('#_channel')[0].href = 'https://youtube.com/channel/' + videos.items[cursor].snippet.channelId
    }

    moveNext() {
        if(videos.cursor >= videos.count) {
            this.search(this.getQueryString())
            return
        }

        this.setVideo(videos.cursor += 1)
    }

    moveBack() {
        if(videos.cursor - 1 <= 0) {
            return 0
        }

        this.setVideo(videos.cursor -= 1)
    }
}

window.youtube = new YouTube

if(!window.youtube.hasToken()) {
    makeMessagebox('Токен', `
        <p>Введи токен YouTube API.</p>
        <input type="text" id='_token' placeholder='Токен' style='margin-top: 5px;'>

        <div class='actions' style='margin-top: 5px;'>
            <input type="button" value="Ввести" id='_settoken' style='float: right;'>
        </div>
    `)

    $('#_cross').remove()
    
    $(document).on('click', '#_settoken', (e) => {
        if(!$('#_token')[0].value || $('#_token')[0].value.length < 5) return

        localStorage.setItem('yt_token', $('#_token')[0].value)
        location.reload()
    })
} else {
    window.youtube.search(window.youtube.getQueryString())
}

$(document).on('click', '#_resettoken', (e) => {
    localStorage.removeItem('yt_token')
    location.reload()
})

$(document).on('click', '#back_btn', (e) => {
    window.youtube.moveBack()
})

$(document).on('click', '#forward_btn', (e) => {
    window.youtube.moveNext()
})

$(document).on('click', '#history_btn', (e) => {
    makeMessagebox('Найденные видео', `
        <table class='vids' cellspacing="0"><tbody></tbody></table>
    `, 494, 364) 

    videos.items.forEach(vid => {
        $('.vids tbody')[0].insertAdjacentHTML('beforeend', `
        <tr class='item ${vid.id.videoId == videos.items[videos.cursor].id.videoId ? 'sel' : ''}'>
            <td>
                <img src="${vid.snippet.thumbnails.medium.url}">
            </td>
            <td style='width: 100%;padding-left: 9px;'>
                <div>
                    <a target='_blank' href='https://www.youtube.com/watch?v=${vid.id.videoId}'><p><b>${escapeHtml(vid.snippet.title)}</b></p></a>
                    <a target='_blank' href='https://www.youtube.com/channel/${vid.snippet.channelId}'><p>${escapeHtml(vid.snippet.channelTitle)}</p></a>
                    <p>${escapeHtml(vid.snippet.description)}</p>
                </div>
                
            </td>
        </tr>
        `)
    })
})

$(document).on('click', '#settings_btn', (e) => {
    makeMessagebox('Настройки', `
        <p>Запрос</p>
        <select id='query'>
            <option value='camera' ${localStorage.query_type == 'camera' ? 'selected' : ''}>Видео с веб-камеры. Дата: DD MM YYYY г.</option>
            <option value='img' ${localStorage.query_type == 'img' ? 'selected' : ''}>IMG XXXX</option>
            <option value='bandicam' ${localStorage.query_type == 'bandicam' ? 'selected' : ''}>bandicam YYYY MM DD</option>
            <option value='video' ${localStorage.query_type == 'video' ? 'selected' : ''}>video YYYY MM DD</option>
            <option value='vid' ${localStorage.query_type == 'vid' ? 'selected' : ''}>VID YYYY MM DD</option>
            <option value='movavi' ${localStorage.query_type == 'movavi' ? 'selected' : ''}>movavi video editor plus</option>
            <option value='gopro4' ${localStorage.query_type == 'gopro4' ? 'selected' : ''}>GOPRXXXX</option>
            <option value='gopro7' ${localStorage.query_type == 'gopro7' ? 'selected' : ''}>GH01XXXX</option>
            <option value='dsc' ${localStorage.query_type == 'dsc' ? 'selected' : ''}>DSC XXXX</option>
            <option value='nikon' ${localStorage.query_type == 'nikon' ? 'selected' : ''}>DSCNXXXX</option>
            <option value='samsung' ${localStorage.query_type == 'samsung' ? 'selected' : ''}>SAM_XXXX</option>
            <option value='videoregister' ${localStorage.query_type == 'videoregister' ? 'selected' : ''}>CHXX YYYY MM DD</option>
            <option value='random' ${localStorage.query_type == 'random' ? 'selected' : ''}>Случайно</option>
        </select>

        <p style='margin-top: 10px;'>Число видео</p>
        <input id='count' type="number" min='10' max='50' step='1' value='${window.youtube.getCount()}'>

        <p style='margin-top: 10px;'>Токен</p>
        <input id='_settoken' type="text" value='${localStorage.yt_token}' style='margin-top: 0px;'>
    `, 494, 364) 

    $('.messagebox #query').on('change', (e) => {
        localStorage.query_type = e.currentTarget.value
    })

    $('.messagebox #count').on('change', (e) => {
        window.youtube.setCount(e.currentTarget.value)
    })

    $('.messagebox #_settoken').on('change', (e) => {
        localStorage.yt_token = e.currentTarget.value
    })
})

$(document).keydown(function(e) {
    if(!$('#darker').hasClass('shown')) {
        if(e.keyCode === 37 || e.keyCode === 65) {
            window.youtube.moveBack()
        }
        
        if(e.keyCode === 39 || e.keyCode === 68) {
            window.youtube.moveNext()
        }

        if(e.keyCode === 32) {
            $('#history_btn').trigger('click')
        }
    }

    if(e.keyCode === 27) {
        $('#darker').removeClass('shown')
        $('.messagebox').remove()
    }
});
