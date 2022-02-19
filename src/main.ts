import * as core from '@actions/core'
import {getAllScores, getPullRequestScore} from './score'
import {getMe, getWeeksCommits} from './git-commands'
import {generatePrComment} from './pull-request-comment'

async function run(): Promise<void> {
  try {
    const commits = await getWeeksCommits()
    const allScores = await getAllScores(commits)
    core.info(
      `Calculated all score from previous week: ${JSON.stringify(allScores)}`
    )

    const me = await getMe()
    core.info(`Fetched info about current user: ${me}`)
    const pullRequestScore = await getPullRequestScore()
    core.info(`Calculated score of current PR: ${pullRequestScore}`)

    const prComment = generatePrComment(allScores, me, pullRequestScore)

    core.setOutput('pr-comment', prComment)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
