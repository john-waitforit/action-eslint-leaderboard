export const containsEslintDisableNextLine = (text: string): boolean =>
  text.trim().includes('eslint-disable-next-line')

export const containsEslintDisableFile = (text: string): boolean =>
  text.trim().includes('eslint-disable ')

export const getMonday = (inputDate: Date): Date => {
  const monday = new Date(inputDate)

  const day = inputDate.getDay()
  const diff = inputDate.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday

  monday.setUTCDate(diff)
  monday.setUTCHours(0, 0, 0, 0)

  return new Date(monday)
}

export const isFileIgnored = (
  ignorePattern: string,
  filePath: string
): boolean => {
  if (!ignorePattern) {
    return false
  }
  return filePath.includes(ignorePattern)
}
