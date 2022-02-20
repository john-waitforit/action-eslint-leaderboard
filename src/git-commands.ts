import * as exec from '@actions/exec'
import {getMonday} from './utils'

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

  try {
    const commits = await executeGitCommand([
      'rev-list',
      'HEAD',
      '--no-merges',
      `--since="${monday.toISOString()}"`
    ])

    return commits
  } catch (e) {
    return []
  }
}

export const getAuthor = async (
  commit: string | undefined
): Promise<string> => {
  const NO_AUTHOR = 'No author found'
  if (!commit) return NO_AUTHOR

  try {
    const authors = await executeGitCommand([
      'show',
      '-s',
      '--format="%cN"',
      commit
    ])
    return authors[0] ?? NO_AUTHOR
  } catch (e) {
    return NO_AUTHOR
  }
}

export const getPullRequestCommits = async (
  baseBranch: string
): Promise<string[]> => {
  try {
    const commits = await executeGitCommand([
      'rev-list',
      'HEAD',
      '--no-merges',
      `^${baseBranch}`
    ])

    return commits
  } catch (e) {
    return []
  }
}

export const getCommitDiff = async (commit: string): Promise<string> => {
  try {
    const diffLines = await executeGitCommand(
      ['diff', `${commit}~`, commit],
      false
    )
    return diffLines[0]
  } catch (e) {
    return ''
  }
}
