import * as core from '@actions/core'
import * as exec from '@actions/exec'

const executeGitCommand = async (args: string[]): Promise<string[]> => {
  const output: string[] = []
  await exec.exec('git', args, {
    silent: true,
    listeners: {
      stdout: (data: Buffer) => {
        output.push(...data.toString().replace(/"/g, '').trim().split('\n'))
      }
    }
  })

  return output
}

export const getCommits = async (): Promise<string[]> => {
  const commits = await executeGitCommand(['log', '--format="%H"'])

  core.info(`commits detected: ${commits}`)
  return commits
}

export const getAuthor = async (commit: string): Promise<string> => {
  const authors = await executeGitCommand(['log', '--format="%ae"', commit])
  return authors[0]
}
