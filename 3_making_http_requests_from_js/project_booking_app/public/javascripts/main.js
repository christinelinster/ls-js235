class TimeoutError extends Error {
  constructor(message = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

class BookingAppUI {
  constructor() {
    this.schedulesDiv = document.querySelector('#schedules');
    this.newStaffForm = document.querySelector('#add_staff');

    this.addScheduleBtn = document.querySelector('#btnAdd');
    this.newScheduleForm = document.querySelector('#add_schedule');

    this.schedules = null;
    this.scheduleTally = null;
    this.staffMembers = null;
    this.scheduleCount = 0;

    this.main();
  }

  withTimeout(promise, delay) {
    let timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new TimeoutError()), delay)
    })

    return Promise.race([promise, timeoutPromise])
  }

  async fetchSchedules() {
    try {
      let response = await this.withTimeout(fetch('/api/schedules'), 5000)
      let data = await response.json();
      if (data) {
        this.schedules = data;
      }

    } catch (e) {
      if (e instanceof TimeoutError) {
        alert('It is taking longer than usual, please try again later.');
      } else {
        console.error(e)
      }
    } finally {
      alert('The request is completed.')
    }
  }

  tallySchedules() {
    let count = {}
    if (!this.schedules) return;

    this.schedules.forEach(({ staff_id }) => {
      let key = `staff ${staff_id}`
      count[key] = (count[key] || 0) + 1;
    })
    this.scheduleTally = count;
  }


  alertScheduleTally() {
    if (!this.schedules) return;

    if (this.schedules.length === 0) {
      alert('No schedules available for booking.')
    } else {
      this.tallySchedules();
      alert(Object.entries(this.scheduleTally).map(([id, count]) => `${id}: ${count}`).join('\n'))
    }
  }


  async fetchStaff() {
    try {
      let response = await fetch('/api/staff_members')
      let data = await response.json()

      if (data) {
        this.staffMembers = data;
      }

    } catch (e) {
      console.error(e)
    }
  }

  async handleAddStaff(event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    let json = JSON.stringify(Object.fromEntries(formData.entries()))

    let response = await fetch(`${form.action}`, {
      method: form.method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: json
    })

    if (response.status === 201) {
      let data = await response.json();
      alert(`Sucessfully created staff with id: ${data.id}`)
    } else if (response.status === 400) {
      alert('Staff can not be created. Check your inputs.')
    }
  }

  addScheduleTemplate() {
    this.scheduleCount = this.schedulesDiv.children.length + 1;

    let options = this.staffMembers.map(staff =>
      `<option value=${staff.id}>${staff.name}</option>`
    ).join('')

    let template = `<fieldset id="schedule_${this.scheduleCount}">
        <legend>Schedule ${this.scheduleCount}</legend>

        <div>
          <label for="staff_${this.scheduleCount}">Staff Name:</label>
          <select id="staff_${this.scheduleCount}" name="staff_${this.scheduleCount}">
            ${options}
          </select>
        </div>

        <div>
          <label for="date_${this.scheduleCount}">Date:</label>
          <input type="text" id="date_${this.scheduleCount}" name="date_${this.scheduleCount}" placeholder="mm-dd-yy">
        </div>

        <div>
          <label for="time_${this.scheduleCount}">Time:</label>
          <input type="text" id="time_${this.scheduleCount}" name="time_${this.scheduleCount}" placeholder="hh:mm">
        </div>

      </fieldset>`

    this.schedulesDiv.insertAdjacentHTML('beforeend', template)
  }

  async handleAddSchedule(event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    let objEntries = Object.fromEntries(formData.entries())

    let schedules = []

    for (let i = 1; i <= this.scheduleCount; i++) {
      let newSchedule = {}
      newSchedule['staff_id'] = objEntries[`staff_${i}`]
      newSchedule['date'] = objEntries[`date_${i}`]
      newSchedule['time'] = objEntries[`time_${i}`]

      schedules.push(newSchedule)
    }

    let json = JSON.stringify({ schedules })

    let response = await fetch('/api/schedules', {
      method: form.method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: json
    })

    let data = await response.text();
    alert(data)

    if (response.status === 201) {
      form.reset()
    }

  }

  async main() {
    // Exercise 1: fetch schedules
    await this.fetchSchedules();
    this.alertScheduleTally();

    // Exercise 2: adding staff
    this.newStaffForm.addEventListener('submit', event => this.handleAddStaff(event))

    // Exercise 3: adding schedules
    await this.fetchStaff()
    this.addScheduleBtn.addEventListener('click', event => this.addScheduleTemplate(event))
    this.newScheduleForm.addEventListener('submit', event => this.handleAddSchedule(event))
  }

}


document.addEventListener('DOMContentLoaded', () => {
  new BookingAppUI()

  // document.querySelector('#btnAdd').addEventListener('click', handleNewSchedule)
})