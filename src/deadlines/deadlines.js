//TUI CALENDAR INITIALIZATION
var cal = new tui.Calendar('#calendar', {
    defaultView: 'week', // weekly view option
});

var options = cal.getOptions();
options.week.hourStart = 8;
options.week.hourEnd = 19;
options.week.startDayOfWeek = 1;
options.week.daynames = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"]
options.month.startDayOfWeek = 1;
options.month.daynames = options.week.daynames
options.taskView = false
cal.setOptions(options, true)
cal.changeView(cal.getViewName(), true);


//CALENDAR LIST
function CalendarInfo() {
    this.id = null;
    this.name = null;
    this.checked = true;
    this.color = null;
    this.bgColor = null;
    this.borderColor = null;
}

//SCHEDULES
function ScheduleInfo() {
    this.id = null;
    this.calendarName = null;
    this.calendarId = null;

    this.title = null;
    this.body = null;
    this.isAllday = false;
    this.start = null;
    this.end = null;
    this.category = 'time';
    this.dueDateClass = '';

    this.color = null;
    this.bgColor = null;
    this.dragBgColor = null;
    this.borderColor = null;
    this.customStyle = '';

    this.isFocused = false;
    this.isPending = false;
    this.isVisible = true;
    this.isReadOnly = true;
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


function getDataAction(target) {
    return target.dataset ? target.dataset.action : target.getAttribute('data-action');
}
  
function setDropdownCalendarType() {
    var calendarTypeName = document.getElementById('calendarTypeName');
    var calendarTypeIcon = document.getElementById('calendarTypeIcon');
    var options = cal.getOptions();
    var type = cal.getViewName();
    var iconClassName;
  
    if (type === 'day') {
      type = 'Daily';
      iconClassName = 'calendar-icon ic_view_day';
    } else if (type === 'week') {
      type = 'Weekly';
      iconClassName = 'calendar-icon ic_view_week';
    } else if (options.month.visibleWeeksCount === 2) {
      type = '2 weeks';
      iconClassName = 'calendar-icon ic_view_week';
    } else if (options.month.visibleWeeksCount === 3) {
      type = '3 weeks';
      iconClassName = 'calendar-icon ic_view_week';
    } else {
      type = 'Monthly';
      iconClassName = 'calendar-icon ic_view_month';
    }
  
    calendarTypeName.innerHTML = type;
    calendarTypeIcon.className = iconClassName;
}

function onClickMenu(e) {
    var target = $(e.target).closest('a[role="menuitem"]')[0];
    var action = getDataAction(target);
    toggleView(action)
}

function toggleView(action) {
    console.log('Showing view ' + action)

    var options = cal.getOptions();
    var viewName = '';
    var dropdownTitle = ''
  
    switch (action) {
      case 'toggle-daily':
        viewName = 'day';
        dropdownTitle = 'Diário'
        break;
      case 'toggle-weekly':
        viewName = 'week';
        dropdownTitle = 'Semanal'
        break;
      case 'toggle-monthly':
        options.month.visibleWeeksCount = 0;
        viewName = 'month';
        dropdownTitle = 'Mensal'
        break;
      case 'toggle-weeks2':
        options.month.visibleWeeksCount = 2;
        viewName = 'month';
        dropdownTitle = '2 Semanas'
        break;
      default:
        break;
    }
  
    cal.setOptions(options, true);
    cal.changeView(viewName, true);
  
    setDropdownCalendarType();
    checkDataAndUpdateCalendarView();

    var dropdown = document.getElementById('calendarTypeName');
    dropdown.innerText = dropdownTitle
}

function onClickNavi(e) {
    var action = getDataAction(e.target);
  
    switch (action) {
      case 'move-prev':
        cal.prev();
        break;
      case 'move-next':
        cal.next();
        break;
      case 'move-today':
        cal.today();
        break;
      default:
        return;
    }
  
    checkDataAndUpdateCalendarView();
}

//SET EVENT LISTENERS
$('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
$('#menu-navi').on('click', onClickNavi);
window.addEventListener('resize', function() {
    cal.render();
});
var spinner = new Spinner().spin();

function setRenderRangeText() {
    var renderRange = document.getElementById('renderRange');
    var options = cal.getOptions();
    var viewName = cal.getViewName();
    var html = [];
    if (viewName === 'day') {
        html.push(moment(cal.getDate().getTime()).format('DD/MM/YYYY'));
    } else if (viewName === 'month' &&
        (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
        html.push(moment(cal.getDate().getTime()).format('MM/YYYY'));
    } else {
        html.push(moment(cal.getDateRangeStart().getTime()).format('DD/MM'));
        html.push(' ~ ');
        html.push(moment(cal.getDateRangeEnd().getTime()).format('DD/MM/YYYY'));
    }
    renderRange.innerHTML = html.join('');
}


function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

function resolveCalendars(schedules) {
    calendars = []
    for(i=0;i<schedules.length;i++) {
        schedule = schedules[i]

        //find existing calendar
        calendar = null
        for(c=0;c<calendars.length;c++) {
            if(calendars[c].name==schedule.calendarName) {
                calendar = calendars[c]
            }
        }

        if(calendar==null) {
            rgb = intToRGB(hashCode(schedule.calendarName))
            calendar = new CalendarInfo();
            calendar.id = chance.guid();
            calendar.name = schedule.calendarName;
            calendar.color = '#ffffff';
            calendar.bgColor = '#' + rgb;
            calendar.dragBgColor = '#' + rgb;
            calendar.borderColor = '#' + rgb;
            calendars.push(calendar);
        }

        schedule.calendarId = calendar.id
        schedule.bgColor = calendar.bgColor
        schedule.borderColor = calendar.borderColor
        schedule.color = calendar.color
        schedule.dragBgColor = calendar.dragBgColor
    }
    return calendars;
}

//update schedules
function updateView(schedules) {
    console.log('updateView()')
    console.log(schedules)
    calendars = resolveCalendars(schedules)

    //update calendar legend view
    var calendarList = document.getElementById('calendarList');
    var html = [];
    calendars.forEach(function(calendar) {
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
    // cal.setCalendars(calendars);
    cal.createSchedules(schedules);
    if (cal.getViewName() !== 'month') {
        cal.scrollToNow();
    }
    cal.render(true);
    setRenderRangeText();
    document.getElementById('spinnerDiv').innerHTML = '';
    console.log("CALENDAR UPDATED")
}


function getSchedules(idStore, dateFrom, dateTo, success, error) {
    var knownSchedules = new Map()

    fetchContratosWithEventsInPeriod(idStore, dateFrom, dateTo, function(contratos) {
        console.log("CONTRATOS -> SCHEDULES")
        console.log(contratos)
        schedules = []
        for(i=0; i<contratos.length; i++) {
            contrato = contratos[i]
            bestContratoTag = "#sem notas"

            for(a=0; a<contrato.items.length; a++) {
                item = contrato.items[a]

                tag = item.notas
                if(!tag || tag.trim()=="") {
                    tag = "#sem notas"
                } else {
                    t = tag.match(/([\#a-zA-Z0-9]+)/)
                    if(t.length==2) {
                        tag = t[1]
                    }
                    bestContratoTag = tag
                }

                //add prova to calendar
                schedule = new ScheduleInfo()
                schedule.id = chance.guid()
                schedule.calendarName = tag
                schedule.title = "[PROVA] " + contrato.name + " " + tag
                schedule.body = schedule.title
                schedule.start = item.provaDate
                schedule.end = moment(schedule.start).add(60, 'minutes').toDate()
                schedule.category = 'time'
                schedules.push(schedule)

                //add retirada to calendar
                schedule = new ScheduleInfo()
                schedule.id = chance.guid()
                schedule.calendarName = tag
                schedule.title = "[RETIRADA] " + contrato.name + " " + tag
                schedule.body = schedule.title
                schedule.category = 'allday'
                schedule.isAllDay = true
                schedule.start = item.retiradaDate
                schedule.end = moment(schedule.start).add(60, 'minutes').toDate()
                k = schedule.title + "-" + schedule.start
                if(knownSchedules.get(k)==null) {
                    knownSchedules.set(k, true)
                    schedules.push(schedule)
                } else {
                    console.log("Ignoring " + k + " because it already exists")
                }
            }

            //add evento to calendar
            schedule = new ScheduleInfo()
            schedule.id = chance.guid()
            schedule.calendarName = bestContratoTag
            schedule.title = "[EVENTO] " + contrato.name
            schedule.body = schedule.title
            schedule.start = contrato.eventoDate
            schedule.end = moment(schedule.start).add(60, 'minutes').toDate()
            schedule.category = 'allday'
            schedule.isAllDay = true
            schedules.push(schedule)
        }
        
        success(schedules)
    }, error)
}

//GET SCHEDULES FROM WEBLOCACAO AND UPDATE VIEW
var currentTimeoutHandle = null
function checkDataAndUpdateCalendarView() {
    setRenderRangeText();
    dateFrom = cal.getDateRangeStart().getTime()
    dateTo = cal.getDateRangeEnd().getTime()

    document.getElementById('spinnerDiv').appendChild(spinner.el);
    getSchedules(idStore, dateFrom, dateTo, function (schedules) {
        console.log("Got " + schedules.length + " schedules")
        updateView(schedules)
        if(currentTimeoutHandle!=null) {
            clearTimeout(currentTimeoutHandle)
        }
        currentTimeoutHandle = setTimeout(checkDataAndUpdateCalendarView, 3600000);

    }, function(err) {
        console.error("checkData(): " + err)
        //TODO: SHOW ERROR ON SCREEN
        // alert("ERROR: " + err)
        // updateView([])
        setTimeout(function() {
            console.log("ERROR FOUND. RELOADING WINDOW")
            location.reload()
        }, 5000)
    })
}

var currentView = 0
currentFlipTimeoutHandle = null

function flipViews() {

    var viewtime = 5 * 60000

    if(currentView==0) {
        action = 'toggle-weekly'
        viewtime = $WEEKLY_VIEW_TIME * 60000
    } else if(currentView==1) {
        action = 'toggle-weeks2'
        viewtime = $WEEKLY2_VIEW_TIME * 60000
    } else if(currentView==2) {
        action = 'toggle-monthly'
        viewtime = $MONTHLY_VIEW_TIME * 60000
    // } else if(currentView==3) {
    //     action = 'toggle-daily'
    //     viewtime = 1 * 60000
        currentView = -1
    }
    console.log('CURRENT VIEW ' + currentView)
    currentView++

    toggleView(action)

    if(currentFlipTimeoutHandle!=null) {
        clearTimeout(currentFlipTimeoutHandle)
    }
    currentFlipTimeoutHandle = setTimeout(flipViews, viewtime);
}

//GET ID STORE
idStore = -1
getStoreID(function(idSt) {
    idStore = idSt
    console.log("idStore=" + idStore)

    //start updating calendar schedules
    cal.today()
    flipViews()

    //full reload once a day
    setTimeout(function() {
        console.log("FULL RELOADING ONCE A DAY")
        location.reload()
    }, 24*60*60*1000)

}, function(err) {
    console.error(err)
})

