## Testing strategy & tips

  * Some of routing functionality are started in a parallel "thread" with the main one, so error from router won't be propagated through to the test suit. If encounter a timeout, then it's probably it.