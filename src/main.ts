import * as core from '@actions/core'
import {getAuthor, getCommits} from './utils'

async function run(): Promise<void> {
  try {
    const commits = await getCommits()

    for (const commit of commits) {
      const author = await getAuthor(commit)
      core.info(`author: ${author}`)
    }

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
