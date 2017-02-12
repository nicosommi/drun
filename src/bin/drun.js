import drun from '../lib/drun.js'
import { argv } from 'yargs'

drun(argv.c)
  .catch((c) => process.exit(c))
