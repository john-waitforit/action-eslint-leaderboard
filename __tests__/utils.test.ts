import {expect, describe, it} from '@jest/globals'
import {getFileScore} from '../src/utils'
import {
  diffWithDisableNextLineRemoved,
  diffWithNewFileDisableAndNextLineRemoved,
  diffWithTwoNewDisableLines
} from './mock-diff'
import gitDiffParser from 'gitdiff-parser'

describe('Score utils', () => {
  describe('getFileScore', () => {
    it('should return +1 for change with deleted eslint-disable-next-line', () => {
      const files = gitDiffParser.parse(diffWithDisableNextLineRemoved)
      expect(files.length === 1)

      expect(getFileScore(files[0])).toBe(1)
    })

    it('should return -2 for change with 2 new eslint-disable-next-line', () => {
      const files = gitDiffParser.parse(diffWithTwoNewDisableLines)
      expect(files.length === 1)

      expect(getFileScore(files[0])).toBe(-2)
    })

    it('should return -9 for change with deleted eslint-disable-next-line and added file ignore', () => {
      const files = gitDiffParser.parse(
        diffWithNewFileDisableAndNextLineRemoved
      )
      expect(files.length === 1)

      expect(getFileScore(files[0])).toBe(-9)
    })
  })
})
