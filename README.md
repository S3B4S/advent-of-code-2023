# advent-of-code-2023

To install dependencies:

```bash
bun install
```

To test:

```bash
bun test
```

## Scripts

### Scaffold a day
When a new day is released on advent of code, we can run a script to scaffold a dictionary with files and the input of said day.

```bash
bun sd -n name
bun scaffoldDay -n name
```

By default it will pick the current day of the month to use to generate the directory name: `DD_<name>`. You can override this with

```bash
bun sd -n name -d 5
bun scaffoldDay -n name -d 5
```

---

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
