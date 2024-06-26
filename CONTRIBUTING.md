
# Contributing to Discord Interactions Webhook

We welcome contributions to the Discord Interactions Webhook project! Whether you're reporting bugs, improving the documentation, or contributing code, your help is greatly appreciated.

## Table of Contents
1. [Getting Started](#getting-started)
2. [How to Contribute](#how-to-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Enhancements](#suggesting-enhancements)
   - [Contributing Code](#contributing-code)
3. [Local Development](#local-development)
4. [Style Guides](#style-guides)
   - [Code Style](#code-style)
   - [Commit Messages](#commit-messages)
5. [License](#license)
6. [Code of Conduct](#code-of-conduct)

## Getting Started

To get started with contributing to the project, follow these steps:

1. **Fork the Repository**: Click the "Fork" button at the top right of this page to create a copy of the repository on your GitHub account.
2. **Clone Your Fork**: Clone your forked repository to your local machine:
   ```sh
   git clone https://github.com/Chrisae9/discord-interactions-webhook.git
   ```
3. **Set Upstream Remote**: Set the original repository as the upstream remote:
   ```sh
   cd discord-interactions-webhook
   git remote add upstream https://github.com/Chrisae9/discord-interactions-webhook.git
   ```

## How to Contribute

### Reporting Bugs

If you find a bug, please report it by creating an issue in the [GitHub Issue Tracker](https://github.com/Chrisae9/discord-interactions-webhook/issues). Include as much detail as possible, including steps to reproduce the bug, the environment you're using, and any relevant log output.

### Suggesting Enhancements

If you have an idea for an enhancement or new feature, please create an issue in the [GitHub Issue Tracker](https://github.com/Chrisae9/discord-interactions-webhook/issues). Provide a clear description of the enhancement and why it would be beneficial to the project.

### Contributing Code

1. **Create a Branch**: Create a new branch for your work:
   ```sh
   git checkout -b feature/your-feature-name
   ```
2. **Make Changes**: Make your changes to the codebase.
3. **Commit Changes**: Commit your changes with a descriptive commit message:
   ```sh
   git commit -m "Add feature: your-feature-name"
   ```
4. **Push Changes**: Push your changes to your forked repository:
   ```sh
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request**: Create a pull request from your branch to the main repository. Provide a clear description of your changes and why they should be merged.

## Local Development

Most of the setup can be inferred from the basic [README](README.md), but for local development, use the Makefile to run commands:

- **Build the Docker Image Locally**:
  ```sh
  make build
  ```
- **Pull and Push Commands**: You can use the `make pull` and `make push` commands to manage Discord commands.
  ```sh
  make pull
  make push
  ```
- **Run the Application**: Start the application using:
  ```sh
  make dev
  ```
- **Open a Shell in the Container**: Use this command to open a shell in the container:
  ```sh
  make shell
  ```
- **Test Docker Environment**: Check if the Docker environment is set up correctly, including Docker group ID and user permissions:
  ```sh
  make docker-test
  ```
- **Environment Variables Check**: Verify that the environment variables are correctly loaded into the container:
  ```sh
  make env-check
  ```
- **Service Check**: Run a test Docker Compose file from the services directory to ensure services are configured correctly:
  ```sh
  make service-check
  ```
- **Cron Job Check:** Verify that the cron job is set up correctly for the node user:
  ```sh
  make cron-check
  ```


## Style Guides

### Code Style

- Follow the coding style and conventions used in the existing codebase.
- Write clear and concise comments where necessary.
- Ensure your code is properly formatted and linted.

### Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Provide a brief description of the changes made.

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).
