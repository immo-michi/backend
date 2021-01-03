export const numberExtractor = (any: string): number => {
  let value: any = any

  if (any.includes('-')) {
    value = any.split('-').pop()
  }

  if (any.includes('–')) {
    value = any.split('–').pop()
  }

  value = value.replace(/[,.](\d\d)$/ig, 'D$1')
  value = value.replace(/[^\dD]/ig, '')
  value = value.replace(/[D]/ig, '.')

  value = Number(value)

  if (isNaN(value)) {
    return 0
  }

  return value
}
