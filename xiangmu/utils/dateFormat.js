const FORMATSTR = [
    'YYYYMMDD',
    'YYYY-MM-DD',
]


const curDay = (formatStr) => {
    let curDate = new Date();
    const year = curDate.getFullYear();
    const month = curDate.getMonth() + 1 < 10 ? '0' + (curDate.getMonth() + 1) : curDate.getMonth() + 1;
    const day = curDate.getDate() < 10 ? '0' + curDate.getDate() : curDate.getDate();

    let date = '';
    switch (formatStr) {
        case 'YYYYMMDD':
            date = year + '' + month + day
            break;
        case 'YYYY-MM-DD':
            date = [year, month, day].join('-')
        default:
            date = [year, month, day].join('-')
            break;
    }

    return date;
}
module.exports = {
    FORMATSTR: FORMATSTR,
    curDay: curDay,
}

