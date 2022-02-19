import * as core from '@actions/core'
import {
  getAllScores,
  getMe,
  getPullRequestScore,
  getWeeksCommits
} from './utils'
import {generatePrComment} from './pull-request-comment'

async function run(): Promise<void> {
  try {
    const commits = await getWeeksCommits()
    const allScores = await getAllScores(commits)

    const me = await getMe()
    const pullRequestScore = await getPullRequestScore()

    const prComment = generatePrComment(allScores, me, pullRequestScore)

    core.setOutput('pr-comment', prComment)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
