export const numberExtractor = (any: string): number => {
  let value: any = any

  if (value.includes('-')) {
    value = value.split('-').pop()
  }

  if (value.includes('–')) {
    value = value.split('–').pop()
  }

  value = value.replace('ab ', '')

  value = value.replace(/[,.](\d\d)($|\s)/ig, 'D$1')
  value = value.replace(/[^\dD]/ig, '')
  value = value.replace(/[D]/ig, '.')

  value = Number(value)

  if (isNaN(value)) {
    return 0
  }

  return value
}
