import * as core from '@actions/core'
import {getAuthor, getScore, getWeeksCommits} from './utils'

async function run(): Promise<void> {
  try {
    const commits = await getWeeksCommits()

    const allScores: Record<string, number> = {}

    for (const commit of commits) {
      const author = await getAuthor(commit)
      const score = await getScore(commit)

      if (author in allScores) {
        allScores[author] += score
      } else {
        allScores[author] = 0
      }
    }

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
