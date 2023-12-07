A note about `ts-pattern`:

Interestingly, I've noticed that refactoring the solution to use `ts-pattern`, the runtime has increased.

Before `ts-pattern` the average runtime of the whole test suite is around ~30ms.
After adding it, it's ~40ms.

I do like the readability better, so I'm keeping it.
