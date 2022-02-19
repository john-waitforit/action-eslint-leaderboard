import * as core from '@actions/core'
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

  const commits = await executeGitCommand([
    'rev-list',
    'HEAD',
    '--no-merges',
    `--since="${monday.toISOString()}"`
  ])

  core.info(`Fetched current week's commits: ${commits}`)
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

export const getPullRequestCommits = async (): Promise<string[]> => {
  const commits = await executeGitCommand([
    'rev-list',
    'HEAD',
    '--no-merges',
    '--format="%H"',
    '^main'
  ])

  core.info(`Pull request commits detected: ${commits}`)
  return commits
}

export const getCommitDiff = async (commit: string): Promise<string> => {
  const diffLines = await executeGitCommand(
    ['diff', `${commit}~`, commit],
    false
  )
  return diffLines[0]
}
