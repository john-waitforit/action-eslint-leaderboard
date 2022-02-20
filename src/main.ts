import * as core from '@actions/core'
import {getAllScores, getPullRequestScore} from './score'
import {getAuthor, getPullRequestCommits, getWeeksCommits} from './git-commands'
import {generatePrComment} from './pull-request-comment'

async function run(): Promise<void> {
  try {
    const mainBranchName = core.getInput('mainBranchName') || 'main'

    const commits = await getWeeksCommits()
    core.info(`Fetched current week's commits: (${commits.length})`)

    const allScores = await getAllScores(commits)
    core.info(
      `Calculated all score from previous week: ${JSON.stringify(allScores)}`
    )

    const pullRequestCommits = await getPullRequestCommits(mainBranchName)
    core.info(`Fetched pull request commits: (${pullRequestCommits.length})`)

    const me = await getAuthor(pullRequestCommits[0])
    core.info(`Fetched info about current user: ${me}`)

    const pullRequestScore = await getPullRequestScore(pullRequestCommits)
    core.info(`Calculated score of current PR: ${pullRequestScore}`)

    const prComment = generatePrComment(allScores, me, pullRequestScore)

    core.setOutput('pr-comment', prComment)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
