import * as core from '@actions/core'
import * as github from '@actions/github'
import {getAllScores, getPullRequestScore} from './score'
import {getAuthor, getPullRequestCommits, getWeeksCommits} from './git-commands'
// eslint-disable-next-line import/no-unresolved
import {PullRequestEvent} from '@octokit/webhooks-definitions/schema'
import {generatePrComment} from './pull-request-comment'

async function run(): Promise<void> {
  try {
    const commits = await getWeeksCommits()
    core.info(`Fetched current week's commits: (${commits.length})`)
    core.info(`${commits}`)

    const allScores = await getAllScores(commits)
    core.info(`Calculated all scores from previous week:`)
    core.info(`${JSON.stringify(allScores, null, 4)}`)

    let pullRequestCommits: string[] = []

    if (github.context.eventName === 'pull_request') {
      const githubPayload = github.context.payload as PullRequestEvent
      pullRequestCommits = await getPullRequestCommits(
        githubPayload.pull_request.base.ref
      )
      core.info(`Fetched pull request commits: (${pullRequestCommits.length})`)
    }

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
