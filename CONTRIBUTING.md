# Contributing

This repository is a **read-only mirror** of the `packages/sdk` and `packages/types`
directories of the Nurama monorepo. It is updated automatically on every production
release, with one squashed commit per release tagged `v<version>`.

- **Bug reports and feature requests:** open an issue here. Please include the SDK
  version (`client.version` or `package.json`) and a minimal reproduction.
- **Pull requests:** not accepted in this repository. Changes are made in the
  monorepo and flow here on the next release. Pull requests opened here are closed
  automatically with a pointer to the issue tracker.
- **Security issues:** do not open a public issue. Use GitHub's private vulnerability
  reporting on this repository.

## Layout

```
src/        TypeScript sources (NuramaClient, BotClient, route modules)
dist/       Built output published to npm as @nurama/sdk
types/      The @nurama/types package this SDK depends on
examples/   Browser and Node usage examples
```

## License

Apache License 2.0. See `LICENSE` and `NOTICE`.
