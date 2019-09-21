//TUI CALENDAR INITIALIZATION
var cal = new tui.Calendar('#calendar', {
    defaultView: 'week', // weekly view option
});

var options = cal.getOptions();
options.week.startDayOfWeek = 1;
options.week.daynames = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"]
cal.setOptions(options, true)
cal.changeView(cal.getViewName(), true);


//CALENDAR LIST
var CalendarList = [];
function CalendarInfo() {
    this.id = null;
    this.name = null;
    this.checked = true;
    this.color = null;
    this.bgColor = null;
    this.borderColor = null;
}

//SCHEDULES
var ScheduleList = [];

function ScheduleInfo() {
    this.id = null;
    this.calendarId = null;

    this.title = null;
    this.body = null;
    this.isAllday = false;
    this.start = null;
    this.end = null;
    this.category = '';
    this.dueDateClass = '';

    this.color = null;
    this.bgColor = null;
    this.dragBgColor = null;
    this.borderColor = null;
    this.customStyle = '';

    this.isFocused = false;
    this.isPending = false;
    this.isVisible = true;
    this.isReadOnly = false;
    this.goingDuration = 0;
    this.comingDuration = 0;
    this.recurrenceRule = '';

    this.raw = {
        memo: '',
        hasToOrCc: false,
        hasRecurrenceRule: false,
        location: null,
        class: 'public', // or 'private'
        creator: {
            name: '',
            avatar: '',
            company: '',
            email: '',
            phone: ''
        }
    };
}

//update schedules
function updateView(schedules) {

    console.log('updateView() ' + schedules)

    //update calendars
    var calendar;
    var id = 0;

    calendar = new CalendarInfo();
    id += 1;
    calendar.id = String(id);
    calendar.name = 'My Calendar';
    calendar.color = '#ffffff';
    calendar.bgColor = '#9e5fff';
    calendar.dragBgColor = '#9e5fff';
    calendar.borderColor = '#9e5fff';
    CalendarList.push(calendar);

    //update calendar legend view
    var calendarList = document.getElementById('calendarList');
    var html = [];
    CalendarList.forEach(function(calendar) {
        html.push('<div class="lnb-calendars-item"><label>' +
            '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
            '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
            '<span>' + calendar.name + '</span>' +
            '</label></div>'
        );
    });
    calendarList.innerHTML = html.join('\n');

    //update tui calendar view
    cal.clear();
    cal.setCalendars(CalendarList);
    cal.createSchedules(ScheduleList);
    cal.render(true);
}


function getSchedules(idStore, dateFrom, dateTo, success, error) {
    //TODO: check for updated provas before in order to avoid too much pressure on fetch contratos
    fetchContratosWithEventsInPeriod(idStore, dateFrom, dateTo, success, error)
}
    
//GET SCHEDULES FROM WEBLOCACAO AND UPDATE VIEW
function checkDataAndUpdateCalendarView() {
    dateFrom = cal.getDateRangeStart().getTime()
    dateTo = cal.getDateRangeEnd().getTime()

    getSchedules(idStore, dateFrom, dateTo, function (schedules) {
        console.log("Got " + schedules.length + " schedules")
        updateView(schedules)

    }, function(err) {
        console.error("checkData(): " + err)
        //TODO: SHOW ERROR ON SCREEN
        updateView([])
    })
}


//GET ID STORE
idStore = -1
getStoreID(function(idSt) {
    idStore = idSt
    console.log("idStore=" + idStore)

    //start updating calendar schedules
    checkDataAndUpdateCalendarView();
    setTimeout(checkDataAndUpdateCalendarView, 30000);
    
}, function(err) {
    console.error(err)
})
