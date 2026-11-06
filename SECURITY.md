# Security

Do not include credentials or private source code in public issues. Report vulnerabilities privately using GitHub private vulnerability reporting when available, or contact contato@brunnodev.store.

The CLI reads local files and invokes only `git diff` when explicitly requested. It never executes project scripts. Environment files, symlinks and common generated folders are skipped. These exclusions are not a secret scanner: inspect exported reports before sharing. The browser processes selected files locally; external links navigate only when clicked.
