#! /usr/bin/env node

import drun from '../lib/drun.js'
import { argv } from 'yargs'

// console.log('yargs', {argv})
const promise = drun(argv._[0], argv._[1])
  .catch((c) => process.exit(c))

// test purposes
export default promise
