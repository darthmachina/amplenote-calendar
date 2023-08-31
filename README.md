# Amplenote Calendar Plugin

This will create a current month view with the option to link to the daily jot note if it exists for a day under a configurable header that must exist (defaults to Calendar).

The whole section under the header will be replaced, but the rest of the note will be left intact.

**Quick Start**
- On any Note (e.g. a note meant for the Peek Viewer) create a heading (any of H1, H2, or H3) named Calendar
- From the Note menu, choose Calendar: Month
- Marvel at the calendar now appearing on your note.

## Testing

Run `NODE_OPTIONS=--experimental-vm-modules npm test` to run the tests.

If it complains about jsdom being absent, run `npm install -D jest-environment-jsdom` and try again.

### With JetBrains

If you are using a JetBrains IDE (Webstorm, Rubymine, anything that speaks Javascript), you can get an 
excellent debugging environment to run your tests.

[Read how to set up tests with this environment in JetBrains IDEs](https://public.amplenote.com/GPTbAGiRYddSCLtuTXGS1tSo).

### Run tests continuously as modifying the plugin

```bash
NODE_OPTIONS=--experimental-vm-modules npm run test -- --watch
```

## Technologies used to help with this project

* https://esbuild.github.io/getting-started/#your-first-bundle
* https://jestjs.io/
* https://www.gitclear.com
