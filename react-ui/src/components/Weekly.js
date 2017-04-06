import React, { PropTypes } from 'react'
import moment from 'moment'

import Row from './Jogs/Row'
import Calendar from './Jogs/Calendar'

const Weekly = ({ startDate, endDate, jogs, onDatesChange }) => {
  if (jogs.length === 0) {
    return <p className='info'>No jogs tracked yet.</p>
  }
  const weekly = summarizeWeeklyJogs(jogs)
  const weeklyKeys = Object.keys(weekly).sort().reverse()
  return (
    <div className='page'>
      <Calendar
        startDate={startDate}
        endDate={endDate}
        onDatesChange={onDatesChange}
      />
      <table>
        <thead>
          <tr>
            <td>Week</td>
            <td>Distance</td>
            <td>Duration</td>
            <td>Speed</td>
          </tr>
        </thead>
        <tbody>
          { weeklyKeys.map((weeklyKey) => <Row jog={weekly[weeklyKey]} key={weeklyKey} />) }
        </tbody>
      </table>
    </div>
  )
}

Weekly.propTypes = {
  jogs: PropTypes.array.isRequired
}

export default Weekly

function summarizeWeeklyJogs (jogs) {
  if (jogs.length === 0) {
    return {}
  }
  const result = {}
  const lastWeek = moment(jogs[0].date).startOf('isoWeek')
  const week = moment(jogs[jogs.length - 1].date).startOf('isoWeek')
  while (week.isSameOrBefore(lastWeek, 'isoWeek')) {
    const date = week.format('YYYY-MM-DD')
    result[date] = { date, distance: 0, duration: moment.duration(0) }
    week.add(1, 'week')
  }

  for (let jog of jogs) {
    const date = moment(jog.date).startOf('isoWeek').format('YYYY-MM-DD')
    result[date].distance += jog.distance
    result[date].duration.add(moment.duration(jog.duration))
  }

  for (let weekly of Object.values(result)) {
    let duration = String(Math.floor(weekly.duration.asHours()))
    duration += moment.utc(weekly.duration.asMilliseconds()).format(':mm:ss')
    weekly.duration = duration
  }

  return result
}

Weekly.propTypes = {
  onDatesChange: PropTypes.func.isRequired,
  jogs: PropTypes.array.isRequired
}
