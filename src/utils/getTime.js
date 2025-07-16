import { ref } from 'vue'

/**
 * @description 获取本地时间
 */
export const useTime = (time) => {
  if (time === '' || time === null) return
  const year = ref(0) // 年份
  const month = ref(0) // 月份
  const week = ref('') // 星期几
  const day = ref(0) // 天数
  const hour = ref(0) // 小时
  const minute = ref(0) // 分钟
  const second = ref(0) // 秒
  const nowTime = ref('') // 当前时间
  const date = new Date(time)
  //console.log(date.getFullYear());
  year.value = date.getFullYear()
  month.value = date.getMonth() + 1
  week.value = '日一二三四五六'.charAt(date.getDay())
  day.value = date.getDate()
  hour.value =
    (date.getHours() + '')?.padStart(2, '0') ||
    new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(date.getHours())
  minute.value =
    (date.getMinutes() + '')?.padStart(2, '0') ||
    new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(date.getMinutes())
  second.value =
    (date.getSeconds() + '')?.padStart(2, '0') ||
    new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(date.getSeconds())
  nowTime.value = `${year.value}年${month.value}月${day.value} ${hour.value}:${minute.value}:${second.value}`

  // return { year, month, day, hour, minute, second, week, nowTime }
  return `${year.value}-${month.value}-${day.value} ${hour.value}:${minute.value}:${second.value}`
}