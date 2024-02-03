# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue.

## Pull Request Process

1. Make sure all changes have been tested locally under `npm run build`.
2. Make sure the linter, formatter, and all tests pass:
   ```
   npm run lint
   npm run prettier
   npm test
   ```
3. If the formatter made any new changes, remember to commit them again.
4. Submit a pull request, linking the issue you resolved (i.e. Closes #...).
5. Wait for a review and resolve any changes requested.
6. Once merged into `main`, non-urgent changes will be included in the next extension update in 1-2 weeks.

## Coding Practices

In general, as long as the linter and formatter pass, the code style is fine.
Note that Typescript is used in strict mode.  
### Specific design preferences:
- Prefer reusable, functional code/components
- Prefer `filter/map/reduce/forEach` over `for` loops
- Write custom hooks to fetch data rather than fetching through `useState/useEffect` in components
- Batch state updates when possible:  
  ```setReadyState({ ready: true, error: false })```  
  instead of  
  ```
  setReady(true);
  setError(false);
  ```
- Check for exceptions as much as possible

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
