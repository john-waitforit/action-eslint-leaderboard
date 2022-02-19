import * as core from '@actions/core'
import * as exec from '@actions/exec'
import gitDiffParser, {Change, File} from 'gitdiff-parser'

const POINTS = {
  NEXT_LINE: 1,
  FILE: 10
} as const

const executeGitCommand = async (
  args: string[],
  splitLines = true
): Promise<string[]> => {
  const output: string[] = []
  await exec.exec('git', args, {
    silent: true,
    listeners: {
      stdout: (data: Buffer) => {
        const outputString = data.toString().replace(/"/g, '').trim()
        if (splitLines) {
          output.push(...outputString.split('\n'))
        } else {
          output.push(outputString)
        }
      }
    }
  })

  return output
}

export const getWeeksCommits = async (): Promise<string[]> => {
  const monday = getMonday(new Date())

  const commits = await executeGitCommand([
    'rev-list',
    '--no-merges',
    '--format="%H"',
    `--since="${monday.toISOString()}"`
  ])

  core.info(`commits detected: ${commits}`)
  return commits
}

export const getAuthor = async (commit: string): Promise<string> => {
  const authors = await executeGitCommand(['log', '--format="%cN"', commit])
  return authors[0] ?? 'No author found'
}

export const getMe = async (): Promise<string> => {
  const names = await executeGitCommand(['config', 'user.name'])
  return names[0] ?? 'No author found'
}

export const getScore = async (commit: string): Promise<number> => {
  try {
    const diffLines = await executeGitCommand(
      ['diff', `${commit}~`, commit],
      false
    )
    const files = gitDiffParser.parse(diffLines[0])

    let score = 0
    for (const file of files) {
      score += getFileScore(file)
    }

    return score
  } catch (e) {
    return 0
  }
}

export const getFileScore = (file: File): number => {
  let score = 0

  for (const chunk of file.hunks) {
    for (const change of chunk.changes) {
      score += getChangeScore(change)
    }
  }

  return score
}

export const containsEslintDisableNextLine = (text: string): boolean =>
  text.trim().includes('eslint-disable-next-line')

export const containsEslintDisableFile = (text: string): boolean =>
  text.trim().includes('eslint-disable ')

export const getChangeScore = (change: Change): number => {
  let score = 0
  const scoreMultiplier = getScoreMultiplier(change)

  if (containsEslintDisableNextLine(change.content)) {
    score += scoreMultiplier * POINTS['NEXT_LINE']
  } else if (containsEslintDisableFile(change.content)) {
    score += scoreMultiplier * POINTS['FILE']
  }

  return score
}

const getScoreMultiplier = (change: Change): number => {
  switch (change.type) {
    case 'delete':
      return 1
    case 'insert':
      return -1
    case 'normal':
      return 0
  }
}

export const getMonday = (inputDate: Date): Date => {
  const monday = new Date(inputDate)

  const day = inputDate.getDay()
  const diff = inputDate.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday

  monday.setDate(diff)
  monday.setHours(1, 0, 0, 0)

  return new Date(monday)
}
