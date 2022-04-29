const $ = require( "jquery" );
const Timer = require("easytimer.js").Timer;

const timer = new Timer();

const htmlTimer = $('#auction-timer')[0]
console.log()

timer.start({countdown: true, startValues: {
  days: htmlTimer.dataset.days,
  hours: htmlTimer.dataset.hours,
  minutes: htmlTimer.dataset.minutes,
  seconds: htmlTimer.dataset.seconds,
}});

$('#auction-timer').html(`${timer.getTimeValues().days}:${timer.getTimeValues().toString()}`);

timer.addEventListener('secondsUpdated', function (e) {
  const timeString = `${timer.getTimeValues().days}:${timer.getTimeValues().toString()}`
    $('#auction-timer').html(timeString);
});

timer.addEventListener('targetAchieved', function (e) {
    $('#auction-timer').html('Auction closed!!');
});


const logout = document.querySelector('#logout')

if (logout) {
  logout.addEventListener('submit', async e => {
    e.preventDefault()
  
    fetch('/users/logout', {
      method: 'DELETE',
    }).then(() => location.href = '/')
  })
}
